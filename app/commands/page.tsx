import type { Metadata } from "next"
import { CommandsList } from "@/components/commands-list"

export const metadata: Metadata = {
  title: "Commands - Omex",
  description: "Browse all available Omex bot commands",
}

export default function CommandsPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Omex Commands</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Explore all available commands to unlock the full potential of Omex
          </p>
        </div>
        <CommandsList />
      </div>
    </main>
  )
}
