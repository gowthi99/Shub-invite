import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { safe } from "../../_lib/http";

export const runtime = "nodejs";

export const POST = safe(async () => {
  await destroySession();
  return NextResponse.json({ ok: true });
});
