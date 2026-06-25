import type { Signal } from "@/lib/parser";

type StatsCardsProps = {
  signals: Signal[];
};

export default function StatsCards({ signals }: StatsCardsProps) {
  const safeSignals = signals || [];

  const manualCount = safeSignals.filter(
    (signal) => signal.source === "Manual"
  ).length;

  const telegramCount = safeSignals.filter(
    (signal) => signal.source === "Telegram"
  ).length;

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">Semnale totale</p>
        <p className="mt-2 text-3xl font-bold">{safeSignals.length}</p>
      </div>

      <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">Manuale</p>
        <p className="mt-2 text-3xl font-bold">{manualCount}</p>
      </div>

      <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">Telegram</p>
        <p className="mt-2 text-3xl font-bold">{telegramCount}</p>
      </div>
    </div>
  );
}