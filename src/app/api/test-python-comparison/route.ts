/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Create: api/test-python-comparison/route.ts
// This should replicate your successful Python test in Next.js

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  try {
    console.log("=== REPLICATING SUCCESSFUL PYTHON TEST IN NEXT.JS ===");

    // Check environment
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "No API key found",
        debug: "Environment variable OPENAI_API_KEY not set",
      });
    }

    console.log(
      "API Key found:",
      process.env.OPENAI_API_KEY.substring(0, 15) + "..."
    );

    // Initialize OpenAI exactly like your working Python script
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("OpenAI client initialized");

    // EXACT same request structure as your working Python
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career advisor. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content:
            "Analyze this profile: Experience: Fresher, Role: UI Designer, Target: UX Designer",
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" },
    };

    console.log(
      "Making request with payload:",
      JSON.stringify(payload, null, 2)
    );

    // Make the request
    const completion = await openai.chat.completions.create({
      ...payload,
      messages: payload.messages as OpenAI.ChatCompletionMessageParam[],
      response_format: { type: "json_object" as const },
    });

    console.log("✅ SUCCESS! Next.js request worked!");
    console.log(
      "Response received:",
      completion.choices[0]?.message?.content?.substring(0, 100) + "..."
    );
    console.log("Tokens used:", completion.usage?.total_tokens);

    return NextResponse.json({
      success: true,
      message: "Next.js OpenAI request successful!",
      response: completion.choices[0]?.message?.content,
      usage: completion.usage,
      model: completion.model,
      debug: {
        keyPrefix: process.env.OPENAI_API_KEY.substring(0, 15),
        requestModel: payload.model,
        responseModel: completion.model,
      },
    });
  } catch (error: any) {
    console.error("❌ Next.js request failed:");
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Type:", error.type);
    console.error("Message:", error.message);
    console.error("Full error:", error);

    return NextResponse.json({
      success: false,
      error: {
        status: error.status,
        code: error.code,
        type: error.type,
        message: error.message,
      },
      debug: {
        keyExists: !!process.env.OPENAI_API_KEY,
        keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 15) || "none",
        errorName: error.constructor.name,
      },
    });
  }
}

// Also test POST method
export async function POST(request: NextRequest) {
  return GET(request);
}
