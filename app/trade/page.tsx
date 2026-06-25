"use client";

import { useEffect, useState } from "react";

type BalanceData = {
  balance: string;
  equity: string;
  availableMargin: string;
  unrealizedProfit: string;
  usedMargin: string;
};

export default function TradePage() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

  const [pair, setPair] = useState("DOGE/USDT");
  const [direction, setDirection] = useState("SHORT");
  const [entry, setEntry] = useState("0.0748");
  const [sl, setSl] = useState("0.0792");
  const [tp, setTp] = useState("0.0734");
  const [riskPercent, setRiskPercent] = useState("1");
  const [leverage, setLeverage] = useState("5");

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    setLoading(true);

    const response = await fetch("/api/bingx");
    const result = await response.json();

    if (result.success && result.data?.data?.balance) {
      setBalance(result.data.data.balance);
    }

    setLoading(false);
  }

  const entryNumber = Number(entry);
  const slNumber = Number(sl);
  const tpNumber = Number(tp);
  const riskNumber = Number(riskPercent);
  const equityNumber = Number(balance?.equity || 0);

  const riskAmount = equityNumber * (riskNumber / 100);
  const stopDistance = Math.abs(entryNumber - slNumber);
  const positionSize = stopDistance > 0 ? riskAmount / stopDistance : 0;
  const notionalValue = positionSize * entryNumber;
  const requiredMargin = notionalValue / Number(leverage || 1);

  const rewardDistance = Math.abs(entryNumber - tpNumber);
  const rewardAmount = positionSize * rewardDistance;
  const rr = riskAmount > 0 ? rewardAmount / riskAmount : 0;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">BingX Trade Simulator</h1>
            <p className="mt-2 text-slate-400">
              Calculează poziția înainte să trimitem ordine reale către BingX.
            </p>
          </div>

          <a
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
          >
            Înapoi la dashboard
          </a>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Balance</p>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : `${balance?.balance || "0"} USDT`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Equity</p>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : `${balance?.equity || "0"} USDT`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Available Margin</p>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : `${balance?.availableMargin || "0"} USDT`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Unrealized PnL</p>
            <p className="mt-2 text-2xl font-bold">
              {loading ? "..." : `${balance?.unrealizedProfit || "0"} USDT`}
            </p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Date ordin</h2>

            <div className="mt-5 space-y-4">
              <Input label="Pair" value={pair} onChange={setPair} />

              <div>
                <label className="text-sm text-slate-400">Direction</label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none"
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>

              <Input label="Entry" value={entry} onChange={setEntry} />
              <Input label="Stop Loss" value={sl} onChange={setSl} />
              <Input label="Take Profit" value={tp} onChange={setTp} />
              <Input label="Risk %" value={riskPercent} onChange={setRiskPercent} />
              <Input label="Leverage" value={leverage} onChange={setLeverage} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Simulare poziție</h2>

            <div className="mt-5 space-y-3">
              <Result label="Risk Amount" value={`${riskAmount.toFixed(2)} USDT`} />
              <Result label="Stop Distance" value={stopDistance.toFixed(8)} />
              <Result label="Position Size" value={positionSize.toFixed(4)} />
              <Result label="Notional Value" value={`${notionalValue.toFixed(2)} USDT`} />
              <Result label="Required Margin" value={`${requiredMargin.toFixed(2)} USDT`} />
              <Result label="Estimated Reward" value={`${rewardAmount.toFixed(2)} USDT`} />
              <Result label="Risk Reward" value={`1:${rr.toFixed(2)}`} />
            </div>

            <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
              Acesta este doar un simulator. Nu trimite ordine reale către BingX.
            </div>

            <button className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold">
              Simulează ordinul
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none"
      />
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-950 p-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}