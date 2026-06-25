"use client";

import { useEffect, useState } from "react";

import Header from "@/components/Header";
import ImportBox from "@/components/ImportBox";
import Sidebar from "@/components/Sidebar";
import SignalsList from "@/components/SignalsList";
import StatsCards from "@/components/StatsCards";

import { supabase } from "@/lib/supabase";
import {
  Signal,
  cleanNumber,
  mapDatabaseSignal,
  parseSignal,
} from "@/lib/parser";

export default function Home() {
  const [input, setInput] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [savingSignal, setSavingSignal] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSignals();
  }, []);

  async function loadSignals() {
    setLoadingSignals(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("Nu pot încărca semnalele din Supabase.");
      setLoadingSignals(false);
      return;
    }

    setSignals((data || []).map(mapDatabaseSignal));
    setLoadingSignals(false);
  }

  async function importSignal() {
    if (!input.trim()) {
      alert("Lipește un semnal înainte să îl imporți.");
      return;
    }

    const signal = parseSignal(input);

    if (!signal.pair || !signal.direction || !signal.entry || !signal.sl) {
      alert("Semnalul nu pare complet. Verifică formatul.");
      return;
    }

    setSavingSignal(true);
    setErrorMessage("");

    const { error } = await supabase.from("signals").insert({
      source: "manual",
      pair: signal.pair,
      direction: signal.direction,
      score: cleanNumber(signal.score),
      entry: cleanNumber(signal.entry),
      sl: cleanNumber(signal.sl),
      tp1: cleanNumber(signal.tp1),
      tp2: cleanNumber(signal.tp2),
      atr: cleanNumber(signal.atr),
      atr_percent: cleanNumber(signal.atrPercent),
      funding_rate: cleanNumber(signal.fundingRate),
      open_interest: cleanNumber(signal.openInterest),
      reasons: signal.reasons,
      raw_text: input,
    });

    setSavingSignal(false);

    if (error) {
      console.error(error);
      setErrorMessage("Nu am putut salva semnalul în Supabase.");
      return;
    }

    setInput("");
    await loadSignals();
  }

  async function deleteSignal(id?: string) {
    if (!id) return;

    const confirmed = window.confirm("Ștergi acest semnal?");
    if (!confirmed) return;

    setDeletingId(id);
    setErrorMessage("");

    const { error } = await supabase.from("signals").delete().eq("id", id);

    setDeletingId("");

    if (error) {
      console.error(error);
      setErrorMessage("Nu am putut șterge semnalul din Supabase.");
      return;
    }

    setSignals((currentSignals) =>
      currentSignals.filter((signal) => signal.id !== id)
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-8">
          <Header onReload={loadSignals} />

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {errorMessage}
            </div>
          )}

          <StatsCards signals={signals} />

          <ImportBox
            input={input}
            savingSignal={savingSignal}
            onInputChange={setInput}
            onImport={importSignal}
            onClear={() => setInput("")}
          />

          <SignalsList
            signals={signals}
            loadingSignals={loadingSignals}
            deletingId={deletingId}
            onDelete={deleteSignal}
          />
        </section>
      </div>
    </main>
  );
}