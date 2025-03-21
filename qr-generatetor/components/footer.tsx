import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 mt-auto relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2 z-0"></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">QR Code Generator</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create customized QR codes with different patterns and colors
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/anwjt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          {/* Technology icons with proper alt text and improved accessibility */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
            alt="Next.js"
            className="h-6 w-6 dark:invert"
            title="Next.js"
          />
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg"
            alt="Supabase"
            className="h-6 w-6"
            title="Supabase"
          />
          <img
            src="https://raw.githubusercontent.com/devicons/devicon/refs/tags/v2.16.0/icons/tailwindcss/tailwindcss-original.svg"
            alt="Tailwind CSS"
            className="h-6 w-6"
            title="Tailwind CSS"
          />
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
            alt="TypeScript"
            className="h-6 w-6"
            title="TypeScript"
          />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            aria-label="v0.dev"
            role="img"
          >
            <title>v0.dev</title>
            <path d="M12 2L1 21H23L12 2Z" fill="currentColor" />
          </svg>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

