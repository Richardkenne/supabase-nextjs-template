"use client";

import { useState } from "react";

type Estimation = {
  category: string;
  priority: "emergency" | "high" | "medium" | "low";
  estimated_cost_usd: number;
  responsibility: "landlord" | "tenant" | "shared" | "unclear";
  rationale: string;
};

const SAMPLES = [
  "Kitchen sink is leaking under the cabinet. Water pooling on the floor every time I run the faucet. Started 2 days ago, getting worse.",
  "AC unit stopped blowing cold air. Outside is 95F. Indoor now 84F. I can hear the unit running but only warm air comes out.",
  "Dishwasher is not draining. I've already tried running it twice and water just sits at the bottom. No error codes on the display.",
  "Bathroom light switch sparks when I turn it on. Been using the other bathroom to avoid it. Happened suddenly last night.",
];

export default function NewTicketPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Estimation | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    setLatency(null);
    try {
      const res = await fetch("/api/agents/estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.estimation);
      setLatency(data.latency_ms ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs font-mono font-semibold text-blue-700 tracking-wider">
        AGENT 01 · MAINTENANCE ESTIMATOR
      </div>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Submit maintenance ticket</h1>
      <p className="mt-3 text-gray-600">
        Describe the issue in plain language. Agent 1 classifies category &amp; priority, estimates cost, and assigns landlord vs tenant responsibility.
      </p>

      <div className="mt-8 flex gap-2 flex-wrap">
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setDescription(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-500 text-gray-600 hover:text-blue-700 transition-colors"
          >
            Sample {i + 1}
          </button>
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. Water heater making loud banging noise and no hot water since yesterday..."
        className="mt-4 w-full min-h-[160px] p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:border-blue-600 text-sm"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">{description.length} characters</div>
        <button
          onClick={submit}
          disabled={loading || description.trim().length < 10}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Agent analyzing…" : "Run Estimator →"}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50 text-sm text-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-blue-700">CLASSIFICATION RESULT</div>
              <div className="mt-1 text-xs text-gray-500">
                Claude Sonnet 4.6 · structured output via tool use
                {latency !== null && <> · {latency}ms</>}
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              ESTIMATED
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <Cell label="Category" value={result.category} />
            <Cell label="Priority" value={result.priority} accent={priorityColor(result.priority)} />
            <Cell label="Estimated cost" value={`$${result.estimated_cost_usd.toLocaleString()}`} />
            <Cell label="Responsibility" value={result.responsibility} accent={responsibilityColor(result.responsibility)} />
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50/50">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rationale</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-800">{result.rationale}</p>
          </div>
        </div>
      )}
    </main>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className={`mt-1 text-lg font-semibold capitalize ${accent ?? "text-gray-900"}`}>{value}</div>
    </div>
  );
}

function priorityColor(p: Estimation["priority"]): string {
  return (
    { emergency: "text-red-600", high: "text-orange-600", medium: "text-yellow-600", low: "text-green-600" }[p] ?? "text-gray-900"
  );
}

function responsibilityColor(r: Estimation["responsibility"]): string {
  return (
    { landlord: "text-blue-600", tenant: "text-purple-600", shared: "text-gray-600", unclear: "text-gray-500" }[r] ?? "text-gray-900"
  );
}
