"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ExternalLink, Filter, Users } from "lucide-react"
import { SurveyFilters } from "@/components/surveys/survey-filters"
import { useRouter } from "next/navigation"

type Survey = {
  id: string
  title: string
  description: string | null
  external_url: string
  estimated_time: number
  is_featured: boolean
  closing_date: string | null
  categories: {
    id: number
    name: string
  } | null
  profiles: {
    full_name: string | null
  } | null
}

type Category = {
  id: number
  name: string
}

type SurveysContentProps = {
  surveys: Survey[]
  categories: Category[]
  selectedCategory: string | null
  error: string | null
  currentSort: string
}

export function SurveysContent({ surveys, categories, selectedCategory, error, currentSort }: SurveysContentProps) {
  const router = useRouter()

  const handleSortChange = (sort: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sort", sort)
    router.push(url.toString())
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/4">
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-indigo">Filters</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/surveys" className="text-gray-500 text-sm">
                Clear all
              </Link>
            </Button>
          </div>

          <SurveyFilters categories={categories} />
        </div>
      </div>

      <div className="lg:w-3/4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-indigo">
              {selectedCategory ? `${selectedCategory} Surveys` : "All Surveys"}
            </h2>
            <p className="text-gray-600">
              {surveys.length} {surveys.length === 1 ? "survey" : "surveys"} available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="text-sm border-none bg-transparent focus:outline-none focus:ring-0"
              onChange={(e) => handleSortChange(e.target.value)}
              value={currentSort}
            >
              <option value="newest">Newest First</option>
              <option value="closing-soon">Closing Soon</option>
              <option value="shortest">Shortest First</option>
            </select>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <div className="grid gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} className="border-lavender/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-lavender/20 text-indigo rounded-full">
                        {survey.categories?.name}
                      </span>
                      {survey.is_featured && (
                        <span className="text-xs px-2 py-1 bg-gold/20 text-indigo rounded-full">Featured</span>
                      )}
                    </div>
                    <Link href={`/surveys/${survey.id}`} className="hover:underline">
                      <h3 className="text-xl font-bold text-indigo mb-2">{survey.title}</h3>
                    </Link>
                    <p className="text-gray-600 mb-4">{survey.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-gold" />
                        <span>{survey.estimated_time} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-gold" />
                        <span>By {survey.profiles?.full_name || "Researcher"}</span>
                      </div>
                      {survey.closing_date && (
                        <div>
                          <span className="text-burgundy">
                            Closes {new Date(survey.closing_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <Button className="bg-indigo hover:bg-indigo/90 text-white" asChild>
                      <a href={survey.external_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Take Survey
                      </a>
                    </Button>
                    <Button variant="outline" className="border-indigo text-indigo hover:bg-indigo/10" asChild>
                      <Link href={`/surveys/${survey.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {surveys.length === 0 && (
            <div className="text-center py-12 bg-lavender/10 rounded-lg">
              <p className="text-gray-500 mb-4">No surveys found matching your criteria.</p>
              <Button asChild>
                <Link href="/surveys">View All Surveys</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
