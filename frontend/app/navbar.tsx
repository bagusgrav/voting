"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Suara" },
    { href: "/audit", label: "Audit" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-orange-600 transition hover:text-orange-700"
        >
          <Logo className="shadow-sm rounded-lg" />
          <span className="font-bold text-orange-600">Thortech Voting</span>
        </Link>
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-50 font-semibold text-orange-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
