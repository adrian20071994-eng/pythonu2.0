"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Signal = {
  id?: string;
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
  createdAt?: string;
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

function cleanNumber(value: string) {
  if (!value) return null;

  const cleaned = value
    .replace("$", "")
    .replace("%", "")
    .replaceAll(",", "")
    .trim();

  const number = Number(cleaned);
  return Number.isNaN(number) ? null : number;
}

function mapDatabaseSignal(item: any): Signal {
  return {
    id: item.id,
    raw: item.raw_text || "",
    pair: item.pair || "",
    direction: item.direction || "",
    score: item.score !== null && item.score !== undefined ? String(item.score) : "",
    entry: item.entry !== null && item.entry !== undefined ? String(item.entry) : "",
    sl: item.sl !== null && item.sl !== undefined ? String(item.sl) : "",
    tp1: item.tp1 !== null && item.tp1 !== undefined ? String(item.tp1) : "",
    tp2: item.tp2 !== null && item.tp2 !== undefined ? String(item.tp2) : "",
    atr: item.atr !== null && item.atr !== undefined ? String(item.atr) : "",
    atrPercent:
      item.atr_percent !== null && item.atr_percent !== undefined
        ? String(item.atr_percent)
        : "",
    fundingRate:
      item.funding_rate !== null && item.funding_rate !== undefined
        ? String(item.funding_rate)
        : "",
    openInterest:
      item.open_interest !== null && item.open_interest !== undefined
        ? String(item.open_interest)
        : "",
    reasons: item.reasons || "",
    source: item.source === "telegram" ? "Telegram" : "Manual",
    createdAt: item.created_at,
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [savingSignal, setSavingSignal] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSignals();
  }, []);

  async function loadSignals() {
    setLoadingSignals(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("Nu pot încărca semnalele din Supabase.");
      setLoadingSignals(false);
      return;
    }

    setSignals((data || []).map(mapDatabaseSignal));
    setLoadingSignals(false);
  }

  async function importSignal() {
    if (!input.trim()) {
      alert("Lipește un semnal înainte să îl imporți.");
      return;
    }

    const signal = parseSignal(input);

    if (!signal.pair || !signal.direction || !signal.entry || !signal.sl) {
      alert("Semnalul nu pare complet. Verifică formatul.");
      return;
    }

    setSavingSignal(true);
    setErrorMessage("");

    const { error } = await supabase.from("signals").insert({
      source: "manual",
      pair: signal.pair,
      direction: signal.direction,
      score: cleanNumber(signal.score),
      entry: cleanNumber(signal.entry),
      sl: cleanNumber(signal.sl),
      tp1: cleanNumber(signal.tp1),
      tp2: cleanNumber(signal.tp2),
      atr: cleanNumber(signal.atr),
      atr_percent: cleanNumber(signal.atrPercent),
      funding_rate: cleanNumber(signal.fundingRate),
      open_interest: cleanNumber(signal.openInterest),
      reasons: signal.reasons,
      raw_text: input,
    });

    setSavingSignal(false);

    if (error) {
      console.error(error);
      setErrorMessage("Nu am putut salva semnalul în Supabase.");
      return;
    }

    setInput("");
    await loadSignals();
  }

  async function deleteSignal(id?: string) {
    if (!id) return;

    const confirmed = window.confirm("Ștergi acest semnal?");
    if (!confirmed) return;

    setDeletingId(id);
    setErrorMessage("");

    const { error } = await supabase.from("signals").delete().eq("id", id);

    setDeletingId("");

    if (error) {
      console.error(error);
      setErrorMessage("Nu am putut șterge semnalul din Supabase.");
      return;
    }

    setSignals((currentSignals) =>
      currentSignals.filter((signal) => signal.id !== id)
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Signals</h2>

          <nav className="mt-8 space-y-3 text-slate-300">
            <p className="rounded-lg bg-slate-800 px-4 py-3 text-white">
              Dashboard
            </p>
            <p className="px-4 py-3">Import manual</p>
            <p className="px-4 py-3">Telegram Bot</p>
            <p className="px-4 py-3">BingX API</p>
            <p className="px-4 py-3">Setări</p>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Telegram Signals Dashboard
              </h1>
              <p className="mt-2 text-slate-400">
                Lipești semnalul din Telegram, iar aplicația îl salvează în Supabase.
              </p>
            </div>

            <button
              onClick={loadSignals}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
            >
              Reîncarcă
            </button>
          </header>

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {errorMessage}
            </div>
          )}

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
              <p className="mt-2 text-3xl font-bold">
                {signals.filter((signal) => signal.source === "Telegram").length}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Importă semnal prin Copy/Paste
            </h2>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder=""
              className="mt-5 min-h-72 w-full rounded-xl border border-slate-700 bg-slate-950 p-5 font-mono text-sm text-white outline-none"
            />

            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={importSignal}
                disabled={savingSignal}
                className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50"
              >
                {savingSignal ? "Se salvează..." : "Importă semnal"}
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

            {loadingSignals ? (
              <p className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-slate-400">
                Se încarcă semnalele...
              </p>
            ) : signals.length === 0 ? (
              <p className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-slate-400">
                Nu ai importat încă niciun semnal.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                {signals.map((signal) => (
                  <div
                    key={signal.id || signal.raw}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">
                          {signal.source}
                        </p>
                        <h3 className="text-2xl font-bold">{signal.pair}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={
                            signal.direction.toUpperCase() === "LONG"
                              ? "rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400"
                              : "rounded-full bg-red-500/10 px-4 py-2 text-red-400"
                          }
                        >
                          {signal.direction}
                        </span>

                        <button
                          onClick={() => deleteSignal(signal.id)}
                          disabled={deletingId === signal.id}
                          className="rounded-full border border-red-500/30 px-3 py-2 text-sm text-red-300 disabled:opacity-50"
                        >
                          {deletingId === signal.id ? "..." : "Șterge"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">Entry</span>
                        <br />
                        {signal.entry || "-"}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">SL</span>
                        <br />
                        {signal.sl || "-"}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">TP1</span>
                        <br />
                        {signal.tp1 || "-"}
                      </p>

                      <p className="rounded-lg bg-slate-900 p-3">
                        <span className="text-slate-400">TP2</span>
                        <br />
                        {signal.tp2 || "-"}
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

                    {signal.createdAt && (
                      <p className="mt-4 text-xs text-slate-500">
                        Salvat: {new Date(signal.createdAt).toLocaleString()}
                      </p>
                    )}

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