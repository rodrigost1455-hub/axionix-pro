import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { signJWT } from "@axionix/core";
import { errorResponse, successResponse, unauthorizedResponse } from "@/lib/api";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";

const schema = z.object({
  type: z.string().min(2).max(100),
  objective: z.enum(["sales", "branding", "followers", "traffic", "engagement"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  niche: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().max(60).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Datos inválidos");

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message ?? "Datos inválidos");
    }

    const data = result.data;

    const business = await prisma.business.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        type: data.type,
        objective: data.objective,
        level: data.level,
        niche: data.niche,
        description: data.description,
        website: data.website || null,
        instagram: data.instagram,
      },
      update: {
        type: data.type,
        objective: data.objective,
        level: data.level,
        niche: data.niche,
        description: data.description,
        website: data.website || null,
        instagram: data.instagram,
      },
    });

    // Refresh token with hasOnboarding = true
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return errorResponse("Usuario no encontrado", 404);

    const newToken = await signJWT({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      hasOnboarding: true,
    });

    const response = successResponse(business);
    response.cookies.set(COOKIE_NAME, newToken, COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("[onboarding]", err);
    return errorResponse("Error al guardar la información. Intenta de nuevo.", 500);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const business = await prisma.business.findUnique({
      where: { userId: session.userId },
    });

    return successResponse(business);
  } catch {
    return errorResponse("Error del servidor", 500);
  }
}
