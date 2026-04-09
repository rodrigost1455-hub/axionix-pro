import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword, signJWT } from "@axionix/core";
import { errorResponse, successResponse } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  name: z.string().min(2, "Nombre muy corto").max(60),
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 registrations per hour per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const rl = rateLimit({ key: `register:${ip}`, limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) return errorResponse("Demasiados intentos. Espera un momento.", 429);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return errorResponse("Cuerpo de solicitud inválido");

    const result = schema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message ?? "Datos inválidos");
    }

    const { email, password, name } = result.data;

    // Password strength validation
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return errorResponse(pwCheck.message ?? "Contraseña inválida");

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return errorResponse("Ya existe una cuenta con ese email", 409);

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        plan: "FREE",
      },
    });

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      hasOnboarding: false,
    });

    const response = successResponse(
      { id: user.id, email: user.email, name: user.name, plan: user.plan },
      201
    );
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("[register]", err);
    return errorResponse("Error al crear la cuenta. Intenta de nuevo.", 500);
  }
}
