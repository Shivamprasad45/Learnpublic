import { TwitterApi } from 'twitter-api-v2';

interface PostToXParams {
  text: string;
}

interface PostToXResponse {
  success: boolean;
  tweetId?: string;
  error?: string;
  errorDetails?: unknown;
}

export default async function PostToX(params: PostToXParams): Promise<PostToXResponse> {
  try {
    
    console.log('Attempting to post to X...');
    
    // Check if credentials exist
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      throw new Error('Missing Twitter API credentials');
    }

    // Try OAuth 1.0a User Context (for posting tweets)
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Verify credentials before posting
    const me = await client.v2.me();
    console.log('Authenticated as:', me.data.username);

    // Truncate text if too long (X has 280 char limit)
    const tweetText = params.text.length > 280 
      ? params.text.substring(0, 277) + '...' 
      : params.text;

    // Post the tweet
    const tweet = await client.v2.tweet(tweetText);
    console.log('Tweet posted successfully:', tweet.data.id);

    return {
      success: true,
      tweetId: tweet.data.id,
    };
  } catch (error: unknown) {
    console.error('Error posting to X:', error);
    
    // Log detailed error information
    if (error && typeof error === 'object' && 'data' in error) {
      console.error('Error details:', JSON.stringify((error as any).data, null, 2));
    }
    
    return {
      success: false,
      error: 'Failed to post to X',
      errorDetails: error || error,
    };
  }
}