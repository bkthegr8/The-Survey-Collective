"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Types
export type SurveyFormData = {
  title: string
  description: string
  category_id: number
  external_url: string
  estimated_time: number
  closing_date?: string
  status: "active" | "draft" | "completed"
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return session.user
}

// Create a new survey
export async function createSurvey(formData: SurveyFormData) {
  const supabase = createClient()
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("surveys")
    .insert({
      ...formData,
      creator_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating survey:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/surveys")
  revalidatePath("/dashboard")

  return { success: true, data }
}

// Update an existing survey
export async function updateSurvey(id: string, formData: Partial<SurveyFormData>) {
  const supabase = createClient()
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // First check if the user owns this survey
  const { data: survey, error: fetchError } = await supabase
    .from("surveys")
    .select()
    .eq("id", id)
    .eq("creator_id", user.id)
    .single()

  if (fetchError || !survey) {
    console.error("Error fetching survey or unauthorized:", fetchError)
    return { success: false, error: "Survey not found or you do not have permission to edit it" }
  }

  const { data, error } = await supabase
    .from("surveys")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating survey:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/surveys")
  revalidatePath("/dashboard")
  revalidatePath(`/surveys/${id}`)

  return { success: true, data }
}

// Delete a survey
export async function deleteSurvey(id: string) {
  const supabase = createClient()
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // First check if the user owns this survey
  const { data: survey, error: fetchError } = await supabase
    .from("surveys")
    .select()
    .eq("id", id)
    .eq("creator_id", user.id)
    .single()

  if (fetchError || !survey) {
    console.error("Error fetching survey or unauthorized:", fetchError)
    return { success: false, error: "Survey not found or you do not have permission to delete it" }
  }

  const { error } = await supabase.from("surveys").delete().eq("id", id)

  if (error) {
    console.error("Error deleting survey:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/surveys")
  revalidatePath("/dashboard")

  return { success: true }
}

// Record a survey participation
export async function recordParticipation(surveyId: string) {
  const supabase = createClient()
  const user = await getCurrentUser()

  const anonymousId = user ? null : `anon_${Math.random().toString(36).substring(2, 15)}`

  const { error } = await supabase.from("participants").insert({
    survey_id: surveyId,
    user_id: user?.id || null,
    anonymous_id: anonymousId,
  })

  if (error) {
    console.error("Error recording participation:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/surveys/${surveyId}`)

  return { success: true }
}

// Get all categories
export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

// Sign out
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()

  // Clear cookies
  cookies().delete("sb-access-token")
  cookies().delete("sb-refresh-token")

  redirect("/")
}
