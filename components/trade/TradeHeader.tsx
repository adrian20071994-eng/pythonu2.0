export default function TradeHeader() {
    return (
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BingX Trade Simulator</h1>
          <p className="mt-2 text-slate-400">
            Calculează poziția și execută ordine controlate către BingX.
          </p>
        </div>
  
        <div className="flex gap-3">
          <a
            href="/orders"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
          >
            Istoric ordine
          </a>
  
          <a
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
          >
            Dashboard
          </a>
        </div>
      </header>
    );
  }