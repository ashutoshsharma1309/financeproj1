import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompts";
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

  // If Gemini is configured, use it — grounded strictly in the provided context.
  if (isGeminiConfigured()) {
    try {
      const answer = await generateWithGemini(
        SYSTEM_PROMPT,
        buildUserPrompt(question, context),
      );
      return NextResponse.json({ answer, mode: "gemini" });
    } catch (err) {
      // Fall through to local analysis on provider failure.
      const answer = localAnalysis(question, context);
      return NextResponse.json({
        answer,
        mode: "local",
        note: err instanceof Error ? err.message : "AI provider unavailable",
      });
    }
  }

  // No key configured — deterministic analysis grounded in the same context.
  const answer = localAnalysis(question, context);
  return NextResponse.json({ answer, mode: "local" });
}
