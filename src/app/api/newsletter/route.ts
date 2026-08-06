import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const { email } = schema.parse(await request.json());

    // Store in database
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Optional: Send to Brevo/Mailchimp
    // await addToBrevo(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}