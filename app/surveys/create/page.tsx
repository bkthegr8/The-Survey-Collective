import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { SurveyForm } from "@/components/surveys/survey-form"
import { getCategories, getCurrentUser } from "@/app/actions"
import { redirect } from "next/navigation"

export default async function CreateSurveyPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login?redirect=/surveys/create")
  }

  const categories = await getCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <SurveyForm categories={categories} mode="create" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
