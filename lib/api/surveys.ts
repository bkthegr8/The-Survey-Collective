"use client"

import { createClient } from "@/lib/supabase/client"
import type { Survey } from "@/lib/supabase/database.types"

const supabase = createClient()

export async function getFeaturedSurveys(limit = 6) {
  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      categories(name),
      profiles(full_name, avatar_url),
      participants(count)
    `)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured surveys:", error)
    throw error
  }

  return data
}

export async function getSurveys(filters: {
  category?: number
  status?: string
  timeRequired?: number[]
  search?: string
  sort?: string
  page?: number
  limit?: number
}) {
  const { category, status = "active", timeRequired, search, sort = "newest", page = 1, limit = 8 } = filters

  let query = supabase
    .from("surveys")
    .select(
      `
      *,
      categories(name),
      profiles(full_name, avatar_url),
      participants(count)
    `,
      { count: "exact" },
    )
    .eq("status", status)

  // Apply filters
  if (category) {
    query = query.eq("category_id", category)
  }

  if (timeRequired && timeRequired.length === 2) {
    query = query.gte("estimated_time", timeRequired[0]).lte("estimated_time", timeRequired[1])
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Apply sorting
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "closing-soon":
      query = query.order("closing_date", { ascending: true })
      break
    case "most-needed":
      query = query.order("participants.count", { ascending: true })
      break
    case "shortest":
      query = query.order("estimated_time", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching surveys:", error)
    throw error
  }

  return { data, count }
}

export async function getUserSurveys(userId: string, status = "active") {
  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      categories(name),
      participants(count)
    `)
    .eq("creator_id", userId)
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user surveys:", error)
    throw error
  }

  return data
}

export async function getSurveyById(id: string) {
  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      categories(name),
      profiles(full_name, avatar_url),
      participants(count)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching survey:", error)
    throw error
  }

  return data
}

export async function createSurvey(survey: Omit<Survey, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("surveys").insert(survey).select().single()

  if (error) {
    console.error("Error creating survey:", error)
    throw error
  }

  return data
}

export async function updateSurvey(id: string, survey: Partial<Survey>) {
  const { data, error } = await supabase.from("surveys").update(survey).eq("id", id).select().single()

  if (error) {
    console.error("Error updating survey:", error)
    throw error
  }

  return data
}

export async function deleteSurvey(id: string) {
  const { error } = await supabase.from("surveys").delete().eq("id", id)

  if (error) {
    console.error("Error deleting survey:", error)
    throw error
  }

  return true
}

export async function participateInSurvey(surveyId: string, userId?: string) {
  const anonymousId = userId ? null : crypto.randomUUID()

  const { data, error } = await supabase
    .from("participants")
    .insert({
      survey_id: surveyId,
      user_id: userId || null,
      anonymous_id: anonymousId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error participating in survey:", error)
    throw error
  }

  return data
}
