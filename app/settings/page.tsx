"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, User, Mail, Lock, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProfileState {
  display_name: string
  avatar_url: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [profile, setProfile] = useState<ProfileState>({ display_name: "", avatar_url: "" })
  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwSaving, setPwSaving] = useState(false)
  const [emailSaving, setEmailSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (cancelled) return

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUserId(user.id)
        setUserEmail(user.email ?? "")

        const { data } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle()

        if (cancelled) return

        if (data) {
          setProfile({ display_name: data.display_name ?? "", avatar_url: data.avatar_url ?? "" })
          setDisplayName(data.display_name ?? "")
          setAvatarUrl(data.avatar_url ?? "")
        } else {
          setDisplayName(user.user_metadata?.display_name ?? "")
        }
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [router])

  const handleSaveProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setSaving(true)
    try {
      const supabase = createClient()
      const updates = {
        id: userId,
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" })

      if (error) throw error
      setProfile({ display_name: displayName.trim(), avatar_url: avatarUrl.trim() })
      toast.success("Profile updated successfully")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }, [userId, displayName, avatarUrl])

  const handleChangeEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim() || newEmail === userEmail) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    setEmailSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
      if (error) throw error
      toast.success("Check your new email to confirm the change")
      setNewEmail("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update email"
      toast.error(msg)
    } finally {
      setEmailSaving(false)
    }
  }, [newEmail, userEmail])

  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match")
      return
    }
    if (!currentPw) {
      toast.error("Please enter your current password")
      return
    }

    setPwSaving(true)
    try {
      const supabase = createClient()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPw,
      })
      if (signInError) throw new Error("Current password is incorrect")

      const { error } = await supabase.auth.updateUser({ password: newPw })
      if (error) throw error

      toast.success("Password updated successfully")
      setCurrentPw("")
      setNewPw("")
      setConfirmPw("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password"
      toast.error(msg)
    } finally {
      setPwSaving(false)
    }
  }, [currentPw, newPw, confirmPw, userEmail])

  const handleDeleteAccount = useCallback(async () => {
    if (!userId) return

    setDeleting(true)
    try {
      const response = await fetch("/api/account", { method: "DELETE" })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Failed to delete account")
      }

      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success("Account deleted")
      router.push("/")
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete account"
      toast.error(msg)
    } finally {
      setDeleting(false)
    }
  }, [userId, router])

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[40vh]"
        role="status"
        aria-live="polite"
        aria-label="Loading settings"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading settings…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, email, and password.
        </p>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" aria-hidden="true" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
            Email
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your display name and avatar URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your display name…"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    autoComplete="off"
                    inputMode="url"
                    placeholder="https://example.com/avatar.png…"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a public image URL. Leave empty to use the default avatar.
                  </p>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                      Save Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Change the email associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Email</Label>
                <Input
                  type="email"
                  value={userEmail}
                  readOnly
                  aria-readonly="true"
                  className="bg-muted"
                />
              </div>
              <form onSubmit={handleChangeEmail} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="new_email">New Email</Label>
                  <Input
                    id="new_email"
                    name="new_email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    placeholder="newemail@example.com…"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={emailSaving || newEmail === userEmail}>
                  {emailSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      Updating…
                    </>
                  ) : (
                    "Update Email"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Choose a strong password with at least 8 characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your current password…"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    required
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters…"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your new password…"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                <Button type="submit" disabled={pwSaving}>
                  {pwSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      Updating…
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated PRDs. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Delete Account
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your profile, all PRDs, and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      Deleting…
                    </>
                  ) : (
                    "Delete Forever"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
