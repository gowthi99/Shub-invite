import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthShell } from "@/components/site/AuthShell";
import { AuthForm } from "@/components/site/AuthForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ claim?: string | string[] }> }) {
  const { claim } = await searchParams;
  // Logged-in users are sent to the dashboard, unless they came to attach (claim) an invitation:
  // then they re-authenticate here so the API can attach it to their account.
  if (!claim && (await getSessionUser())) redirect("/dashboard");
  return (
    <AuthShell>
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
