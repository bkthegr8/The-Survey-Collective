import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="bg-indigo text-white py-12">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">About The Survey Collective</h1>
            <p className="text-lavender max-w-2xl">
              Learn more about our platform, mission, and the team behind The Survey Collective
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-indigo mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  The Survey Collective was created to bridge the gap between researchers and participants. We believe
                  that quality research requires diverse perspectives, and finding willing participants shouldn't be a
                  barrier to advancing knowledge.
                </p>
                <p className="text-gray-700 mb-4">
                  Our platform provides a centralized hub where researchers, students, and businesses can share their
                  surveys and connect with participants who are genuinely interested in contributing to their fields of
                  study.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-indigo mb-4">What We Offer</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card className="border-lavender/50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-indigo mb-2">For Researchers</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Easy survey publishing and management</li>
                        <li>Access to diverse participant pools</li>
                        <li>Analytics and participation tracking</li>
                        <li>Increased visibility for your research</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-lavender/50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-indigo mb-2">For Participants</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Discover surveys aligned with your interests</li>
                        <li>Filter by category, time commitment, and more</li>
                        <li>Contribute to meaningful research</li>
                        <li>Simple and streamlined participation process</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-indigo mb-4">Our Values</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-indigo mb-2">Accessibility</h3>
                    <p className="text-gray-700">
                      Making research participation accessible to everyone, regardless of background or location.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-indigo mb-2">Quality</h3>
                    <p className="text-gray-700">
                      Promoting high-quality research by connecting researchers with engaged participants.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-indigo mb-2">Community</h3>
                    <p className="text-gray-700">
                      Building a collaborative community that values knowledge sharing and diverse perspectives.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div>
              <Card className="border-lavender/50 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-indigo mb-4">Creator</h2>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-indigo/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo">BD</span>
                    </div>
                    <h3 className="text-lg font-bold text-indigo">B K Danush</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Mail className="h-5 w-5 text-indigo mr-2" />
                      <a href="mailto:danushbk16@gmail.com" className="text-indigo hover:underline">
                        danushbk16@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="mt-12 py-12 border-t">
            <h2 className="text-2xl font-bold text-indigo mb-6 text-center">Get Started Today</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-indigo font-medium" asChild>
                <Link href="/surveys">Browse Surveys</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-indigo text-indigo hover:bg-indigo/10" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
