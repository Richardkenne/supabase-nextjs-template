import Link from "next/link";

export default function EstateOpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/tickets/new" className="flex items-center gap-2 font-bold">
            <span className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs">E</span>
            EstateOps AI
          </Link>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/tickets/new" className="hover:text-gray-900">New ticket</Link>
            <Link href="/tickets" className="hover:text-gray-900">Tickets</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
