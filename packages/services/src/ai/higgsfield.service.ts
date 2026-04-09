/**
 * Higgsfield AI Video Generation Service
 * Phase 3 — Video generation via Higgsfield API
 * @see https://higgsfield.ai
 */

export interface VideoGenerationOptions {
  idea: string;
  script: string;
  style?: string;
  duration?: number;
}

export interface VideoGenerationResult {
  video_url: string;
  status: "pending" | "processing" | "completed" | "failed";
  jobId?: string;
}

export async function generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) throw new Error("HIGGSFIELD_API_KEY is not set");

  const { idea, script, style = "cinematic", duration = 15 } = options;

  const response = await fetch("https://api.higgsfield.ai/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: `${idea}\n\nScript: ${script}`,
      style,
      duration,
      aspect_ratio: "9:16", // Vertical for social media
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Unknown error");
    throw new Error(`Higgsfield API error: ${response.status} ${error}`);
  }

  const data = await response.json() as { video_url?: string; job_id?: string; status?: string };

  return {
    video_url: data.video_url ?? "",
    status: (data.status as VideoGenerationResult["status"]) ?? "pending",
    jobId: data.job_id,
  };
}

export async function checkVideoStatus(jobId: string): Promise<VideoGenerationResult> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) throw new Error("HIGGSFIELD_API_KEY is not set");

  const response = await fetch(`https://api.higgsfield.ai/v1/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to check video status: ${response.status}`);
  }

  const data = await response.json() as { video_url?: string; status?: string; job_id?: string };
  return {
    video_url: data.video_url ?? "",
    status: (data.status as VideoGenerationResult["status"]) ?? "pending",
    jobId: data.job_id ?? jobId,
  };
}
