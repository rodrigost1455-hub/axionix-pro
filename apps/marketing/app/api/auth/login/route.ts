import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { comparePassword, signJWT } from "@axionix/core";
import { errorResponse, successResponse } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // Rate limit: 15 attempts per 15 minutes per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const rl = rateLimit({ key: `login:${ip}`, limit: 15, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return errorResponse("Demasiados intentos. Espera un momento.", 429);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Cuerpo de solicitud inválido");

    const result = schema.safeParse(body);
    if (!result.success) return errorResponse("Datos inválidos");

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { business: true },
    });

    // Constant-time comparison to prevent user enumeration
    const validPassword = user ? await comparePassword(password, user.passwordHash) : false;

    if (!user || !validPassword) {
      return errorResponse("Email o contraseña incorrectos", 401);
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      hasOnboarding: !!user.business,
    });

    const response = successResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      hasOnboarding: !!user.business,
    });
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("[login]", err);
    return errorResponse("Error al iniciar sesión. Intenta de nuevo.", 500);
  }
}
