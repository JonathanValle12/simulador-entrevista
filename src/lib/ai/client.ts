import "server-only";

import { GoogleGenAI } from "@google/genai";

export function getGemini() {
    const key = process.env.GEMINI_API_KEY; 
    if(!key) throw new Error("Fatla la API KEY");
    return new GoogleGenAI({ apiKey: key });
}