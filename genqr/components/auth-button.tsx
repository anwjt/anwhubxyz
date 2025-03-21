"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function AuthButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error("Error signing in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      window.location.reload()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignIn} disabled={isLoading} className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700">
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          <Github size={16} />
          GitHub
        </>
      )}
    </Button>
  )
}
