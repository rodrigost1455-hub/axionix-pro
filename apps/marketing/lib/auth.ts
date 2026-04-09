import { cookies } from "next/headers";
import { verifyJWT } from "@axionix/core";
import type { JWTPayload } from "@axionix/core";
import { prisma } from "./prisma";

export const COOKIE_NAME = "axionix-token";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

/**
 * Get the current session from the cookie (Server Component safe).
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

/**
 * Get full user with business from DB. Throws if not found.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { business: true },
  });

  return user;
}

/**
 * Get current month's usage for a user.
 */
export async function getMonthlyUsage(userId: string) {
  const period = new Date().toISOString().slice(0, 7); // YYYY-MM
  const usage = await prisma.monthlyUsage.findUnique({
    where: { userId_period: { userId, period } },
  });
  return usage ?? { textCount: 0, imageCount: 0, videoCount: 0 };
}

/**
 * Increment usage counter for a user. Creates record if needed.
 */
export async function incrementUsage(
  userId: string,
  type: "text" | "image" | "video"
): Promise<void> {
  const period = new Date().toISOString().slice(0, 7);
  const field = type === "text" ? "textCount" : type === "image" ? "imageCount" : "videoCount";

  await prisma.monthlyUsage.upsert({
    where: { userId_period: { userId, period } },
    create: { userId, period, [field]: 1 },
    update: { [field]: { increment: 1 } },
  });
}
