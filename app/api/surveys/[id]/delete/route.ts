import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/app/actions"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient()

  // Check if the user owns this survey
  const { data: survey, error: fetchError } = await supabase
    .from("surveys")
    .select()
    .eq("id", params.id)
    .eq("creator_id", user.id)
    .single()

  if (fetchError || !survey) {
    return NextResponse.json({ error: "Survey not found or you do not have permission to delete it" }, { status: 404 })
  }

  // Delete the survey
  const { error } = await supabase.from("surveys").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: "Failed to delete survey" }, { status: 500 })
  }

  // Revalidate paths
  revalidatePath("/surveys")
  revalidatePath("/dashboard")

  // Redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url))
}
