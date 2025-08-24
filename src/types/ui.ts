export type TabKey = "detalles" | "general" | "recomendaciones";

export type HUDSnapshot = {
    total: number;
    answered: number;
    completed?: number;
    elapsedSec: number;
    remainingSec: number;
    paused: boolean;
}