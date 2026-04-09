import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
    _client = new OpenAI({ apiKey, timeout: 30_000, maxRetries: 3 });
  }
  return _client;
}

export interface GenerateTextOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    model = "gpt-4o",
    temperature = 0.8,
    maxTokens = 2500,
    responseFormat = "text",
  } = options;

  const client = getClient();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
    response_format: responseFormat === "json" ? { type: "json_object" } : { type: "text" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty response");
  return content;
}

export async function generateImage(prompt: string, style = "vivid"): Promise<string> {
  const client = getClient();

  const response = await client.images.generate({
    model: "dall-e-3",
    prompt: `${prompt}. Professional marketing image, high quality, commercial use.`,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: style === "vivid" ? "vivid" : "natural",
  });

  const url = response.data[0]?.url;
  if (!url) throw new Error("OpenAI image generation returned no URL");
  return url;
}
