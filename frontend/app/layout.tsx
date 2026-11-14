import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voting Auditability Tool v0.1",
  description:
    "Sistem pemungutan suara eksperimental dengan auditabilitas independen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-slate-200/80 bg-[#f7f6f2]">
          <nav
            aria-label="Navigasi utama"
            className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10"
          >
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-slate-950"
            >
              VAT <span className="font-normal text-slate-500">/ v0.1</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link className="transition hover:text-teal-800" href="/">
                Suara
              </Link>
              <Link
                className="transition hover:text-teal-800"
                href="/audit"
              >
                Audit
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-slate-200/80 px-6 py-5 text-center text-xs text-slate-400">
          Voting Auditability Tool · Eksperimen lokal
        </footer>
      </body>
    </html>
  );
}
