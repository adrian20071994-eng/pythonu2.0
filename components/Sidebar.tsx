export default function Sidebar() {
    return (
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
    );
  }