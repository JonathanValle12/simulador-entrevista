import "server-only";
import { GoogleGenAI } from "@google/genai";

const KEY = process.env.GEMINI_API_KEY;

export const gemini = KEY ? new GoogleGenAI({ apiKey: KEY}) : null;

export function ensureAI() {
    if(!gemini) throw new Error("Falta la API KEY");
}