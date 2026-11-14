"use client";

import { useState } from "react";
import { fetchWithRetry } from "@/utils/api";

type Feedback = {
  type: "success" | "warning" | "error";
  message: string;
};

export default function Home() {
  const [candidate, setCandidate] = useState("A");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitVote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetchWithRetry(`${apiUrl}/submit_vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nullifier: `user_${Math.floor(Math.random() * 1_000_000_000)}`,
          encrypted_ballot: candidate,
          signature: "dummy_sig",
        }),
      });

      const result: { error?: string; status?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Suara gagal dikirim.");
      }

      if (result.status === "already_voted") {
        setFeedback({ type: "warning", message: "Anda sudah memilih!" });
        return;
      }

      setFeedback({ type: "success", message: "Suara berhasil dikirim." });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Tidak dapat menghubungi server voting.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14 sm:px-10">
      <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Eksperimen Pemungutan Suara
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Voting Auditability Tool v0.1
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Sistem pemungutan suara eksperimental dengan auditabilitas
            independen berbasis standar ekosistem Thortech.
          </p>
          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Terhubung ke Backend:</span>
              <span className="font-mono font-normal text-emerald-800">{backendUrl}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-md sm:p-9">
          <div className="mb-8">
            <p className="text-sm font-semibold text-orange-600">01 / Surat suara</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Pilih kandidat
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Simulasi ini mengirim satu suara ke bulletin board lokal.
            </p>
          </div>

          <form onSubmit={submitVote}>
            <label
              htmlFor="candidate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Kandidat
            </label>
            <select
              id="candidate"
              value={candidate}
              onChange={(event) => setCandidate(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            >
              <option value="A">Kandidat A</option>
              <option value="B">Kandidat B</option>
              <option value="C">Kandidat C</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading ? "Menghubungkan..." : "Kirim Suara (Submit Vote)"}
            </button>
          </form>

          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : feedback.type === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {feedback.message}
            </p>
          )}

          <p className="mt-6 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400">
            Mode simulasi: tanda tangan dan surat suara bukan data kriptografis
            sungguhan.
          </p>
        </section>
      </div>
    </main>
  );
}
