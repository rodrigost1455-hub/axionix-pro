import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, getMonthlyUsage, incrementUsage } from "@/lib/auth";
import { generateVideo } from "@axionix/services";
import { canGenerate } from "@axionix/core";
import { errorResponse, successResponse, unauthorizedResponse, forbiddenResponse, tooManyRequestsResponse } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import type { Plan } from "@axionix/core";

const schema = z.object({
  idea: z.string().min(5).max(300),
  script: z.string().min(10).max(1000),
  estilo: z.enum(["cinematic", "documental", "animado", "lifestyle", "ugc"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const rl = rateLimit({ key: `video:${session.userId}`, limit: 5, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) return tooManyRequestsResponse();

    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Datos inválidos");

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message ?? "Datos inválidos");
    }

    // Check plan — video requires PREMIUM
    const usage = await getMonthlyUsage(session.userId);
    const check = canGenerate(session.plan as Plan, "video", {
      text: usage.textCount,
      image: usage.imageCount,
      video: usage.videoCount,
    });
    if (!check.allowed) return forbiddenResponse(check.reason);

    const { idea, script, estilo = "cinematic" } = result.data;

    const videoResult = await generateVideo({ idea, script, style: estilo, duration: 15 });

    await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "VIDEO",
        input: { idea, script, estilo },
        output: videoResult,
      },
    });

    await incrementUsage(session.userId, "video");

    return successResponse(videoResult);
  } catch (err) {
    console.error("[generate-video]", err);
    return errorResponse("Error al generar el video.", 500);
  }
}
