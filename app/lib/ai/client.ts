import "server-only";
import { GoogleGenAI } from "@google/genai";

const KEY = "REDACTED";

export const gemini = KEY ? new GoogleGenAI({ apiKey: KEY}) : null;

export function ensureAI() {
    if(!gemini) throw new Error("Falta la API KEY");
}