import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface AiParams {
    prompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

interface AiResponse {
    success: boolean;
    response: string | null;
    model?: string;
    error?: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}

export default async function Ai(params: AiParams): Promise<AiResponse> {
  console.log(
    "Using Gemini API Key:",
    process.env.GOOGLE_AI_API_KEY ? "Available" : "Not Set"
  );

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent(params.prompt);
    const output = result.response.text();
    console.log(output ,"out put is here ")
   
    return {success: true, response: output, model: "gemini-2.5-flash" ,  error: undefined , usage: undefined };
  } catch (err) {
    console.error("Gemini parsing failed:", err);
    return { success: false, response: null, error: (err as Error).message };
  }
  
}