import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-context"
import { AddSurveyButton } from "@/components/surveys/add-survey-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Survey Collective",
  description: "Connect survey creators with willing participants",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            
            <AddSurveyButton />
          
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
