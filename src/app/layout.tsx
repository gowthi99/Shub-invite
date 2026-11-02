import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Shubh Invites — Beautiful online invitations", template: "%s · Shubh Invites" },
  description:
    "Create stunning animated invitations for weddings, haldi, mehndi, sangeet, birthdays and more. Scratch-to-reveal dates, countdowns, maps and RSVPs — share with one link.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b4235a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
