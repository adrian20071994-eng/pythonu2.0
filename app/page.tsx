const signals = [
  { pair: "BTC/USDT", type: "BUY", entry: "64200", tp: "65500", sl: "63500", status: "OPEN" },
  { pair: "ETH/USDT", type: "SELL", entry: "3450", tp: "3320", sl: "3520", status: "TP1" },
  { pair: "SOL/USDT", type: "BUY", entry: "145", tp: "153", sl: "139", status: "OPEN" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Signals</h2>

          <nav className="mt-8 space-y-3 text-slate-300">
            <p className="rounded-lg bg-slate-800 px-4 py-3 text-white">Dashboard</p>
            <p className="px-4 py-3">Semnale</p>
            <p className="px-4 py-3">Statistici</p>
            <p className="px-4 py-3">Setări</p>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Telegram Signals Dashboard</h1>
              <p className="mt-2 text-slate-400">Monitorizare semnale crypto din Telegram.</p>
            </div>

            <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400">
              Bot conectat
            </div>
          </header>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-slate-400">Semnale totale</p>
              <p className="mt-2 text-3xl font-bold">3</p>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-slate-400">Semnale active</p>
              <p className="mt-2 text-3xl font-bold">2</p>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <p className="text-slate-400">Rată TP</p>
              <p className="mt-2 text-3xl font-bold">66%</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Semnale recente</h2>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-4">Pereche</th>
                    <th className="p-4">Tip</th>
                    <th className="p-4">Intrare</th>
                    <th className="p-4">Take Profit</th>
                    <th className="p-4">Stop Loss</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {signals.map((signal) => (
                    <tr key={signal.pair} className="border-t border-slate-800">
                      <td className="p-4 font-medium">{signal.pair}</td>
                      <td className={signal.type === "BUY" ? "p-4 text-emerald-400" : "p-4 text-red-400"}>
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
          </div>
        </section>
      </div>
    </main>
  );
}