export default function EstateOpsLanding() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6">
          IN ACTIVE DEVELOPMENT · LAUNCHING THIS MONTH
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          EstateOps AI
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-3">
          Three Claude agents for property management.
        </p>
        <p className="text-lg text-gray-600 mt-6 max-w-2xl">
          Property managers with 50-500 units waste 15-20 hours/week on manual maintenance coordination.
          EstateOps automates the full cycle: ticket classification, cost estimation, vendor dispatch,
          and tenant communication.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">The 3 agents</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: '01', name: 'Maintenance Estimator', role: 'Classifies tickets, estimates repair cost, assigns landlord vs tenant responsibility.', stack: 'Claude Sonnet · SSE streaming' },
            { n: '02', name: 'Vendor Router', role: 'Matches required skill + zone + rating + availability. Returns top 3 vendors with rationale.', stack: 'Claude tool use · Supabase query' },
            { n: '03', name: 'Tenant Comms', role: 'Timed messaging: immediate confirmation, T-30min reminder, T+2h status, T+24h satisfaction.', stack: 'Vercel Cron · Twilio' },
          ].map((a) => (
            <div key={a.n} className="border border-gray-200 rounded-lg p-6">
              <div className="text-xs font-mono text-blue-600 mb-3">AGENT {a.n}</div>
              <h3 className="text-xl font-bold mb-2">{a.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{a.role}</p>
              <p className="text-xs text-gray-500 font-mono">{a.stack}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Flow</h2>
        <div className="bg-gray-50 rounded-lg p-8 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800">
{`Tenant ticket  →  Agent 1 Estimator   →  classified + priced
                       ↓
                  Agent 2 Router       →  vendor matched
                       ↓
                  Agent 3 Comms        →  tenant notified
                       ↓
                  CRM webhook + audit log`}
          </pre>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Why Real Estate</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div><div className="text-4xl font-bold text-blue-700">7,053</div><div className="text-sm text-gray-600 mt-1">Upwork AI jobs analyzed</div></div>
          <div><div className="text-4xl font-bold text-blue-700">3.7×</div><div className="text-sm text-gray-600 mt-1">Real Estate demand vs HVAC (60d)</div></div>
          <div><div className="text-4xl font-bold text-blue-700">51.6</div><div className="text-sm text-gray-600 mt-1">Opportunity score RE vs 16.3 HVAC</div></div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Stack</h2>
        <p className="text-gray-700">
          Next.js 16 · Claude Sonnet 4.6 · Supabase (pgvector) · Vercel Cron · Twilio · TypeScript
        </p>
      </section>

      <footer className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-200 text-sm text-gray-500">
        <p>Built by Richard Kennedy · <a href="https://www.upwork.com/freelancers/~01de02e76c40454703" className="text-blue-600 hover:underline">Upwork profile</a></p>
      </footer>
    </main>
  );
}
