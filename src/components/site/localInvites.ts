// Client-side helpers for the `myInvites` localStorage list written by the builder after an
// anonymous (or logged-in) invite is created. Shape: { slug, manageToken, title, createdAt }[].

export interface LocalInvite {
  slug: string;
  manageToken: string;
  title: string;
  createdAt: string;
}

const KEY = "myInvites";

export function readLocalInvites(): LocalInvite[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is LocalInvite =>
        !!x && typeof x === "object" && typeof (x as LocalInvite).slug === "string" && typeof (x as LocalInvite).manageToken === "string",
    );
  } catch {
    return [];
  }
}

export function removeLocalInvite(manageToken: string) {
  try {
    const next = readLocalInvites().filter((i) => i.manageToken !== manageToken);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function localManageTokens(): string[] {
  return readLocalInvites().map((i) => i.manageToken);
}
