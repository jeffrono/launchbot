import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mindbody Launch Bot
        </h1>
        <p className="text-gray-500 mb-8">
          Your AI-powered onboarding assistant for setting up your business on
          Mindbody.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/admin"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Admin Dashboard
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-8">
          Customers access their workspace at their unique URL
        </p>
      </div>
    </div>
  );
}
