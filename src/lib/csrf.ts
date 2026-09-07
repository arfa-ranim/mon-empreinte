// src/lib/csrf.ts
import { cookies } from "next/headers";

export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

export async function setCSRFToken() {
  const cookieStore = await cookies();
  const token = generateCSRFToken();
  cookieStore.set("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return token;
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const stored = cookieStore.get("csrf_token")?.value;
  return stored === token;
}