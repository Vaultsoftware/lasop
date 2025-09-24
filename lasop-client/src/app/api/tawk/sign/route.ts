// =============================================================
// File: src/app/api/tawk/sign/route.ts
// =============================================================
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
    }
    const secret = process.env.TAWK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "MISSING_TAWK_SECRET" }, { status: 500 });
    }
    const hash = crypto.createHmac("sha256", secret).update(email).digest("hex");
    return NextResponse.json({ hash });
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }
}
