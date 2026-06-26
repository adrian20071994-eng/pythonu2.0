"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  created_at: string;
  symbol: string;
  side: string;
  position_side: string | null;
  order_type: string | null;
  quantity: number | null;
  executed_qty: number | null;
  avg_price: number | null;
  status: string | null;
  bingx_order_id: string | null;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("Nu pot încărca ordinele din Supabase.");
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Istoric ordine BingX</h1>
            <p className="mt-2 text-slate-400">
              Aici vezi ordinele executate prin API și salvate în Supabase.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadOrders}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
            >
              Reîncarcă
            </button>

            <a
              href="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
            >
              Dashboard
            </a>
          </div>
        </header>

        {errorMessage && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {errorMessage}
          </div>
        )}

        <section className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Ordine totale</p>
            <p className="mt-2 text-3xl font-bold">{orders.length}</p>
          </div>

          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Filled</p>
            <p className="mt-2 text-3xl font-bold">
              {orders.filter((order) => order.status === "FILLED").length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-5">
            <p className="text-slate-400">Market</p>
            <p className="mt-2 text-3xl font-bold">
              {orders.filter((order) => order.order_type === "MARKET").length}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Ordine recente</h2>

          {loading ? (
            <p className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-slate-400">
              Se încarcă ordinele...
            </p>
          ) : orders.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-slate-400">
              Nu există ordine salvate.
            </p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-4">Dată</th>
                    <th className="p-4">Symbol</th>
                    <th className="p-4">Side</th>
                    <th className="p-4">Position</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Executed</th>
                    <th className="p-4">Avg Price</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-800">
                      <td className="p-4 text-slate-400">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold">{order.symbol}</td>
                      <td
                        className={
                          order.side === "BUY"
                            ? "p-4 text-emerald-400"
                            : "p-4 text-red-400"
                        }
                      >
                        {order.side}
                      </td>
                      <td className="p-4">{order.position_side || "-"}</td>
                      <td className="p-4">{order.order_type || "-"}</td>
                      <td className="p-4">{order.quantity || "-"}</td>
                      <td className="p-4">{order.executed_qty || "-"}</td>
                      <td className="p-4">{order.avg_price || "-"}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                          {order.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}