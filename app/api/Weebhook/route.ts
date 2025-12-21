import DbConnect from "@/lib/mongodb";
import Config from "@/models/Config";
import { NextRequest, NextResponse } from "next/server";
// import { encode } from '@toon-format/toon';
import Ai from "@/app/utils/Ai";
import PostToX from "@/app/utils/PostToX"; // Import the X posting utility

export async function GET(request: NextRequest) {
  console.log("ok")
  try {
    await DbConnect();
     const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('userId');
    console.log(user_id ,"User id kcdkfklsfkk")
    const config = await Config.findOne({USER_ID:user_id});
    
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Ensure required GitHub credentials exist
    const { GITHUB_USERNAME, GITHUB_REPO, GITHUB_TOKEN } = config;
      return NextResponse.json({ error: 'Configuration is missing required GitHub credentials' }, { status: 400 });

    // 1️⃣ Get latest commit (changed from 3 to 1 as per_page=1)
    const commitsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits?per_page=1`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "learn-in-public-app",
        },
      }
    );

      return NextResponse.json({ error: 'Failed to fetch commits from GitHub' }, { status: commitsRes.status });

    const commits = await commitsRes.json();

    // 2️⃣ For each commit, get changed files + actual code
    const commitDetails = await Promise.all(
      commits.map(async (commit: { sha: string; commit: { message: string; author: { date: string } } }) => {
        const detailsRes = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits/${commit.sha}`,
          {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              "User-Agent": "learn-in-public-app",
            },
          }
        );
        const details = await detailsRes.json();

        const filesWithCode = await Promise.all(
          (details.files || []).map(async (file: { filename: string; status: string }) => {
            try {
              const codeRes = await fetch(
                `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${commit.sha}/${file.filename}`,
                {
                  headers: { Authorization: `token ${GITHUB_TOKEN}` },
                }
              );
              const code = await codeRes.text();

              return {
                filename: file.filename,
                status: file.status,
                code: code.slice(0, 1000), // limit to first 1000 chars
              };
            } catch (error) {
              return { filename: file.filename, error: "Unable to fetch code" };
            }
          })
        );

        return {
          sha: commit.sha,
          message: commit.commit.message,
          date: commit.commit.author.date,
          files: filesWithCode,
        };
      })
    );

    // 3️⃣ Generate AI posts for each commit and post to X
    const postsWithAI = await Promise.all(
      commitDetails.map(async (commit) => {
        // Create a prompt for the AI to generate a learning post
        const aiPrompt = `
          Based on this GitHub commit information, create an educational "Learn in Public" style post:
          
          Commit Message: ${commit.message}
          Files Changed: ${commit.files.map((f: { filename: string; code?: string }) => f.filename).join(', ')}
          Code Changes: ${commit.files.map((f: { filename: string; code?: string }) => 
            f.code ? `File: ${f.filename}\nCode snippet: ${f.code}` : ''
          ).join('\n')}
          
          Please create an engaging social media post that:
          1. Explains what was learned or built
          2. Shares key insights from the code changes
          3. Is educational and helpful for other developers
          4. Has a friendly, conversational tone
          5. Includes relevant hashtags
          
          Format as a Twitter/X style post (280 characters max).
        `;

        try {
          const aiResponse = await Ai({
            prompt: aiPrompt,
            model: "gemini-2.5-flash",
            temperature: 0.8,
            maxTokens: 500
          });
          
          const generatedPost = aiResponse.success ? aiResponse.response : "Failed to generate post";
          console.log(generatedPost ,"generated post")
          // Post to X if AI generation was successful
          let xPostResult = null;
          if (aiResponse.success && generatedPost) {
            xPostResult = await PostToX({ text: generatedPost });
          }
          
          return {
            ...commit,
            aiPost: generatedPost,
            aiError: aiResponse.success ? null : aiResponse.error,
            xPostStatus: xPostResult?.success ? 'posted' : 'failed',
            tweetId: xPostResult?.tweetId,
            xPostError: xPostResult?.error
          };
        } catch (error: unknown) {
          return {
            ...commit,
            aiPost: "Error generating AI post",
            aiError: error instanceof Error ? error.message : "Unknown error",
            xPostStatus: 'skipped'
          };
        }
      })
    );
    return NextResponse.json(postsWithAI);
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 });
  }
}