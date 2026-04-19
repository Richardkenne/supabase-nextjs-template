import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runEstimator } from "@/lib/agents/estimator";

export const runtime = "nodejs";
export const maxDuration = 60;

function supa() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
    { db: { schema: "estateops" as unknown as "public" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, unit_id } = body as { description?: string; unit_id?: string };

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "description is required (min 10 characters)" },
        { status: 400 }
      );
    }

    const started = Date.now();
    const estimation = await runEstimator(description.trim());
    const latency_ms = Date.now() - started;

    const client = supa();
    const { data: ticket, error } = await client
      .from("tickets")
      .insert({
        unit_id: unit_id ?? null,
        description: description.trim(),
        category: estimation.category,
        priority: estimation.priority,
        estimated_cost_usd: estimation.estimated_cost_usd,
        responsibility: estimation.responsibility,
        rationale: estimation.rationale,
        estimated_at: new Date().toISOString(),
        status: "estimated",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert failed:", error);
      return NextResponse.json({ estimation, persisted: false, db_error: error.message, latency_ms });
    }

    return NextResponse.json({ estimation, ticket, persisted: true, latency_ms });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown agent failure";
    console.error("Estimator route error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
