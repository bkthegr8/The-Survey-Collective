"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { BarChart, User, LogOut, Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function NavBar() {
  const { user, signOut, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-gold" />
            <span className="text-xl font-bold">The Survey Collective</span>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className={`text-lg font-medium ${pathname === "/" ? "text-indigo" : "hover:text-indigo"}`}
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/surveys"
                  className={`text-lg font-medium ${pathname === "/surveys" ? "text-indigo" : "hover:text-indigo"}`}
                  onClick={() => setOpen(false)}
                >
                  Browse Surveys
                </Link>
                {user && (
                  <Link
                    href="/dashboard"
                    className={`text-lg font-medium ${pathname === "/dashboard" ? "text-indigo" : "hover:text-indigo"}`}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/about"
                  className={`text-lg font-medium ${pathname === "/about" ? "text-indigo" : "hover:text-indigo"}`}
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>

                <div className="border-t pt-4 mt-4">
                  {isLoading ? (
                    <div className="h-9 w-full bg-gray-200 animate-pulse rounded-md"></div>
                  ) : user ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-medium">{user.user_metadata.full_name || user.email}</p>
                      <Button
                        variant="outline"
                        className="mt-2 border-indigo text-indigo hover:bg-indigo/10"
                        onClick={() => {
                          setOpen(false)
                          router.push("/profile")
                        }}
                      >
                        Profile Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="mt-2 border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => {
                          setOpen(false)
                          handleSignOut()
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full border-indigo text-indigo hover:bg-indigo/10"
                        onClick={() => {
                          setOpen(false)
                          router.push("/login")
                        }}
                      >
                        Log in
                      </Button>
                      <Button
                        className="w-full bg-indigo hover:bg-indigo/90 text-white"
                        onClick={() => {
                          setOpen(false)
                          router.push("/signup")
                        }}
                      >
                        Sign up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium ${pathname === "/" ? "text-indigo" : "hover:text-indigo"}`}>
            Home
          </Link>
          <Link
            href="/surveys"
            className={`text-sm font-medium ${pathname === "/surveys" ? "text-indigo" : "hover:text-indigo"}`}
          >
            Browse Surveys
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${pathname === "/dashboard" ? "text-indigo" : "hover:text-indigo"}`}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            className={`text-sm font-medium ${pathname === "/about" ? "text-indigo" : "hover:text-indigo"}`}
          >
            About
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.user_metadata.full_name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" className="border-indigo text-indigo hover:bg-indigo/10" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" className="bg-indigo hover:bg-indigo/90 text-white" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
