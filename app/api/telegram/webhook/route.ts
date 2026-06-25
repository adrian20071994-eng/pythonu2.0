import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cleanNumber, parseSignal } from "@/lib/parser";

export async function POST(request: Request) {
  try {
    const update = await request.json();

    const text =
      update?.message?.text ||
      update?.channel_post?.text ||
      update?.edited_message?.text ||
      "";

    if (!text) {
      return NextResponse.json({
        success: true,
        message: "No text found in Telegram update.",
      });
    }

    const signal = parseSignal(text);

    if (!signal.pair || !signal.direction || !signal.entry || !signal.sl) {
      return NextResponse.json({
        success: false,
        message: "Telegram message is not a valid signal.",
        raw_text: text,
      });
    }

    const { error } = await supabase.from("signals").insert({
      source: "telegram",
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
      raw_text: text,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not save Telegram signal.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Telegram signal saved.",
      pair: signal.pair,
      direction: signal.direction,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Telegram webhook endpoint is working.",
  });
}