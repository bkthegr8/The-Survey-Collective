"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createSurvey, updateSurvey, type SurveyFormData } from "@/app/actions"

type Category = {
  id: number
  name: string
}

type SurveyFormProps = {
  categories: Category[]
  initialData?: {
    id: string
  } & SurveyFormData
  mode: "create" | "edit"
}

export function SurveyForm({ categories, initialData, mode }: SurveyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<SurveyFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || 0,
    external_url: initialData?.external_url || "",
    estimated_time: initialData?.estimated_time || 5,
    closing_date: initialData?.closing_date ? new Date(initialData.closing_date).toISOString().split("T")[0] : "",
    status: initialData?.status || "active",
  })

  const handleChange = (field: keyof SurveyFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (mode === "create") {
        const result = await createSurvey(formData)
        if (!result.success) {
          setError(result.error || "Failed to create survey")
          setIsSubmitting(false)
          return
        }
      } else if (mode === "edit" && initialData) {
        const result = await updateSurvey(initialData.id, formData)
        if (!result.success) {
          setError(result.error || "Failed to update survey")
          setIsSubmitting(false)
          return
        }
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Error submitting survey:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-indigo">
          {mode === "create" ? "Create New Survey" : "Edit Survey"}
        </CardTitle>
        <CardDescription>
          {mode === "create" ? "Fill out the form below to create a new survey" : "Update your survey details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Survey Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter a descriptive title for your survey"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Provide a brief description of your survey"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category_id.toString()}
              onValueChange={(value) => handleChange("category_id", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_url">Survey URL *</Label>
            <Input
              id="external_url"
              type="url"
              value={formData.external_url}
              onChange={(e) => handleChange("external_url", e.target.value)}
              placeholder="https://your-survey-platform.com/your-survey"
              required
            />
            <p className="text-xs text-gray-500">Enter the URL where participants can take your survey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_time">Estimated Time (minutes) *</Label>
              <Input
                id="estimated_time"
                type="number"
                min="1"
                value={formData.estimated_time}
                onChange={(e) => handleChange("estimated_time", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing_date">Closing Date</Label>
              <Input
                id="closing_date"
                type="date"
                value={formData.closing_date || ""}
                onChange={(e) => handleChange("closing_date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value as "active" | "draft" | "completed")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo hover:bg-indigo/90 text-white" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create Survey"
                  : "Update Survey"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
