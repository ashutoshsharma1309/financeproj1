import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompts";
import { generateWithOpenAI, isOpenAIConfigured } from "@/lib/ai/openai";
import { generateWithGemini, isGeminiConfigured } from "@/lib/ai/gemini";
import { localAnalysis } from "@/lib/ai/insights";
import type { FinancialContext } from "@/lib/ai/context";

export const runtime = "nodejs";

// Simple in-memory rate limiter (per-IP). In production, back this with Redis.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  let body: { question?: string; context?: FinancialContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = (body.question ?? "").toString().slice(0, 2000).trim();
  const context = body.context;
  if (!question || !context) {
    return NextResponse.json(
      { error: "A question and financial context are required." },
      { status: 400 },
    );
  }

  const userPrompt = buildUserPrompt(question, context);

  // Provider chain: OpenAI → Gemini → deterministic local analysis. Each is
  // grounded strictly in the provided context; on a provider error we fall
  // through to the next so the assistant always answers.
  const providers: { mode: string; run: () => Promise<string> }[] = [];
  if (isOpenAIConfigured()) {
    providers.push({
      mode: "openai",
      run: () => generateWithOpenAI(SYSTEM_PROMPT, userPrompt),
    });
  }
  if (isGeminiConfigured()) {
    providers.push({
      mode: "gemini",
      run: () => generateWithGemini(SYSTEM_PROMPT, userPrompt),
    });
  }

  let lastError: string | undefined;
  for (const provider of providers) {
    try {
      const answer = await provider.run();
      return NextResponse.json({ answer, mode: provider.mode });
    } catch (err) {
      lastError = err instanceof Error ? err.message : "AI provider unavailable";
      // Try the next provider (or fall through to local analysis).
    }
  }

  // No key configured, or every provider failed — deterministic analysis
  // grounded in the same context so the assistant never fabricates figures.
  const answer = localAnalysis(question, context);
  return NextResponse.json(
    lastError
      ? { answer, mode: "local", note: lastError }
      : { answer, mode: "local" },
  );
}
