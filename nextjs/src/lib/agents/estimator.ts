import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const estimatorTool = {
  name: "classify_maintenance_ticket",
  description:
    "Classify a tenant maintenance ticket, estimate repair cost, and assign responsibility per standard US residential lease.",
  input_schema: {
    type: "object" as const,
    properties: {
      category: {
        type: "string",
        enum: [
          "plumbing",
          "electrical",
          "hvac",
          "appliance",
          "structural",
          "pest",
          "locksmith",
          "roofing",
          "general",
          "other",
        ],
        description: "Primary issue category",
      },
      priority: {
        type: "string",
        enum: ["emergency", "high", "medium", "low"],
        description:
          "emergency = safety risk / flooding / no heat in winter. high = major daily impact (no AC in summer, no hot water). medium = notable but not urgent. low = cosmetic.",
      },
      estimated_cost_usd: {
        type: "number",
        description: "Total estimate in USD (parts + labor). Round to nearest $10.",
      },
      responsibility: {
        type: "string",
        enum: ["landlord", "tenant", "shared", "unclear"],
        description:
          "landlord = building systems, wear-and-tear, code compliance. tenant = damage from negligence or misuse. shared = mixed cause. unclear = on-site investigation needed.",
      },
      rationale: {
        type: "string",
        description:
          "2-3 sentence explanation covering classification, cost basis, and responsibility assignment. No filler.",
      },
    },
    required: ["category", "priority", "estimated_cost_usd", "responsibility", "rationale"],
  },
};

const SYSTEM_PROMPT = `You are a US property management maintenance estimator with 15 years of field experience.
Your job: analyze tenant maintenance tickets and produce a classification + estimate.

COST GUIDANCE (typical US 2026 market rates):
- Plumbing leak repair: $150-450 | Clogged drain: $120-280 | Water heater replace: $900-1800
- Electrical outlet/switch: $120-280 | Breaker replace: $200-450 | Panel rewiring: $800-3500
- HVAC service call: $100-200 | AC compressor: $900-2500 | Furnace replace: $3000-7000
- Appliance repair: $150-400 | Fridge replace: $800-1500 | Dishwasher replace: $600-1200
- Pest control visit: $150-400 | Termite treatment: $1000-3000
- Locksmith: $100-250 | Roof minor repair: $300-900 | Major roof: $3000-15000

RESPONSIBILITY RULES (standard US residential lease):
- landlord: building systems failure, structural issues, normal wear, code compliance, appliances supplied with unit
- tenant: damage from negligence or misuse (wipes down toilet, holes in walls, broken blinds), tenant-owned appliances
- shared: ambiguous cause (old pipe that burst after tenant overloaded the line)
- unclear: cannot assess without on-site diagnosis

Be precise and concise. Do not speculate beyond the description. If the description is too vague, mark responsibility as "unclear" and set priority conservatively.`;

export type EstimatorResult = {
  category: string;
  priority: "emergency" | "high" | "medium" | "low";
  estimated_cost_usd: number;
  responsibility: "landlord" | "tenant" | "shared" | "unclear";
  rationale: string;
};

export async function runEstimator(description: string): Promise<EstimatorResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [estimatorTool],
    tool_choice: { type: "tool", name: "classify_maintenance_ticket" },
    messages: [
      {
        role: "user",
        content: `Tenant maintenance ticket:\n\n"""\n${description}\n"""\n\nClassify and estimate.`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Agent did not return structured output");
  }
  return toolUse.input as EstimatorResult;
}
