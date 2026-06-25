"use client";

import { useState } from "react";

type Signal = {
  pair: string;
  type: "BUY" | "SELL";
  entry: string;
  tp: string;
  sl: string;
  status: string;
  source: "Manual" | "Telegram";
};

export default function Home() {
  const [signals, setSignals] = useState<Signal[]>([
    {
      pair: "BTC/USDT",
      type: "BUY",
      entry: "64200",
      tp: "65500",
      sl: "63500",
      status: "OPEN",
      source: "Telegram",
    },
  ]);

  const [form, setForm] = useState<Signal>({
    pair: "",
    type: "BUY",
    entry: "",
    tp: "",
    sl: "",
    status: "OPEN",
    source: "Manual",
  });

  function addManualSignal(event: React.FormEvent) {
    event.preventDefault();

    if (!form.pair || !form.entry || !form.tp || !form.sl) {
      alert("Completează toate câmpurile.");
      return;
    }

    setSignals([form, ...signals]);

    setForm({
      pair: "",
      type: "BUY",
      entry: "",
      tp: "",
      sl: "",
      status: "OPEN",
      source: "Manual",
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Signals</h2>

          <nav className="mt-8 space-y-3 text-slate-300">
            <p className="rounded-lg bg-slate-800 px-4 py-3 text-white">Dashboard</p>
            <p className="px-4 py-3">Manual</p>
            <p className="px-4 py-3">Telegram Bot</p>
            <p className="px-4 py-3">Setări</p>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Telegram Signals Dashboard</h1>
              <p className="mt-2 text-slate-400">
                Adaugi semnale manual sau le primești automat din Telegram.
              </p>
            </div>

            <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400">
              Bot pregătit
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
              <p className="mt-2 text-3xl font-bold">
                {signals.filter((signal) => signal.source === "Telegram").length}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <form
              onSubmit={addManualSignal}
              className="rounded-xl bg-slate-900 p-6 xl:col-span-1"
            >
              <h2 className="text-xl font-semibold">Adaugă semnal manual</h2>

              <label className="mt-5 block text-sm text-slate-400">Pereche</label>
              <input
                value={form.pair}
                onChange={(e) => setForm({ ...form, pair: e.target.value })}
                placeholder="BTC/USDT"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
              />

              <label className="mt-4 block text-sm text-slate-400">Tip</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as "BUY" | "SELL" })
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>

              <label className="mt-4 block text-sm text-slate-400">Intrare</label>
              <input
                value={form.entry}
                onChange={(e) => setForm({ ...form, entry: e.target.value })}
                placeholder="64200"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
              />

              <label className="mt-4 block text-sm text-slate-400">Take Profit</label>
              <input
                value={form.tp}
                onChange={(e) => setForm({ ...form, tp: e.target.value })}
                placeholder="65500"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
              />

              <label className="mt-4 block text-sm text-slate-400">Stop Loss</label>
              <input
                value={form.sl}
                onChange={(e) => setForm({ ...form, sl: e.target.value })}
                placeholder="63500"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
              />

              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-emerald-500 p-3 font-semibold text-slate-950"
              >
                Adaugă semnal
              </button>
            </form>

            <div className="rounded-xl bg-slate-900 p-6 xl:col-span-2">
              <h2 className="text-xl font-semibold">Semnale recente</h2>

              <div className="mt-6 overflow-hidden rounded-lg border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="p-4">Sursă</th>
                      <th className="p-4">Pereche</th>
                      <th className="p-4">Tip</th>
                      <th className="p-4">Intrare</th>
                      <th className="p-4">TP</th>
                      <th className="p-4">SL</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {signals.map((signal, index) => (
                      <tr key={index} className="border-t border-slate-800">
                        <td className="p-4 text-slate-300">{signal.source}</td>
                        <td className="p-4 font-medium">{signal.pair}</td>
                        <td
                          className={
                            signal.type === "BUY"
                              ? "p-4 text-emerald-400"
                              : "p-4 text-red-400"
                          }
                        >
                          {signal.type}
                        </td>
                        <td className="p-4">{signal.entry}</td>
                        <td className="p-4">{signal.tp}</td>
                        <td className="p-4">{signal.sl}</td>
                        <td className="p-4">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                            {signal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                Endpoint Telegram viitor:
                <span className="ml-2 text-slate-200">/api/telegram</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}