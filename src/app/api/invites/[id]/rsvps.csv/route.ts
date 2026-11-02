import type { NextRequest } from "next/server";
import { listRsvps } from "@/lib/invites";
import { isCoupleOccasion } from "@/lib/types";
import { authorizeInvite, safe } from "../../../_lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const STATUS: Record<string, string> = { yes: "Attending", no: "Not attending", maybe: "Maybe" };

function cell(v: unknown): string {
  let s = v == null ? "" : String(v);
  // Neutralise spreadsheet formula injection (=, +, -, @ at the start of a cell).
  // Plain phone numbers like "+91 98765 43210" are left alone.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s()-]+$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function fileBase(names: string[]) {
  const base = names
    .filter(Boolean)
    .join("-")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .toLowerCase()
    .slice(0, 60);
  return base ? `${base}-rsvps` : "rsvps";
}

export const GET = safe(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params;
  const auth = await authorizeInvite(id, req.nextUrl.searchParams.get("token"));
  if (!auth.ok) return auth.response;

  const { data } = auth.invite;
  const eventNames = new Map(data.events.map((e) => [e.id, e.name]));
  const rsvps = await listRsvps(id);

  const rows: unknown[][] = [["Name", "Phone", "Status", "Guests", "Events", "Message", "Responded At"]];
  for (const r of rsvps) {
    rows.push([
      r.name,
      r.phone ?? "",
      STATUS[r.status] ?? r.status,
      r.guests,
      r.eventIds.map((e) => eventNames.get(e)).filter(Boolean).join("; "),
      r.message ?? "",
      new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }),
    ]);
  }
  const csv = "﻿" + rows.map((row) => row.map(cell).join(",")).join("\r\n") + "\r\n";

  const names = [data.primaryName, isCoupleOccasion(data.occasion) ? data.secondaryName ?? "" : ""];
  const ascii = `${fileBase(names)}.csv`;
  const utf8 = `${names.filter(Boolean).join("-").replace(/[\\/:*?"<>|\r\n]/g, "").slice(0, 80) || "rsvps"}-rsvps.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(utf8)}`,
      "Cache-Control": "no-store",
    },
  });
});
