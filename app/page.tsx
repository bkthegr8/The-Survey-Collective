import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { Clock, ExternalLink, Search, Users } from "lucide-react"

export default async function HomePage() {
  const supabase = createClient()

  // Fetch featured surveys
  const { data: featuredSurveys } = await supabase
    .from("surveys")
    .select(`
      *,
      categories(name),
      profiles(full_name)
    `)
    .eq("is_featured", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo to-indigo/90 text-white py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Connect Survey Creators with Willing Participants</h1>
              <p className="text-lg md:text-xl mb-8 text-lavender">
                Find surveys to participate in or share your own research with our community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-indigo font-medium" asChild>
                  <Link href="/surveys">Browse Surveys</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Surveys Section */}
        <section className="py-16 bg-lavender/10">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-indigo">Featured Surveys</h2>
                <p className="text-gray-600">Participate in these highlighted research opportunities</p>
              </div>
              <Button variant="outline" className="border-indigo text-indigo hover:bg-indigo/10" asChild>
                <Link href="/surveys">
                  <Search className="mr-2 h-4 w-4" />
                  View All Surveys
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredSurveys?.map((survey) => (
                <Card key={survey.id} className="border-lavender/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-lavender/20 text-indigo rounded-full">
                        {survey.categories?.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-indigo mb-2">{survey.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-gold" />
                        <span>{survey.estimated_time} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-gold" />
                        <span>By {survey.profiles?.full_name || "Researcher"}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-indigo hover:bg-indigo/90 text-white" asChild>
                      <a href={survey.external_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Take Survey
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {(!featuredSurveys || featuredSurveys.length === 0) && (
                <div className="md:col-span-3 text-center py-12">
                  <p className="text-gray-500">No featured surveys available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-indigo mb-4">Browse by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore surveys across different fields and topics</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/surveys?category=${category.id}`}
                  className="bg-lavender/10 hover:bg-lavender/20 border border-lavender/30 rounded-lg p-6 text-center transition-colors"
                >
                  <h3 className="text-lg font-medium text-indigo mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-indigo/5">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-indigo mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The Survey Collective makes it easy to connect researchers with participants
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-indigo mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up for free to access all features of The Survey Collective platform
                </p>
              </div>

              <div className="text-center">
                <div className="bg-indigo text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-indigo mb-2">Browse or Create</h3>
                <p className="text-gray-600">Find surveys to participate in or create your own research surveys</p>
              </div>

              <div className="text-center">
                <div className="bg-indigo text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-indigo mb-2">Connect & Contribute</h3>
                <p className="text-gray-600">Participate in surveys or collect responses for your research</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-indigo font-medium" asChild>
                <Link href="/signup">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
