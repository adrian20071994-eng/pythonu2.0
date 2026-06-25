import crypto from "crypto";

const API_KEY = process.env.BINGX_API_KEY!;
const SECRET_KEY = process.env.BINGX_SECRET_KEY!;
const BASE_URL = "https://open-api.bingx.com";

function createSignature(query: string) {
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(query)
    .digest("hex");
}

async function request(
  endpoint: string,
  params: Record<string, string | number> = {},
  method: "GET" | "POST" = "GET"
) {
  const timestamp = Date.now();

  const query = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
    timestamp: String(timestamp),
  }).toString();

  const signature = createSignature(query);

  const url = `${BASE_URL}${endpoint}?${query}&signature=${signature}`;

  const response = await fetch(url, {
    method,
    headers: {
      "X-BX-APIKEY": API_KEY,
    },
    cache: "no-store",
  });

  return response.json();
}

export async function getAccountInfo() {
  return request("/openApi/swap/v2/user/balance");
}

export async function getTicker(symbol: string) {
  return request("/openApi/swap/v2/quote/price", {
    symbol,
  });
}

export async function getPositions() {
  return request("/openApi/swap/v2/user/positions");
}

export async function createMarketOrder(
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number
) {
  return request(
    "/openApi/swap/v2/trade/order",
    {
      symbol,
      side,
      type: "MARKET",
      quantity,
    },
    "POST"
  );
}