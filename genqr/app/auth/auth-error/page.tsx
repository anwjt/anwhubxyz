import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
      <p className="text-center mb-6 max-w-md">
        There was a problem authenticating your account. Please try again or contact support if the issue persists.
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}

