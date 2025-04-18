import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, recordParticipation } from "@/app/actions"
import { notFound } from "next/navigation"
import { Clock, Calendar, ExternalLink, Share2, Users } from "lucide-react"

export default async function SurveyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const user = await getCurrentUser()

  // Fetch survey details
  const { data: survey, error } = await supabase
    .from("surveys")
    .select(`
      *,
      categories(id, name),
      profiles(id, full_name)
    `)
    .eq("id", params.id)
    .single()

  if (error || !survey) {
    notFound()
  }

  // Count participants
  const { count: participantCount } = await supabase
    .from("participants")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", survey.id)

  // Check if user has already participated
  let hasParticipated = false
  if (user) {
    const { data } = await supabase
      .from("participants")
      .select("*")
      .eq("survey_id", survey.id)
      .eq("user_id", user.id)
      .maybeSingle()

    hasParticipated = !!data
  }

  // Format dates
  const createdDate = new Date(survey.created_at).toLocaleDateString()
  const closingDate = survey.closing_date ? new Date(survey.closing_date).toLocaleDateString() : null

  // Check if survey is closed
  const isClosed = survey.status === "completed" || (survey.closing_date && new Date(survey.closing_date) < new Date())

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="bg-indigo text-white py-12">
          <div className="container">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={`/surveys?category=${survey.category_id}`}
                className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                {survey.categories?.name}
              </Link>
              {survey.is_featured && (
                <Badge className="bg-gold hover:bg-gold/90 text-indigo font-medium">Featured</Badge>
              )}
              {isClosed && (
                <Badge variant="outline" className="border-white/50 text-white">
                  Closed
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lavender">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>By {survey.profiles?.full_name || "Researcher"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Posted on {createdDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{survey.estimated_time} minutes to complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="border-lavender/50 mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-indigo mb-4">About This Survey</h2>
                  <p className="text-gray-700 whitespace-pre-line mb-6">{survey.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-indigo">Category</h3>
                      <p>{survey.categories?.name}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-indigo">Estimated Time</h3>
                      <p>{survey.estimated_time} minutes</p>
                    </div>

                    {closingDate && (
                      <div>
                        <h3 className="font-medium text-indigo">Closing Date</h3>
                        <p>{isClosed ? "Closed" : `Closes on ${closingDate}`}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium text-indigo">Participants</h3>
                      <p>{participantCount} people have taken this survey</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related surveys would go here */}
            </div>

            <div>
              <Card className="border-lavender/50 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-indigo mb-4">Take This Survey</h2>

                  {isClosed ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                      This survey is no longer accepting responses.
                    </div>
                  ) : (
                    <>
                      {hasParticipated && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
                          You have already participated in this survey.
                        </div>
                      )}

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-gold" />
                          <span>Takes about {survey.estimated_time} minutes</span>
                        </div>

                        {closingDate && (
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-gold" />
                            <span>Closes on {closingDate}</span>
                          </div>
                        )}
                      </div>

                      <form
                        action={async () => {
                          "use server"
                          await recordParticipation(survey.id)
                        }}
                      >
                        <Button
                          className="w-full bg-indigo hover:bg-indigo/90 text-white mb-4"
                          formAction={async () => {
                            "use server"
                            await recordParticipation(survey.id)
                            window.location.href = survey.external_url
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Take Survey Now
                        </Button>
                      </form>
                    </>
                  )}

                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(`Survey: ${survey.title}`)}&body=${encodeURIComponent(`I thought you might be interested in this survey: ${survey.title}\n\nCheck it out here: ${typeof window !== "undefined" ? window.location.href : ""}\n\nProvided by The Survey Collective`)}`}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share This Survey
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
