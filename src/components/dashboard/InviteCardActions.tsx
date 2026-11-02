"use client";

import Link from "next/link";
import { useState } from "react";
import { copyText, useShareUrl, whatsappShareHref } from "./useShareUrl";
import { WhatsAppIcon } from "./ShareLinkBox";
import { DeleteInviteButton } from "./DeleteInviteButton";

const btn =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ring-1";

export function InviteCardActions({ id, slug, title }: { id: string; slug: string; title: string }) {
  const url = useShareUrl(slug);
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/dashboard/invites/${id}`}
          className={`${btn} col-span-2 bg-brand text-white ring-brand hover:bg-brand-dark sm:col-span-1`}
        >
          View RSVPs
        </Link>
        <Link href={`/create?edit=${id}`} className={`${btn} bg-white text-brand-dark ring-brand/20 hover:bg-cream`}>
          ✏️ Edit
        </Link>
        <a
          href={`/i/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-white text-brand-dark ring-brand/20 hover:bg-cream`}
        >
          Open ↗
        </a>
        <button
          type="button"
          onClick={async () => {
            if (await copyText(url)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }
          }}
          className={`${btn} bg-white text-brand-dark ring-brand/20 hover:bg-cream`}
          aria-live="polite"
        >
          {copied ? "Copied ✓" : "🔗 Copy link"}
        </button>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <a
          href={whatsappShareHref(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-[#25D366] text-white ring-[#25D366] hover:brightness-95`}
        >
          <WhatsAppIcon /> Share on WhatsApp
        </a>
        <DeleteInviteButton inviteId={id} title={title} />
      </div>
    </div>
  );
}
