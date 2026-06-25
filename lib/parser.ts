export type Signal = {
    id?: string;
    raw: string;
    pair: string;
    direction: string;
    score: string;
    entry: string;
    sl: string;
    tp1: string;
    tp2: string;
    atr: string;
    atrPercent: string;
    fundingRate: string;
    openInterest: string;
    reasons: string;
    source: "Manual" | "Telegram";
    createdAt?: string;
  };
  
  export function extractValue(text: string, label: string) {
    const regex = new RegExp(`${label}\\s*:\\s*(.+)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  }
  
  export function parseSignal(text: string): Signal {
    const pairRaw = extractValue(text, "Pair");
    const pair = pairRaw.replace(":USDT", "");
  
    return {
      raw: text,
      pair,
      direction: extractValue(text, "Direction"),
      score: extractValue(text, "Score"),
      entry: extractValue(text, "Entry"),
      sl: extractValue(text, "SL"),
      tp1: extractValue(text, "TP1"),
      tp2: extractValue(text, "TP2"),
      atr: extractValue(text, "ATR"),
      atrPercent: extractValue(text, "ATR%"),
      fundingRate: extractValue(text, "Funding Rate"),
      openInterest: extractValue(text, "Open Interest"),
      reasons: extractValue(text, "Reasons"),
      source: "Manual",
    };
  }
  
  export function cleanNumber(value: string) {
    if (!value) return null;
  
    const cleaned = value
      .replace("$", "")
      .replace("%", "")
      .replaceAll(",", "")
      .trim();
  
    const number = Number(cleaned);
    return Number.isNaN(number) ? null : number;
  }
  
  export function mapDatabaseSignal(item: any): Signal {
    return {
      id: item.id,
      raw: item.raw_text || "",
      pair: item.pair || "",
      direction: item.direction || "",
      score: item.score !== null && item.score !== undefined ? String(item.score) : "",
      entry: item.entry !== null && item.entry !== undefined ? String(item.entry) : "",
      sl: item.sl !== null && item.sl !== undefined ? String(item.sl) : "",
      tp1: item.tp1 !== null && item.tp1 !== undefined ? String(item.tp1) : "",
      tp2: item.tp2 !== null && item.tp2 !== undefined ? String(item.tp2) : "",
      atr: item.atr !== null && item.atr !== undefined ? String(item.atr) : "",
      atrPercent:
        item.atr_percent !== null && item.atr_percent !== undefined
          ? String(item.atr_percent)
          : "",
      fundingRate:
        item.funding_rate !== null && item.funding_rate !== undefined
          ? String(item.funding_rate)
          : "",
      openInterest:
        item.open_interest !== null && item.open_interest !== undefined
          ? String(item.open_interest)
          : "",
      reasons: item.reasons || "",
      source: item.source === "telegram" ? "Telegram" : "Manual",
      createdAt: item.created_at,
    };
  }