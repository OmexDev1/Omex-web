"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I invite Omex to my server?",
    answer:
      "Click the 'Invite Bot' button on our homepage, select your server from the dropdown, and authorize the required permissions. Omex will be added to your server instantly.",
  },
  {
    question: "Is Omex free to use?",
    answer:
      "Yes, Omex is completely free to use with all core features available. We may offer premium features in the future, but the essential functionality will always remain free.",
  },
  {
    question: "How do I set up moderation features?",
    answer:
      "After inviting Omex, use the !setup command to configure moderation settings. You can customize auto-moderation rules, set up logging channels, and configure role permissions through our intuitive setup process.",
  },
  {
    question: "What permissions does Omex need?",
    answer:
      "Omex requires standard permissions including Send Messages, Manage Messages, Kick Members, Ban Members, and Manage Roles to function properly. These permissions ensure all features work as intended.",
  },
  {
    question: "How do I change the command prefix?",
    answer:
      "Use the !prefix command followed by your desired prefix. For example: !prefix ? will change the prefix to '?'. Server administrators can change the prefix at any time.",
  },
  {
    question: "Does Omex support multiple languages?",
    answer:
      "Currently, Omex primarily supports English. We're working on adding multi-language support in future updates. Stay tuned to our updates page for announcements.",
  },
  {
    question: "How can I report bugs or suggest features?",
    answer:
      "Join our Support Server and use the feedback channels to report bugs or suggest new features. Our team actively monitors these channels and values community input.",
  },
  {
    question: "What should I do if Omex is offline?",
    answer:
      "Check our Status page for real-time uptime information. If there's a known issue, it will be displayed there. You can also join our Support Server for updates and announcements.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">Find answers to common questions about Omex</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:bg-card"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors"
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="border-t border-border/40 px-6 pb-6 pt-4">
                    <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="https://discord.gg/omex" className="text-primary hover:underline">
              Join our Support Server
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
