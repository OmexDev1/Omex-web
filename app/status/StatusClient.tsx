"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Activity, Clock, Search, Server, Users, Zap } from "lucide-react"

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

interface StatusCardProps {
  title: string
  value: string
  icon: React.ReactNode
  status?: "online" | "warning" | "offline"
}

function StatusCard({ title, value, icon, status = "online" }: StatusCardProps) {
  const statusColors = {
    online: "bg-green-500",
    warning: "bg-yellow-500",
    offline: "bg-red-500",
  } as const

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default function StatusClient() {
  // Static/fake shard data for now (you can replace later with real fetch)
  const shards = [
    { id: 0, status: "online", uptime: "—", latency: "32ms", servers: 1245, users: 523891 },
    { id: 1, status: "online", uptime: "—", latency: "28ms", servers: 1189, users: 498234 },
    { id: 2, status: "online", uptime: "—", latency: "35ms", servers: 1312, users: 556782 },
    { id: 3, status: "online", uptime: "—", latency: "29ms", servers: 1098, users: 472019 },
  ] as const

  const totalServers = useMemo(() => shards.reduce((acc, s) => acc + s.servers, 0), [shards])
  const totalUsers = useMemo(() => shards.reduce((acc, s) => acc + s.users, 0), [shards])

  const avgLatency = useMemo(() => {
    const ms = shards.map((s) => parseInt(s.latency.replace("ms", ""), 10))
    return Math.round(ms.reduce((a, b) => a + b, 0) / ms.length)
  }, [shards])

  // ✅ server-based uptime
  const [serverStartedAt, setServerStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/status", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch /api/status")
        const data: { serverStartedAt: number } = await res.json()
        if (!cancelled) setServerStartedAt(data.serverStartedAt)
      } catch {
        if (!cancelled) setServerStartedAt(null)
      }
    }

    load()

    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  const uptimeLabel = serverStartedAt == null ? "—" : formatDuration(now - serverStartedAt)

  // ✅ Shard search
  const [query, setQuery] = useState("")
  const filteredShards = useMemo(() => {
    const q = query.trim()
    if (!q) return shards

    // allow searching by: "2", "shard 2", "#2"
    const match = q.match(/\d+/)
    if (!match) return []

    const id = Number.parseInt(match[0], 10)
    if (Number.isNaN(id)) return []

    return shards.filter((s) => s.id === id)
  }, [query, shards])

  const resultsLabel = useMemo(() => {
    if (!query.trim()) return `Showing all shards (${shards.length})`
    return filteredShards.length
      ? `Found ${filteredShards.length} shard`
      : "No shard found for that ID"
  }, [query, filteredShards.length, shards.length])

  return (
    <main className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            <Badge variant="secondary" className="text-sm sm:text-base">
              All Systems Operational
            </Badge>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Bot Status
          </h1>

          <p className="mx-auto mt-3 max-w-2xl px-4 text-pretty text-base text-muted-foreground sm:mt-4 sm:text-lg">
            Real-time monitoring of Omex bot performance across all shards
          </p>
        </div>

        {/* Overview Cards */}
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <StatusCard
            title="Total Servers"
            value={totalServers.toLocaleString()}
            icon={<Server className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status="online"
          />
          <StatusCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={<Users className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status="online"
          />
          <StatusCard
            title="Average Latency"
            value={`${avgLatency}ms`}
            icon={<Zap className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status="online"
          />
          <StatusCard
            title="Uptime"
            value={uptimeLabel}
            icon={<Clock className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status={serverStartedAt ? "online" : "warning"}
          />
        </div>

        {/* Shard Status Header + Search */}
        <div className="mt-12 sm:mt-16">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Shard Status</h2>
              <p className="mt-1 text-sm text-muted-foreground">{resultsLabel}</p>
            </div>

            <div className="w-full sm:w-80">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your Shard ID"
                  className="pl-9"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          {/* Shard Cards */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {filteredShards.map((shard) => (
              <Card key={shard.id} className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                      Shard {shard.id}
                    </CardTitle>

                    <Badge
                      variant={shard.status === "online" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {shard.status === "online" ? (
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Online
                        </span>
                      ) : (
                        "Offline"
                      )}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">Uptime</p>
                      <p className="mt-1 font-mono text-base font-semibold sm:text-lg">{uptimeLabel}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">Latency</p>
                      <p className="mt-1 font-mono text-base font-semibold sm:text-lg">{shard.latency}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">Servers</p>
                      <p className="mt-1 font-mono text-base font-semibold sm:text-lg">
                        {shard.servers.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">Users</p>
                      <p className="mt-1 font-mono text-base font-semibold sm:text-lg">
                        {shard.users.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredShards.length === 0 && (
              <Card className="border-border/40 bg-card/50 backdrop-blur lg:col-span-2">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No shards match that ID. Try searching for{" "}
                    <span className="font-mono text-foreground">0</span>–
                    <span className="font-mono text-foreground">{shards.length - 1}</span>.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
