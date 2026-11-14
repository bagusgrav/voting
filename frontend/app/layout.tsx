import type { Metadata } from "next";
import Navbar from "./navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thortech Voting - Auditability Tool",
  description:
    "Sistem pemungutan suara eksperimental dengan auditabilitas independen dalam ekosistem Thortech.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Navbar />
        {children}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-5 text-center text-xs text-slate-500">
          Thortech Voting · Sistem Pemungutan Suara &amp; Audit Independen
        </footer>
      </body>
    </html>
  );
}
