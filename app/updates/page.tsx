import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Updates - Omex",
  description: "View the latest updates and changelog for Omex bot",
}

const updates = [
  {
    id: 1,
    title: "New commands added",
    description:
      "...",
    date: "15/12/2025",
    type: "Fix" as const,
  },
]

const typeColors = {
  Update: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Fix: "bg-red-500/10 text-red-500 border-red-500/20",
  Improvement: "bg-green-500/10 text-green-500 border-green-500/20",
}

export default function UpdatesPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Updates & Changelog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Stay up to date with the latest features, improvements, and bug fixes
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update) => (
            <Card
              key={update.id}
              className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Badge className={typeColors[update.type]}>{update.type}</Badge>
                  <span className="text-sm text-muted-foreground">{update.date}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold">{update.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{update.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
