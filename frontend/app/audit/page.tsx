"use client";

import { useState } from "react";

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
      const response = await fetch("http://localhost:3000/results");
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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          02 / Audit independen
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
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
          className="mt-8 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "Mengambil hasil..." : "Jalankan Audit (Fetch Results)"}
        </button>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {error}
          </p>
        )}

        {votes !== null && (
          <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.3)]">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <p className="text-sm font-medium text-teal-700">
                  Hasil terbaru
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  {votes.length} suara masuk
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {votes.length === 1 ? "1 catatan" : `${votes.length} catatan`}
              </p>
            </div>

            <div className="px-6 py-5 sm:px-8">
              <h3 className="text-sm font-medium text-slate-700">Nullifier</h3>
              {votes.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Belum ada suara yang tercatat.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {votes.map((vote) => (
                    <li
                      key={vote.id}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <code className="break-all text-sm text-slate-800">
                        {vote.nullifier}
                      </code>
                      <span className="text-xs text-slate-400">
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
