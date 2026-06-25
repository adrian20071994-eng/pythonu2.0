import { NextResponse } from "next/server";
import { createMarketOrder } from "@/lib/bingx";

export async function POST(request: Request) {
  try {
    const { symbol, side, quantity, confirm, mode } = await request.json();

    if (mode !== "LIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Order blocked. mode must be LIVE.",
        },
        { status: 400 }
      );
    }

    if (confirm !== true) {
      return NextResponse.json(
        {
          success: false,
          message: "Order blocked. confirm must be true.",
        },
        { status: 400 }
      );
    }

    if (!symbol || typeof symbol !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid symbol.",
        },
        { status: 400 }
      );
    }

    if (side !== "BUY" && side !== "SELL") {
      return NextResponse.json(
        {
          success: false,
          message: "side must be BUY or SELL.",
        },
        { status: 400 }
      );
    }

    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quantity.",
        },
        { status: 400 }
      );
    }

    if (numericQuantity > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Order blocked. Max test quantity is 100.",
        },
        { status: 400 }
      );
    }

    const result = await createMarketOrder(symbol, side, numericQuantity);

    return NextResponse.json({
      success: true,
      message: "Live order sent to BingX.",
      result,
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