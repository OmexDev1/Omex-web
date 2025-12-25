"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Activity, Clock, Search, Server, WifiOff, Zap } from "lucide-react"

function formatDurationFromSeconds(seconds: number) {
  const totalSeconds = Math.max(0, Math.floor(seconds))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

interface StatusCardProps {
  title: string
  value: string
  icon: ReactNode
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

type ApiStatus = {
  ok: boolean
  online: boolean
  started_at: string | null
  uptime_seconds: number
  shard_count: number
  shards: Array<{ id: number; online: boolean; latency_ms: number | null }>
  error?: string
}

export default function StatusClient() {
  const [data, setData] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/status", { cache: "no-store" })
        const json = (await res.json()) as ApiStatus
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) {
          setData({
            ok: false,
            online: false,
            started_at: null,
            uptime_seconds: 0,
            shard_count: 0,
            shards: [],
            error: "Failed to load status",
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const t = setInterval(load, 10_000)

    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  const shards = data?.shards ?? []
  const isOnline = Boolean(data?.online)

  const shardsUp = useMemo(() => shards.filter((s) => s.online).length, [shards])
  const shardTotal = useMemo(
    () => (data?.shard_count ? data.shard_count : shards.length),
    [data?.shard_count, shards.length]
  )

  const avgLatency = useMemo(() => {
    const ms = shards.map((s) => s.latency_ms).filter((v): v is number => typeof v === "number" && Number.isFinite(v))
    if (!ms.length) return null
    return Math.round(ms.reduce((a, b) => a + b, 0) / ms.length)
  }, [shards])

  const uptimeLabel = useMemo(() => {
    if (!data) return "—"
    return formatDurationFromSeconds(data.uptime_seconds ?? 0)
  }, [data])

  const [query, setQuery] = useState("")
  const filteredShards = useMemo(() => {
    const q = query.trim()
    if (!q) return shards

    const match = q.match(/\d+/)
    if (!match) return []

    const id = Number.parseInt(match[0], 10)
    if (Number.isNaN(id)) return []

    return shards.filter((s) => s.id === id)
  }, [query, shards])

  const resultsLabel = useMemo(() => {
    if (!query.trim()) return `Showing all shards (${shards.length || 0})`
    return filteredShards.length ? `Found ${filteredShards.length} shard` : "No shard found for that ID"
  }, [query, filteredShards.length, shards.length])

  const headerBadge = useMemo(() => {
    if (loading) return { text: "Checking…", variant: "secondary" as const }
    if (isOnline) return { text: "Online", variant: "secondary" as const }
    return { text: "Offline", variant: "destructive" as const }
  }, [loading, isOnline])

  return (
    <main className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} ${
                loading ? "animate-pulse" : ""
              }`}
            />
            <Badge variant={headerBadge.variant} className="text-sm sm:text-base">
              {headerBadge.text}
            </Badge>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Bot Status</h1>

          <p className="mx-auto mt-3 max-w-2xl px-4 text-pretty text-base text-muted-foreground sm:mt-4 sm:text-lg">
            Live uptime + shard status (online/offline + latency)
          </p>

          {!loading && data?.ok === false && data?.error && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">{data.error}</p>
          )}
        </div>

        {/* Overview Cards */}
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <StatusCard
            title="Status"
            value={isOnline ? "Online" : "Offline"}
            icon={
              isOnline ? (
                <Activity className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
              ) : (
                <WifiOff className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
              )
            }
            status={loading ? "warning" : isOnline ? "online" : "offline"}
          />

          <StatusCard
            title="Uptime"
            value={uptimeLabel}
            icon={<Clock className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status={loading ? "warning" : isOnline ? "online" : "offline"}
          />

          <StatusCard
            title="Shards Up"
            value={`${shardsUp}/${shardTotal || 0}`}
            icon={<Server className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status={loading ? "warning" : shardsUp === shardTotal && shardTotal > 0 ? "online" : "warning"}
          />

          <StatusCard
            title="Average Latency"
            value={avgLatency == null ? "—" : `${avgLatency}ms`}
            icon={<Zap className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />}
            status={loading ? "warning" : avgLatency == null ? "warning" : "online"}
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

                    <Badge variant={shard.online ? "default" : "destructive"} className="text-xs">
                      {shard.online ? (
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
                      <p className="text-xs text-muted-foreground sm:text-sm">Latency</p>
                      <p className="mt-1 font-mono text-base font-semibold sm:text-lg">
                        {shard.latency_ms == null ? "—" : `${shard.latency_ms}ms`}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground sm:text-sm">State</p>
                      <p className="mt-1 font-mono text-base font-semibold sm:text-lg">
                        {shard.online ? "ONLINE" : "OFFLINE"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredShards.length === 0 && (
              <Card className="border-border/40 bg-card/50 backdrop-blur lg:col-span-2">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">No shards match that ID.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
