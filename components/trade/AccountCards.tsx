type BalanceData = {
    balance: string;
    equity: string;
    availableMargin: string;
    unrealizedProfit: string;
    usedMargin: string;
  };
  
  type Props = {
    balance: BalanceData | null;
    loading: boolean;
  };
  
  export default function AccountCards({ balance, loading }: Props) {
    return (
      <section className="mt-8 grid grid-cols-4 gap-4">
        <Card label="Balance" value={loading ? "..." : `${balance?.balance || "0"} USDT`} />
        <Card label="Equity" value={loading ? "..." : `${balance?.equity || "0"} USDT`} />
        <Card label="Available Margin" value={loading ? "..." : `${balance?.availableMargin || "0"} USDT`} />
        <Card label="Unrealized PnL" value={loading ? "..." : `${balance?.unrealizedProfit || "0"} USDT`} />
      </section>
    );
  }
  
  function Card({ label, value }: { label: string; value: string }) {
    return (
      <div className="rounded-xl bg-slate-900 p-5">
        <p className="text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </div>
    );
  }