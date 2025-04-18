import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0 bg-indigo text-white">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose md:text-left">
          © 2025 The Survey Collective. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-medium hover:text-lavender">
            About
          </Link>
          <Link href="/terms" className="text-sm font-medium hover:text-lavender">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm font-medium hover:text-lavender">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-lavender">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
