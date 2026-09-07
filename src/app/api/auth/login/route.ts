import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { z } from "zod";
import { ratelimit } from "@/lib/rate-limit";
import { validateCSRFToken } from "@/lib/csrf"; 

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  // 1️⃣ Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  // 2️⃣ CSRF validation (NEW)
  const csrfToken = request.headers.get("x-csrf-token");
  if (!csrfToken || !(await validateCSRFToken(csrfToken))) {
    return NextResponse.json(
      { error: "CSRF token invalide" },
      { status: 403 }
    );
  }

  // 3️⃣ Original login logic
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const token = await createToken(user.id, user.email);
    await setAuthCookie(token);

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}