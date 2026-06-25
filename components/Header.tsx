type HeaderProps = {
    onReload: () => void;
  };
  
  export default function Header({ onReload }: HeaderProps) {
    return (
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Telegram Signals Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Lipești semnalul din Telegram, iar aplicația îl salvează în Supabase.
          </p>
        </div>
  
        <button
          onClick={onReload}
          className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
        >
          Reîncarcă
        </button>
      </header>
    );
  }