import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { getCategories } from "@/app/actions"
import { SurveysContent } from "@/components/surveys/surveys-content"

export default async function SurveysPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; q?: string }
}) {
  const supabase = createClient()
  const categories = await getCategories()

  // Build query
  let query = supabase
    .from("surveys")
    .select(`
      *,
      categories(id, name),
      profiles(full_name)
    `)
    .eq("status", "active")

  // Apply category filter
  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category)
  }

  // Apply search filter
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }

  // Apply sorting
  if (searchParams.sort === "newest") {
    query = query.order("created_at", { ascending: false })
  } else if (searchParams.sort === "closing-soon") {
    query = query.not("closing_date", "is", null).order("closing_date", { ascending: true })
  } else if (searchParams.sort === "shortest") {
    query = query.order("estimated_time", { ascending: true })
  } else {
    // Default sorting
    query = query.order("created_at", { ascending: false })
  }

  const { data: surveys, error } = await query

  // Get selected category name for display
  const selectedCategory = searchParams.category
    ? categories.find((c) => c.id.toString() === searchParams.category)?.name
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="bg-indigo text-white py-12">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">Browse Surveys</h1>
            <p className="text-lavender max-w-2xl">
              Find and participate in research surveys across various categories and topics
            </p>
          </div>
        </div>

        <div className="container py-8">
          <SurveysContent
            surveys={surveys || []}
            categories={categories}
            selectedCategory={selectedCategory}
            error={error ? "Error loading surveys. Please try again." : null}
            currentSort={searchParams.sort || "newest"}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
