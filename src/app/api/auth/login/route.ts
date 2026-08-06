import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { z } from "zod";
// We import it, but we comment out its usage below
import { ratelimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  // Rate limiting is DISABLED to prevent server crash on launch.
  // If you want to re-enable it later, you must add UPSTASH_REDIS env vars to Vercel.
  // const ip = request.headers.get("x-forwarded-for") || "anonymous";
  // const { success } = await ratelimit.limit(ip);
  // if (!success) {
  //   return NextResponse.json(
  //     { error: "Trop de tentatives. Réessayez dans une minute." },
  //     { status: 429 }
  //   );
  // }
  
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