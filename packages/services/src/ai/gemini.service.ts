import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

export interface GeminiTextOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}

export async function generateTextWithGemini(options: GeminiTextOptions): Promise<string> {
  const { systemPrompt, userPrompt, model = "gemini-1.5-pro", temperature = 0.8 } = options;

  const client = getClient();
  const genModel = client.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: { temperature },
  });

  const result = await genModel.generateContent(userPrompt);
  const text = result.response.text();
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}
