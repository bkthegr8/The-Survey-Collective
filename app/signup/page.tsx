import Link from "next/link"
import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { SignupForm } from "@/components/auth/signup-form"
import { getCurrentUser } from "@/app/actions"
import { redirect } from "next/navigation"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  const user = await getCurrentUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect(searchParams.redirect || "/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo">Create an Account</h1>
            <p className="text-gray-600 mt-2">Join The Survey Collective today</p>
          </div>

          <SignupForm redirectUrl={searchParams.redirect} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={searchParams.redirect ? `/login?redirect=${searchParams.redirect}` : "/login"}
                className="text-indigo hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
