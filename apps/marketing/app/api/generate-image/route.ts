import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, getMonthlyUsage, incrementUsage } from "@/lib/auth";
import { generateImage } from "@axionix/services";
import { canGenerate } from "@axionix/core";
import { errorResponse, successResponse, unauthorizedResponse, forbiddenResponse, tooManyRequestsResponse } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import type { Plan } from "@axionix/core";

const schema = z.object({
  idea: z.string().min(5).max(300),
  estilo: z.enum(["fotorrealista", "ilustración", "minimalista", "cinematic", "profesional"]).optional(),
  negocio: z.string().min(2).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    // Rate limit: 10 image requests per hour per user
    const rl = rateLimit({ key: `image:${session.userId}`, limit: 10, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) return tooManyRequestsResponse();

    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Datos inválidos");

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message ?? "Datos inválidos");
    }

    // Check plan — images require PRO or PREMIUM
    const usage = await getMonthlyUsage(session.userId);
    const check = canGenerate(session.plan as Plan, "image", {
      text: usage.textCount,
      image: usage.imageCount,
      video: usage.videoCount,
    });
    if (!check.allowed) return forbiddenResponse(check.reason);

    const { idea, estilo = "profesional", negocio } = result.data;

    const prompt = `Marketing image for ${negocio}: ${idea}. Style: ${estilo}. Clean, modern, commercial quality, brand-ready.`;

    const imageUrl = await generateImage(prompt, estilo === "cinematic" ? "vivid" : "natural");

    await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "IMAGE",
        input: { idea, estilo, negocio },
        output: { image_url: imageUrl },
      },
    });

    await incrementUsage(session.userId, "image");

    return successResponse({ image_url: imageUrl });
  } catch (err) {
    console.error("[generate-image]", err);
    return errorResponse("Error al generar la imagen.", 500);
  }
}
