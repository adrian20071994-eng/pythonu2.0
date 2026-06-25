import { NextResponse } from "next/server";
import { getAccountInfo } from "@/lib/bingx";

export async function GET() {
  try {
    const accountInfo = await getAccountInfo();

    return NextResponse.json({
      success: true,
      message: "BingX connection test completed.",
      apiKeyConfigured: !!process.env.BINGX_API_KEY,
      secretConfigured: !!process.env.BINGX_SECRET_KEY,
      data: accountInfo,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "BingX connection test failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}