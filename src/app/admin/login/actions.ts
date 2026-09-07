"use server";
import { setCSRFToken } from "@/lib/csrf";

export async function getCSRFToken() {
  return await setCSRFToken();
}