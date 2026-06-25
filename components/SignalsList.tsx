import type { Signal } from "@/lib/parser";
import SignalCard from "./SignalCard";

type SignalsListProps = {
  signals: Signal[];
  loadingSignals: boolean;
  deletingId: string;
  onDelete: (id?: string) => void;
};

export default function SignalsList({
  signals,
  loadingSignals,
  deletingId,
  onDelete,
}: SignalsListProps) {
  return (
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
            <SignalCard
              key={signal.id || signal.raw}
              signal={signal}
              deletingId={deletingId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}