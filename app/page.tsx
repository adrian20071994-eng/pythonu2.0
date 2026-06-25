export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold">Telegram Signals Dashboard</h1>

      <section className="mt-8 max-w-4xl rounded-xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Semnale primite</h2>

        <div className="mt-6 rounded-lg bg-slate-800 p-5">
          <p><strong>Pereche:</strong> BTC/USDT</p>
          <p><strong>Tip:</strong> BUY</p>
          <p><strong>Intrare:</strong> 64200</p>
          <p><strong>Take Profit:</strong> 65500</p>
          <p><strong>Stop Loss:</strong> 63500</p>
          <p><strong>Status:</strong> Nou</p>
        </div>
      </section>
    </main>
  );
}