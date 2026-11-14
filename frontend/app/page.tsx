"use client";

import { useState } from "react";

type Feedback = {
  type: "success" | "error";
  message: string;
};

export default function Home() {
  const [candidate, setCandidate] = useState("A");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitVote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/submit_vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nullifier: `user_${Math.floor(Math.random() * 1_000_000_000)}`,
          encrypted_ballot: candidate,
          signature: "dummy_sig",
        }),
      });

      const result: { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Suara gagal dikirim.");
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
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14 sm:px-10">
      <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Eksperimen pemungutan suara
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
            Voting Auditability Tool v0.1
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Sistem pemungutan suara eksperimental dengan auditabilitas
            independen.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
            <span className="size-2 rounded-full bg-teal-500" />
            <span>Backend lokal · localhost:3000</span>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.3)] sm:p-9">
          <div className="mb-8">
            <p className="text-sm font-medium text-teal-700">01 / Surat suara</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            >
              <option value="A">Kandidat A</option>
              <option value="B">Kandidat B</option>
              <option value="C">Kandidat C</option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Suara (Submit Vote)"}
            </button>
          </form>

          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-rose-50 text-rose-800"
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
