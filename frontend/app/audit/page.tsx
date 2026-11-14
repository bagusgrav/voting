"use client";

import { useState } from "react";
import { fetchWithRetry } from "@/utils/api";

type VoteRecord = {
  id: number;
  nullifier: string;
  encrypted_ballot: string;
  signature: string;
};

function isVoteRecord(value: unknown): value is VoteRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "number" &&
    typeof record.nullifier === "string" &&
    typeof record.encrypted_ballot === "string" &&
    typeof record.signature === "string"
  );
}

export default function AuditPage() {
  const [votes, setVotes] = useState<VoteRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchResults() {
    setError(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetchWithRetry(`${apiUrl}/results`);
      if (!response.ok) {
        throw new Error(`Audit gagal dijalankan (HTTP ${response.status}).`);
      }

      const results: unknown = await response.json();
      if (!Array.isArray(results) || !results.every(isVoteRecord)) {
        throw new Error("Format hasil audit dari server tidak valid.");
      }

      setVotes(results);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Tidak dapat mengambil hasil audit.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
          02 / Audit Independen
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Periksa bulletin board
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Ambil catatan suara dari backend dan periksa total serta nullifier
          yang tercatat.
        </p>

        <button
          type="button"
          onClick={fetchResults}
          disabled={isLoading}
          className="mt-8 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "Memproses..." : "Jalankan Audit (Fetch Results)"}
        </button>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </p>
        )}

        {votes !== null && (
          <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <p className="text-sm font-semibold text-orange-600">
                  Hasil terbaru
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {votes.length} suara masuk
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {votes.length === 1 ? "1 catatan" : `${votes.length} catatan`}
              </span>
            </div>

            <div className="px-6 py-5 sm:px-8">
              <h3 className="text-sm font-semibold text-slate-700">Nullifier</h3>
              {votes.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Belum ada suara yang tercatat.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {votes.map((vote) => (
                    <li
                      key={vote.id}
                      className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <code className="break-all rounded-md border border-slate-200/80 bg-slate-50 px-2.5 py-1 font-mono text-sm text-slate-800">
                        {vote.nullifier}
                      </code>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        Catatan #{vote.id}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
