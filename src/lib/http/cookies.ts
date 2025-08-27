import { NextResponse } from "next/server";

export const IS_PROD = process.env.NODE_ENV === "production";

const base = {
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    secure: IS_PROD
}

export function setSessionCookie(res: NextResponse, id: string) {
    res.cookies.set("interview_session", id, base);
}

export function clearSessionCookie(res: NextResponse) {
    res.cookies.set("interview_session", "", { ...base, maxAge: 0});
}