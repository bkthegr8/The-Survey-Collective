import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { SurveyForm } from "@/components/surveys/survey-form"
import { getCategories, getCurrentUser } from "@/app/actions"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

export default async function EditSurveyPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  const supabase = createClient()

  // Redirect to login if not authenticated
  if (!user) {
    redirect(`/login?redirect=/surveys/edit/${params.id}`)
  }

  // Fetch survey details
  const { data: survey, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", params.id)
    .eq("creator_id", user.id)
    .single()

  // If survey not found or user doesn't own it
  if (error || !survey) {
    notFound()
  }

  const categories = await getCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <SurveyForm categories={categories} initialData={survey} mode="edit" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
