import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, getMonthlyUsage, incrementUsage } from "@/lib/auth";
import { generateText } from "@axionix/services";
import { canGenerate } from "@axionix/core";
import { errorResponse, successResponse, unauthorizedResponse, forbiddenResponse, tooManyRequestsResponse } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import type { Plan } from "@axionix/core";

const schema = z.object({
  idea: z.string().min(5).max(500),
  tipo: z.enum(["reel", "carrusel", "historia", "post", "email", "tweet", "guion", "caption"]),
  negocio: z.string().min(2).max(100),
  objetivo: z.string().optional(),
  tono: z.enum(["profesional", "casual", "humorístico", "inspiracional", "urgente"]).optional(),
});

const SYSTEM_PROMPT = `Eres un copywriter experto en redes sociales con experiencia en marcas virales.
Creas contenido que engancha desde la primera línea, conecta emocionalmente y convierte.
Responde ÚNICAMENTE con JSON válido.`;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const rl = rateLimit({ key: `content:${session.userId}`, limit: 30, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) return tooManyRequestsResponse();

    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Datos inválidos");

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message ?? "Datos inválidos");
    }

    const usage = await getMonthlyUsage(session.userId);
    const check = canGenerate(session.plan as Plan, "text", {
      text: usage.textCount,
      image: usage.imageCount,
      video: usage.videoCount,
    });
    if (!check.allowed) return forbiddenResponse(check.reason);

    const { idea, tipo, negocio, objetivo, tono = "profesional" } = result.data;

    const userPrompt = `
Crea contenido de tipo "${tipo}" para un negocio de "${negocio}".
Idea base: ${idea}
${objetivo ? `Objetivo: ${objetivo}` : ""}
Tono: ${tono}

Devuelve JSON con esta estructura:
{
  "copy": "texto principal listo para publicar",
  "hook": "primera línea gancho irresistible (máx 10 palabras)",
  "body": "desarrollo del contenido",
  "cta": "llamada a la acción",
  "hashtags": ["#hashtag1", "#hashtag2", ...],
  "script": "guion completo si es video/reel (incluir indicaciones de escena)",
  "variations": ["variación alternativa 1", "variación alternativa 2"]
}
`.trim();

    const raw = await generateText({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      model: "gpt-4o",
      temperature: 0.85,
      maxTokens: 2000,
      responseFormat: "json",
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return errorResponse("Error al procesar la respuesta de IA.", 500);
    }

    await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "CONTENT",
        input: { idea, tipo, negocio, objetivo, tono },
        output: parsed as object,
      },
    });

    await incrementUsage(session.userId, "text");

    return successResponse(parsed);
  } catch (err) {
    console.error("[generate-content]", err);
    return errorResponse("Error al generar el contenido.", 500);
  }
}
