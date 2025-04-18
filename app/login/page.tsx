import Link from "next/link"
import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser } from "@/app/actions"
import { redirect } from "next/navigation"

export default async function LoginPage({
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
            <h1 className="text-3xl font-bold text-indigo">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
          </div>

          <LoginForm redirectUrl={searchParams.redirect} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href={searchParams.redirect ? `/signup?redirect=${searchParams.redirect}` : "/signup"}
                className="text-indigo hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
