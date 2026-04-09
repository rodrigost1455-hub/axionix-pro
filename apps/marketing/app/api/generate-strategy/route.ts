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
  tipo_negocio: z.string().min(2).max(100),
  objetivo: z.string().min(2).max(100),
  nivel_actual: z.string().min(2).max(60),
  niche: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});

const SYSTEM_PROMPT = `Eres un experto en marketing digital con más de 15 años de experiencia trabajando con marcas globales y startups.
Tu tarea es generar estrategias de marketing ESPECÍFICAS, ACCIONABLES y NO GENÉRICAS.
Siempre incluye ejemplos concretos, métricas esperadas, y tácticas implementables esta semana.
Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.`;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    // Rate limit: 30 requests per hour per user
    const rl = rateLimit({ key: `strategy:${session.userId}`, limit: 30, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) return tooManyRequestsResponse();

    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Datos inválidos");

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message ?? "Datos inválidos");
    }

    // Check plan limits
    const usage = await getMonthlyUsage(session.userId);
    const check = canGenerate(session.plan as Plan, "text", {
      text: usage.textCount,
      image: usage.imageCount,
      video: usage.videoCount,
    });
    if (!check.allowed) return forbiddenResponse(check.reason);

    const { tipo_negocio, objetivo, nivel_actual, niche, description } = result.data;

    const userPrompt = `
Genera una estrategia de marketing completa para:
- Tipo de negocio: ${tipo_negocio}
${niche ? `- Nicho específico: ${niche}` : ""}
${description ? `- Descripción: ${description}` : ""}
- Objetivo principal: ${objetivo}
- Nivel actual: ${nivel_actual}

Devuelve un JSON con esta estructura EXACTA:
{
  "strategy": "descripción detallada de la estrategia (200-300 palabras), específica para este negocio",
  "channels": ["canal1", "canal2", ...],
  "kpis": ["KPI1", "KPI2", ...],
  "content_plan": [
    {
      "day": "Lunes",
      "type": "Reel / Carrusel / Historia / Post / Email / etc",
      "idea": "idea específica de contenido",
      "hook": "gancho de apertura irresistible",
      "cta": "llamada a la acción concreta"
    }
  ],
  "quick_wins": ["acción rápida 1", "acción rápida 2", "acción rápida 3"]
}

El content_plan debe cubrir 7 días con ideas específicas para ${tipo_negocio}.
`.trim();

    const raw = await generateText({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      model: "gpt-4o",
      temperature: 0.8,
      maxTokens: 3000,
      responseFormat: "json",
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return errorResponse("Error al procesar la respuesta de IA. Intenta de nuevo.", 500);
    }

    // Save to DB
    await prisma.generation.create({
      data: {
        userId: session.userId,
        type: "STRATEGY",
        input: { tipo_negocio, objetivo, nivel_actual, niche, description },
        output: parsed as object,
      },
    });

    await incrementUsage(session.userId, "text");

    return successResponse(parsed);
  } catch (err) {
    console.error("[generate-strategy]", err);
    const message = err instanceof Error && err.message.includes("API key")
      ? "Servicio de IA no configurado"
      : "Error al generar la estrategia. Intenta de nuevo.";
    return errorResponse(message, 500);
  }
}
