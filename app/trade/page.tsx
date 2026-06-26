"use client";

import { useEffect, useState } from "react";
import AccountCards from "@/components/trade/AccountCards";
import ExecuteButton from "@/components/trade/ExecuteButton";
import OrderForm from "@/components/trade/OrderForm";
import PositionCalculator from "@/components/trade/PositionCalculator";
import TradeHeader from "@/components/trade/TradeHeader";

type BalanceData = {
  balance: string;
  equity: string;
  availableMargin: string;
  unrealizedProfit: string;
  usedMargin: string;
};

export default function TradePage() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  const [pair, setPair] = useState("DOGE/USDT");
  const [direction, setDirection] = useState("SHORT");
  const [entry, setEntry] = useState("0.0748");
  const [sl, setSl] = useState("0.0792");
  const [tp, setTp] = useState("0.0734");
  const [riskPercent, setRiskPercent] = useState("1");
  const [leverage, setLeverage] = useState("5");

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    setLoading(true);

    const response = await fetch("/api/bingx");
    const result = await response.json();

    if (result.success && result.data?.data?.balance) {
      setBalance(result.data.data.balance);
    }

    setLoading(false);
  }

  const entryNumber = Number(entry);
  const slNumber = Number(sl);
  const tpNumber = Number(tp);
  const riskNumber = Number(riskPercent);
  const leverageNumber = Number(leverage || 1);
  const equityNumber = Number(balance?.equity || 0);

  const riskAmount = equityNumber * (riskNumber / 100);
  const stopDistance = Math.abs(entryNumber - slNumber);
  const positionSize = stopDistance > 0 ? riskAmount / stopDistance : 0;
  const notionalValue = positionSize * entryNumber;
  const requiredMargin = leverageNumber > 0 ? notionalValue / leverageNumber : 0;

  const rewardDistance = Math.abs(entryNumber - tpNumber);
  const rewardAmount = positionSize * rewardDistance;
  const rr = riskAmount > 0 ? rewardAmount / riskAmount : 0;

  async function afterExecuted() {
    setExecuting(true);
    await loadBalance();
    setExecuting(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <TradeHeader />

        <AccountCards balance={balance} loading={loading} />

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OrderForm
            pair={pair}
            direction={direction}
            entry={entry}
            sl={sl}
            tp={tp}
            riskPercent={riskPercent}
            leverage={leverage}
            onPairChange={setPair}
            onDirectionChange={setDirection}
            onEntryChange={setEntry}
            onSlChange={setSl}
            onTpChange={setTp}
            onRiskPercentChange={setRiskPercent}
            onLeverageChange={setLeverage}
          />

          <div>
            <PositionCalculator
              riskAmount={riskAmount}
              stopDistance={stopDistance}
              positionSize={positionSize}
              notionalValue={notionalValue}
              requiredMargin={requiredMargin}
              rewardAmount={rewardAmount}
              rr={rr}
            />

            <ExecuteButton
              pair={pair}
              direction={direction}
              quantity={positionSize}
              executing={executing}
              onExecuted={afterExecuted}
            />
          </div>
        </section>
      </div>
    </main>
  );
}