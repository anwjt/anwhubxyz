import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AuthButton from "@/components/auth-button"
import { ModeToggle } from "@/components/mode-toggle"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Create customized QR codes with different patterns and colors",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="border-b bg-background">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold">QR Code Generator</h1>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <AuthButton />
              </div>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'