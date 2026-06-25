type ImportBoxProps = {
    input: string;
    savingSignal: boolean;
    onInputChange: (value: string) => void;
    onImport: () => void;
    onClear: () => void;
  };
  
  export default function ImportBox({
    input,
    savingSignal,
    onInputChange,
    onImport,
    onClear,
  }: ImportBoxProps) {
    return (
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Importă semnal prin Copy/Paste</h2>
  
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder=""
          className="mt-5 min-h-72 w-full rounded-xl border border-slate-700 bg-slate-950 p-5 font-mono text-sm text-white outline-none"
        />
  
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={onImport}
            disabled={savingSignal}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {savingSignal ? "Se salvează..." : "Importă semnal"}
          </button>
  
          <button
            onClick={onClear}
            className="rounded-lg border border-slate-700 px-6 py-3 text-slate-300"
          >
            Curăță
          </button>
        </div>
      </div>
    );
  }