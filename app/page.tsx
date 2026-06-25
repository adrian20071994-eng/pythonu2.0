"use client";

import { useState } from "react";

type Signal = {
  raw: string;
  pair: string;
  direction: string;
  score: string;
  entry: string;
  sl: string;
  tp1: string;
  tp2: string;
  atr: string;
  atrPercent: string;
  fundingRate: string;
  openInterest: string;
  reasons: string;
  source: "Manual" | "Telegram";
};

function extractValue(text: string, label: string) {
  const regex = new RegExp(`${label}\\s*:\\s*(.+)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function parseSignal(text: string): Signal {
  const pairRaw = extractValue(text, "Pair");
  const pair = pairRaw.replace(":USDT", "");

  return {
    raw: text,
    pair,
    direction: extractValue(text, "Direction"),
    score: extractValue(text, "Score"),
    entry: extractValue(text, "Entry"),
    sl: extractValue(text, "SL"),
    tp1: extractValue(text, "TP1"),
    tp2: extractValue(text, "TP2"),
    atr: extractValue(text, "ATR"),
    atrPercent: extractValue(text, "ATR%"),
    fundingRate: extractValue(text, "Funding Rate"),
    openInterest: extractValue(text, "Open Interest"),
    reasons: extractValue(text, "Reasons"),
    source: "Manual",
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);

  function importSignal() {
    if (!input.trim()) {
      alert("Lipește un semnal înainte să îl imporți.");
      return;
    }

    const signal = parseSignal(input);

    if (!signal.pair || !signal.direction || !signal.entry || !signal.sl) {
      alert("Semnalul nu pare complet. Verifică formatul.");
      return;
    }

    setSignals([signal, ...signals]);
    setInput("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Signals</h2>

          <nav className="mt-8 space-y-3 text-slate-300">
            <p className="rounded-lg bg-slate-800 px-4 py-3 text-white">Dashboard</p>
            <p className="px-4 py-3">Import manual</p>
            <p className="px-4 py-3">Telegram Bot</p>
            <p className="px-4 py-3">BingX API</p>
            <p className="px-4 py-3">Setări</p>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Telegram Signals Dashboard</h1>
              <p className="mt-2 text-slate-400">
                Lipești semnalul din Telegram, iar aplicația îl extrage automat.
              </p>
            </div>

            <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400">
              Parser activ
            </div>
          </header>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-slate-400">Semnale totale</p>
              <p className="mt-2 text-3xl font-bold">{signals.length}</p>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-slate-400">Manuale</p>
              <p className="mt-2 text-3xl font-bold">
                {signals.filter((signal) => signal.source === "Manual").length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-slate-400">Telegram</p>
              <p className="mt-2 text-3xl font-bold">0</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Importă semnal prin Copy/Paste</h2>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Lipește aici semnalul din Telegram...

🚨 SIGNAL A

Ora semnal: 2026-06-25 20:30:37

Pair: SOL/USDT:USDT
Direction: SHORT
Score: 8

Entry: 66.9217
SL: 69.9601
TP1: 65.5945
TP2: 64.2673

ATR: 0.8848
ATR%: 1.32%
Funding Rate: -0.0047%
Open Interest: $0

Reasons: 4H bearish, 1H bearish, 30M bearish`}
              className="mt-5 min-h-72 w-full rounded-xl border border-slate-700 bg-slate-950 p-5 font-mono text-sm text-white outline-none placeholder:text-slate-500"
            />

            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={importSignal}
                className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950"
              >
                Importă semnal
              </button>

              <button
                onClick={() => setInput("")}
                className="rounded-lg border border-slate-700 px-6 py-3 text-slate-300"
              >
                Curăță
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Semnale importate</h2>

            {signals.length === 0 ? (
              <p className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-slate-400">
                Nu ai importat încă niciun semnal.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                {signals.map((signal, index) => (
                  <div key={index} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{signal.source}</p>
                        <h3 className="text-2xl font-bold">{signal.pair}</h3>
                      </div>

                      <span
                        className={
                          signal.direction.toUpperCase() === "LONG"
                            ? "rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400"
                            : "rounded-full bg-red-500/10 px-4 py-2 text-red-400"
                        }
                      >
                        {signal.direction}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">Entry</span>
                        <br />
                        {signal.entry}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">SL</span>
                        <br />
                        {signal.sl}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">TP1</span>
                        <br />
                        {signal.tp1}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">TP2</span>
                        <br />
                        {signal.tp2}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">Score</span>
                        <br />
                        {signal.score || "-"}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">ATR%</span>
                        <br />
                        {signal.atrPercent || "-"}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">Funding</span>
                        <br />
                        {signal.fundingRate || "-"}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">Open Interest</span>
                        <br />
                        {signal.openInterest || "-"}
                      </p>
                    </div>

                    <div className="mt-5 rounded-lg bg-slate-900 p-4 text-sm text-slate-300">
                      <p className="text-slate-400">Reasons</p>
                      <p className="mt-2">{signal.reasons || "-"}</p>
                    </div>

                    <button className="mt-5 w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold">
                      Pregătește execuția pe BingX
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}