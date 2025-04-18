import { NavBar } from "@/components/layout/nav-bar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="bg-indigo text-white py-12">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-lavender max-w-2xl">Have questions or feedback? We'd love to hear from you.</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-indigo mb-6">Get In Touch</h2>
              <p className="text-gray-700 mb-8">
                If you have any questions about The Survey Collective, feedback on how we can improve, or if you're
                interested in collaborating, please don't hesitate to reach out.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-indigo mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-indigo">Email</h3>
                    <p className="text-gray-700">
                      <a href="mailto:danushbk16@gmail.com" className="hover:underline">
                        danushbk16@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-indigo mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-indigo">Phone</h3>
                    <p className="text-gray-700">Available upon request</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-indigo mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-indigo">Location</h3>
                    <p className="text-gray-700">Remote / Online</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="border-lavender/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Message subject" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message" rows={5} />
                    </div>
                    <Button type="submit" className="w-full bg-indigo hover:bg-indigo/90 text-white">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
