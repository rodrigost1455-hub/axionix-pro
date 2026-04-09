import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        hasOnboarding: !!user.business,
        business: user.business,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 });
  }
}
