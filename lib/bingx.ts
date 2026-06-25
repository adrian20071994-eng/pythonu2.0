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

export async function getAccountInfo() {
  const timestamp = Date.now();

  const query = `timestamp=${timestamp}`;

  const signature = createSignature(query);

  const url =
    `${BASE_URL}/openApi/swap/v2/user/balance?` +
    `${query}&signature=${signature}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-BX-APIKEY": API_KEY,
    },
    cache: "no-store",
  });

  const data = await response.json();

  return data;
}