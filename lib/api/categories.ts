"use client"

import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    throw error
  }

  return data
}

export async function getCategoryById(id: number) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching category:", error)
    throw error
  }

  return data
}
