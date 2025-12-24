"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, ChevronLeft, ChevronRight, Smile, Zap, Shield, ShieldAlert, Sparkles, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import commandsData from "@/data/commands.json"

interface Command {
  name: string
  description: string
  category: string
  prefix: string
  arguments: string
  permissions: string
  usage: string
  aliases?: string[]
}

const commands: Command[] = commandsData

const categories = ["All", "Moderation", "antinuke", "Fun", "Prefix"] as const
type Category = (typeof categories)[number]

const categoryIcons: Record<Category, React.ReactNode> = {
  All: <Sparkles className="h-4 w-4" />,
  Moderation: <Shield className="h-4 w-4" />,
  antinuke: <ShieldAlert className="h-4 w-4" />,
  Fun: <Smile className="h-4 w-4" />,
  Prefix: <Zap className="h-4 w-4" />,
}

function normalizeAliases(input: unknown): string[] {
  if (!input) return []
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

function isNonePermission(p?: string) {
  const v = (p ?? "").trim().toLowerCase()
  return v === "" || v === "none" || v === "n/a" || v === "no" || v === "everyone"
}

function PermissionBadge({ value }: { value: string }) {
  // Only use this component when value is NOT "none"
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-200">
      <Lock className="h-3.5 w-3.5" />
      {value}
    </span>
  )
}

export function CommandsList() {
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category>("All")

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = 200
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  // Count commands per category (full list, not filtered)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of categories) counts[c] = 0

    for (const cmd of commands) {
      const c = cmd.category || "Uncategorized"
      counts[c] = (counts[c] ?? 0) + 1
      counts.All += 1
    }

    return counts as Record<Category | string, number>
  }, [])

  const filteredCommands = useMemo(() => {
    const q = search.toLowerCase().trim()

    return commands.filter((cmd) => {
      const cmdAliases = normalizeAliases(cmd.aliases)

      const matchesSearch =
        cmd.name.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmdAliases.some((a) => a.toLowerCase().includes(q))

      const matchesCategory = selectedCategory === "All" || cmd.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  // Name pill (no prefix, no metallic code look)
  const CommandPill = ({ name }: { name: string }) => (
    <span className="inline-flex items-center rounded-md bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground sm:text-base">
      {name}
    </span>
  )

  return (
    <>
      <div className="mt-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight transition-all hover:text-primary sm:text-4xl">Commands</h1>

          <div className="group relative w-full transition-all focus-within:scale-105 sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full border-border/40 bg-card/50 pl-10 backdrop-blur transition-all focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="relative mb-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/40 bg-card/50 p-3 backdrop-blur">
            <div className="relative flex items-center gap-2">
              {canScrollLeft && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -left-1 z-10 h-8 w-8 shrink-0 rounded-full bg-background/80 shadow-md backdrop-blur transition-all hover:scale-110"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="no-scrollbar flex gap-2 overflow-x-auto px-8 sm:justify-center sm:px-0"
              >
                {categories.map((category) => {
                  const count = categoryCounts[category] ?? 0
                  const isActive = selectedCategory === category

                  return (
                    <Button
                      key={category}
                      variant={isActive ? "default" : "ghost"}
                      className="shrink-0 gap-2 rounded-full transition-all hover:scale-105"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {categoryIcons[category]}
                      <span>{category}</span>
                      <span
                        className={[
                          "ml-1 inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
                          isActive ? "bg-background/20 text-background" : "bg-muted/50 text-muted-foreground",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    </Button>
                  )
                })}
              </div>

              {canScrollRight && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-1 z-10 h-8 w-8 shrink-0 rounded-full bg-background/80 shadow-md backdrop-blur transition-all hover:scale-110"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Commands list */}
        <div className="grid gap-3 sm:grid-cols-1 md:gap-4">
          {filteredCommands.map((command, index) => {
            const aliases = normalizeAliases(command.aliases)
            const showPerms = !isNonePermission(command.permissions)

            return (
              <Card
                key={`${command.category}:${command.name}`}
                className="group cursor-pointer border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/10"
                onClick={() => setSelectedCommand(command)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg">
                        <CommandPill name={command.name} />
                      </CardTitle>

                      <CardDescription className="mt-2 leading-relaxed transition-colors group-hover:text-foreground/80">
                        {command.description}
                      </CardDescription>

                      {/* ✅ Permission badge moved under description + hidden when "None" */}
                      {showPerms && (
                        <div className="mt-3">
                          <PermissionBadge value={command.permissions} />
                        </div>
                      )}

                      {aliases.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground">Aliases:</span>
                          {aliases.slice(0, 6).map((a) => (
                            <span
                              key={a}
                              className="rounded-md bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {a}
                            </span>
                          ))}
                          {aliases.length > 6 && (
                            <span className="text-xs text-muted-foreground">+{aliases.length - 6} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <Badge variant="secondary" className="w-fit transition-all group-hover:scale-105">
                      {command.category}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {filteredCommands.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No commands found matching your search.</p>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedCommand} onOpenChange={() => setSelectedCommand(null)}>
        <DialogContent className="animate-in zoom-in-95 border-border/40 bg-card/95 backdrop-blur-xl duration-300 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-1 text-sm font-medium text-foreground">
                {selectedCommand?.name}
              </span>
            </DialogTitle>

            <DialogDescription className="mt-3 leading-relaxed">{selectedCommand?.description}</DialogDescription>

            {/* ✅ Permission badge under description + hidden when "None" */}
            {selectedCommand && !isNonePermission(selectedCommand.permissions) && (
              <div className="mt-3">
                <PermissionBadge value={selectedCommand.permissions} />
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {selectedCommand && normalizeAliases(selectedCommand.aliases).length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold">Aliases</h4>
                <div className="flex flex-wrap gap-2">
                  {normalizeAliases(selectedCommand.aliases).map((a) => (
                    <span key={a} className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="mb-2 font-semibold">Usage</h4>
              <code className="block rounded-lg bg-muted/50 p-3 font-mono text-sm">{selectedCommand?.usage}</code>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 font-semibold">Category</h4>
                <Badge variant="secondary">{selectedCommand?.category}</Badge>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Arguments</h4>
                <p className="text-sm text-muted-foreground">{selectedCommand?.arguments}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
