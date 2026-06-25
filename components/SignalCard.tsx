import type { Signal } from "@/lib/parser";

type SignalCardProps = {
  signal: Signal;
  deletingId: string;
  onDelete: (id?: string) => void;
};

export default function SignalCard({
  signal,
  deletingId,
  onDelete,
}: SignalCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{signal.source}</p>
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
            onClick={() => onDelete(signal.id)}
            disabled={deletingId === signal.id}
            className="rounded-full border border-red-500/30 px-3 py-2 text-sm text-red-300 disabled:opacity-50"
          >
            {deletingId === signal.id ? "..." : "Șterge"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Field label="Entry" value={signal.entry} />
        <Field label="SL" value={signal.sl} />
        <Field label="TP1" value={signal.tp1} />
        <Field label="TP2" value={signal.tp2} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Field label="Score" value={signal.score} />
        <Field label="ATR%" value={signal.atrPercent} />
        <Field label="Funding" value={signal.fundingRate} />
        <Field label="Open Interest" value={signal.openInterest} />
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
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="rounded-lg bg-slate-900 p-3">
      <span className="text-slate-400">{label}</span>
      <br />
      {value || "-"}
    </p>
  );
}