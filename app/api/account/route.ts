import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function DELETE() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: "Service role key not configured" },
        { status: 500 }
      )
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { error: prdError } = await adminClient
      .from("prd_results")
      .delete()
      .eq("user_id", user.id)

    if (prdError) throw prdError

    const { error: submissionError } = await adminClient
      .from("form_submissions")
      .delete()
      .eq("user_id", user.id)

    if (submissionError) throw submissionError

    const { error: profileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", user.id)

    if (profileError) throw profileError

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete account"
    console.error("Account deletion error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
