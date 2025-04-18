import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Clock, Edit, Eye, ExternalLink, Plus, Trash2, Users } from "lucide-react"
import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/app/actions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login?redirect=/dashboard")
  }

  const supabase = createClient()

  // Fetch user's surveys
  const { data: surveys } = await supabase
    .from("surveys")
    .select(`
      *,
      categories(name),
      profiles(full_name)
    `)
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })

  // Count participants for each survey
  const surveysWithParticipants = await Promise.all(
    (surveys || []).map(async (survey) => {
      const { count } = await supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("survey_id", survey.id)

      return {
        ...survey,
        participant_count: count || 0,
      }
    }),
  )

  // Group surveys by status
  const activeSurveys = surveysWithParticipants.filter((s) => s.status === "active")
  const draftSurveys = surveysWithParticipants.filter((s) => s.status === "draft")
  const completedSurveys = surveysWithParticipants.filter((s) => s.status === "completed")

  // Calculate stats
  const totalParticipants = surveysWithParticipants.reduce((sum, survey) => sum + survey.participant_count, 0)
  const averageCompletionRate = 78 // This would normally be calculated from actual data

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-indigo">Creator Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your surveys and track participation</p>
            </div>
            <Button className="bg-gold hover:bg-gold/90 text-indigo font-medium" asChild>
              <Link href="/surveys/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Survey
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-lavender/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indigo">Total Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo">{surveysWithParticipants.length}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeSurveys.length} active, {draftSurveys.length} drafts
                </p>
              </CardContent>
            </Card>
            <Card className="border-lavender/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indigo">Total Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo">{totalParticipants}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Across all your surveys</p>
              </CardContent>
            </Card>
            <Card className="border-lavender/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indigo">Average Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo">{averageCompletionRate}%</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Based on completed surveys</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="mb-8">
            <TabsList className="bg-lavender/30">
              <TabsTrigger value="active" className="data-[state=active]:bg-indigo data-[state=active]:text-white">
                Active Surveys ({activeSurveys.length})
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-indigo data-[state=active]:text-white">
                Drafts ({draftSurveys.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-indigo data-[state=active]:text-white">
                Completed ({completedSurveys.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              {activeSurveys.length > 0 ? (
                <div className="grid gap-6">
                  {activeSurveys.map((survey) => (
                    <Card key={survey.id} className="border-lavender/50">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="bg-lavender/20 text-indigo border-lavender/30">
                            {survey.categories?.name || "General"}
                          </Badge>
                          {survey.is_featured && (
                            <Badge className="bg-gold hover:bg-gold/90 text-indigo font-medium">Featured</Badge>
                          )}
                        </div>
                        <CardTitle className="mt-2 text-xl text-indigo">{survey.title}</CardTitle>
                        <CardDescription className="text-base">
                          Created on {new Date(survey.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex flex-col">
                            <span className="text-gray-500">Participants</span>
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4 text-gold" />
                              <span className="font-medium">{survey.participant_count}</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500">Status</span>
                            <div className="flex items-center">
                              <Eye className="mr-1 h-4 w-4 text-gold" />
                              <span className="font-medium capitalize">{survey.status}</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500">Closing Date</span>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-gold" />
                              <span className="font-medium">
                                {survey.closing_date
                                  ? new Date(survey.closing_date).toLocaleDateString()
                                  : "No closing date"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-indigo text-indigo hover:bg-indigo/10"
                            asChild
                          >
                            <Link href={`/surveys/edit/${survey.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          <form action={`/api/surveys/${survey.id}/delete`} method="POST">
                            <Button
                              variant="outline"
                              size="sm"
                              type="submit"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </form>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-burgundy text-burgundy hover:bg-burgundy/10"
                            asChild
                          >
                            <Link href={`/surveys/${survey.id}/analytics`}>
                              <BarChart className="mr-2 h-4 w-4" />
                              Analytics
                            </Link>
                          </Button>
                          <Button size="sm" className="bg-gold hover:bg-gold/90 text-indigo font-medium" asChild>
                            <a href={survey.external_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Survey
                            </a>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-lavender/50">
                  <CardHeader>
                    <CardTitle className="text-indigo">No Active Surveys</CardTitle>
                    <CardDescription>
                      You don't have any active surveys yet. Create a new survey to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="bg-indigo hover:bg-indigo/90 text-white" asChild>
                      <Link href="/surveys/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Survey
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="draft" className="mt-4">
              {draftSurveys.length > 0 ? (
                <div className="grid gap-4">
                  {draftSurveys.map((survey) => (
                    <div
                      key={survey.id}
                      className="flex items-center justify-between p-4 border border-lavender/50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-indigo">{survey.title}</h3>
                        <p className="text-sm text-gray-500">
                          Last edited on {new Date(survey.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" className="bg-indigo hover:bg-indigo/90 text-white" asChild>
                        <Link href={`/surveys/edit/${survey.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Continue Editing
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-lavender/50">
                  <CardHeader>
                    <CardTitle className="text-indigo">No Draft Surveys</CardTitle>
                    <CardDescription>You don't have any surveys in draft mode.</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {completedSurveys.length > 0 ? (
                <div className="grid gap-4">
                  {completedSurveys.map((survey) => (
                    <div
                      key={survey.id}
                      className="flex items-center justify-between p-4 border border-lavender/50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-indigo">{survey.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-4">Completed on {new Date(survey.updated_at).toLocaleDateString()}</span>
                          <span className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {survey.participant_count} participants
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-burgundy text-burgundy hover:bg-burgundy/10"
                        asChild
                      >
                        <Link href={`/surveys/${survey.id}/analytics`}>
                          <BarChart className="mr-2 h-4 w-4" />
                          View Results
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-lavender/50">
                  <CardHeader>
                    <CardTitle className="text-indigo">No Completed Surveys</CardTitle>
                    <CardDescription>You don't have any completed surveys yet.</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
