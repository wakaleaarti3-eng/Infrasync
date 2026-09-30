// app/api/copilot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Primary model, plus a lighter fallback to try once if the primary keeps
// returning 503 (overloaded). Swap either string for whatever you're
// actually pinned to.
const MODEL = "gemini-3.8-flash";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

const SYSTEM_INSTRUCTION = `You are the InfraSync AI Copilot, helping a municipal
ops team triage citizen infrastructure requests. Be concise and concrete.`;

function isOverloaded(err: any): boolean {
  const status = err?.status ?? err?.error?.code ?? err?.cause?.status;
  return status === 503;
}

async function callGemini(message: string, model: string) {
  return ai.models.generateContent({
    model,
    contents: message,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
}

/**
 * Retries only on 503 (transient overload) with exponential backoff.
 * Any other error (bad key, bad request, quota, etc.) fails immediately —
 * retrying those just wastes time and hides the real problem.
 */
async function generateWithRetry(message: string, maxAttempts = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await callGemini(message, MODEL);
    } catch (err) {
      lastError = err;
      if (!isOverloaded(err)) throw err;

      const delayMs = 500 * 2 ** attempt; // 500ms, 1s, 2s
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Primary model exhausted its retries — try the fallback once before
  // giving up entirely.
  try {
    return await callGemini(message, FALLBACK_MODEL);
  } catch {
    throw lastError;
  }
}

export async function POST(req: NextRequest) {
  let message: string | undefined;

  try {
    const body = await req.json();
    message = body?.message;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing 'message'." }, { status: 400 });
  }

  try {
    const response = await generateWithRetry(message);
    const reply = response.text ?? "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error:", err);

    if (isOverloaded(err)) {
      return NextResponse.json(
        { error: "Gemini is experiencing high demand right now — please try again in a moment." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong talking to the AI backend." },
      { status: 500 }
    );
  }
}