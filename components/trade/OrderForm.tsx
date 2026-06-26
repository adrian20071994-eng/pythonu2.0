type Props = {
    pair: string;
    direction: string;
    entry: string;
    sl: string;
    tp: string;
    riskPercent: string;
    leverage: string;
    onPairChange: (value: string) => void;
    onDirectionChange: (value: string) => void;
    onEntryChange: (value: string) => void;
    onSlChange: (value: string) => void;
    onTpChange: (value: string) => void;
    onRiskPercentChange: (value: string) => void;
    onLeverageChange: (value: string) => void;
  };
  
  export default function OrderForm({
    pair,
    direction,
    entry,
    sl,
    tp,
    riskPercent,
    leverage,
    onPairChange,
    onDirectionChange,
    onEntryChange,
    onSlChange,
    onTpChange,
    onRiskPercentChange,
    onLeverageChange,
  }: Props) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Date ordin</h2>
  
        <div className="mt-5 space-y-4">
          <Input label="Pair" value={pair} onChange={onPairChange} />
  
          <div>
            <label className="text-sm text-slate-400">Direction</label>
            <select
              value={direction}
              onChange={(e) => onDirectionChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none"
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>
  
          <Input label="Entry" value={entry} onChange={onEntryChange} />
          <Input label="Stop Loss" value={sl} onChange={onSlChange} />
          <Input label="Take Profit" value={tp} onChange={onTpChange} />
          <Input label="Risk %" value={riskPercent} onChange={onRiskPercentChange} />
          <Input label="Leverage" value={leverage} onChange={onLeverageChange} />
        </div>
      </div>
    );
  }
  
  function Input({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <div>
        <label className="text-sm text-slate-400">{label}</label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none"
        />
      </div>
    );
  }