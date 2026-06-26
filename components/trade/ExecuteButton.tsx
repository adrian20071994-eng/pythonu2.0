type Props = {
    pair: string;
    direction: string;
    quantity: number;
    executing: boolean;
    onExecuted: () => void;
  };
  
  function formatSymbol(pair: string) {
    return pair.replace("/", "-").replace(":USDT", "");
  }
  
  export default function ExecuteButton({
    pair,
    direction,
    quantity,
    executing,
    onExecuted,
  }: Props) {
    async function executeOrder() {
      const confirmed = window.confirm(
        `Trimiți ordin REAL pe BingX?\n\nPair: ${pair}\nDirection: ${direction}\nQuantity: ${quantity.toFixed(4)}`
      );
  
      if (!confirmed) return;
  
      const side = direction === "LONG" ? "BUY" : "SELL";
  
      const response = await fetch("/api/bingx/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: formatSymbol(pair),
          side,
          quantity: Number(quantity.toFixed(4)),
          mode: "LIVE",
          confirm: true,
        }),
      });
  
      const result = await response.json();
  
      if (!result.success) {
        alert(result.message || "Ordin respins.");
        return;
      }
  
      alert("Ordin trimis către BingX.");
      onExecuted();
    }
  
    return (
      <button
        onClick={executeOrder}
        disabled={executing || quantity <= 0}
        className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold disabled:opacity-50"
      >
        {executing ? "Se execută..." : "Trimite ordin REAL pe BingX"}
      </button>
    );
  }