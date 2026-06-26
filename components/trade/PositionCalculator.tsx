type Props = {
    riskAmount: number;
    stopDistance: number;
    positionSize: number;
    notionalValue: number;
    requiredMargin: number;
    rewardAmount: number;
    rr: number;
  };
  
  export default function PositionCalculator({
    riskAmount,
    stopDistance,
    positionSize,
    notionalValue,
    requiredMargin,
    rewardAmount,
    rr,
  }: Props) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Simulare poziție</h2>
  
        <div className="mt-5 space-y-3">
          <Result label="Risk Amount" value={`${riskAmount.toFixed(2)} USDT`} />
          <Result label="Stop Distance" value={stopDistance.toFixed(8)} />
          <Result label="Position Size" value={positionSize.toFixed(4)} />
          <Result label="Notional Value" value={`${notionalValue.toFixed(2)} USDT`} />
          <Result label="Required Margin" value={`${requiredMargin.toFixed(2)} USDT`} />
          <Result label="Estimated Reward" value={`${rewardAmount.toFixed(2)} USDT`} />
          <Result label="Risk Reward" value={`1:${rr.toFixed(2)}`} />
        </div>
  
        <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
          Atenție. Ordinul real va fi trimis doar după confirmare explicită.
        </div>
      </div>
    );
  }
  
  function Result({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-slate-950 p-4">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
    );
  }