"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type Category = {
  id: number
  name: string
}

export function SurveyFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  // Get the current category from URL
  const currentCategory = searchParams.get("category")

  const handleCategoryClick = (categoryId: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (params.get("category") === categoryId.toString()) {
      params.delete("category")
    } else {
      params.set("category", categoryId.toString())
    }

    router.push(`/surveys?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }

    router.push(`/surveys?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder="Search surveys..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-indigo"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div>
        <h3 className="font-medium text-indigo mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                currentCategory === category.id.toString()
                  ? "bg-indigo text-white"
                  : "hover:bg-lavender/20 text-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
