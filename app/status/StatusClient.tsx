"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  Activity,
  Clock,
  Search,
  Server,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"

type ApiStatus = {
  ok: boolean
  online: boolean
  started_at: string | null
  uptime_seconds: number
  shard_count: number
  shards: Array<{ id: number; online: boolean; latency_ms: number | null }>
  error?: string
}

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

function formatTime(ts: number | null) {
  if (!ts) return "—"
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatStartedAt(iso: string | null) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString([], {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch {
    return iso
  }
}

function StatusDot({ online, pulse }: { online: boolean; pulse?: boolean }) {
  return (
    <span
      className={[
        "h-3 w-3 rounded-full",
        online ? "bg-green-500" : "bg-red-500",
        pulse ? "animate-pulse" : "",
      ].join(" ")}
    />
  )
}

function MetricCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string
  value: string
  icon: ReactNode
  hint?: string
}) {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {hint ? (
          <div className="mt-2 text-sm text-muted-foreground">{hint}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default function StatusClient({
  initialData,
}: {
  initialData: ApiStatus | null
}) {
  const [data, setData] = useState<ApiStatus | null>(initialData ?? null)
  const [loading, setLoading] = useState(!initialData)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(
    initialData ? Date.now() : null
  )
  const [query, setQuery] = useState("")

  const abortRef = useRef<AbortController | null>(null)

  async function load(mode: "initial" | "refresh" = "refresh") {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      if (mode === "initial") setLoading(true)
      if (mode === "refresh") setRefreshing(true)

      const res = await fetch("/api/status", {
        cache: "no-store",
        signal: controller.signal,
      })

      // If middleware redirects to "/", this might return HTML.
      // Try to parse JSON safely.
      const contentType = res.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        throw new Error(`Non-JSON response (${res.status})`)
      }

      const json = (await res.json()) as ApiStatus
      setData(json)
      setLastUpdatedAt(Date.now())
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return

      setData({
        ok: false,
        online: false,
        started_at: null,
        uptime_seconds: 0,
        shard_count: 0,
        shards: [],
        error: "Failed to load status",
      })
      setLastUpdatedAt(Date.now())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    // if we already have initialData, we can immediately start refresh interval
    if (!initialData) {
      load("initial")
    }
    const t = setInterval(() => load("refresh"), 10_000)
    return () => {
      clearInterval(t)
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shards = data?.shards ?? []
  const isOnline = Boolean(data?.online)

  const shardTotal = useMemo(
    () => (data?.shard_count ? data.shard_count : shards.length),
    [data?.shard_count, shards.length]
  )

  const shardsUp = useMemo(() => shards.filter((s) => s.online).length, [shards])

  const shardsDown = useMemo(
    () => Math.max(0, (shardTotal || shards.length) - shardsUp),
    [shardTotal, shards.length, shardsUp]
  )

  const avgLatency = useMemo(() => {
    const ms = shards
      .map((s) => s.latency_ms)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
    if (!ms.length) return null
    return Math.round(ms.reduce((a, b) => a + b, 0) / ms.length)
  }, [shards])

  const p95Latency = useMemo(() => {
    const ms = shards
      .map((s) => s.latency_ms)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
      .sort((a, b) => a - b)
    if (!ms.length) return null
    const idx = Math.floor(0.95 * (ms.length - 1))
    return ms[idx]
  }, [shards])

  const uptimeLabel = useMemo(
    () => (data ? formatDurationFromSeconds(data.uptime_seconds ?? 0) : "—"),
    [data]
  )

  const startedAtLabel = useMemo(
    () => formatStartedAt(data?.started_at ?? null),
    [data?.started_at]
  )

  const filteredShards = useMemo(() => {
    let list = shards
    const q = query.trim()
    if (q) {
      const match = q.match(/\d+/)
      if (!match) return []
      const id = Number.parseInt(match[0], 10)
      if (Number.isNaN(id)) return []
      list = list.filter((s) => s.id === id)
    }
    return [...list].sort((a, b) => {
      if (a.online !== b.online) return a.online ? 1 : -1
      return a.id - b.id
    })
  }, [query, shards])

  const headerBadge = useMemo(() => {
    if (loading) {
      return {
        text: "Checking",
        variant: "secondary" as const,
        icon: <Activity className="h-4 w-4" />,
      }
    }
    if (data?.ok === false) {
      return {
        text: "Degraded",
        variant: "destructive" as const,
        icon: <AlertTriangle className="h-4 w-4" />,
      }
    }
    return isOnline
      ? {
          text: "Online",
          variant: "secondary" as const,
          icon: <CheckCircle2 className="h-4 w-4" />,
        }
      : {
          text: "Offline",
          variant: "destructive" as const,
          icon: <XCircle className="h-4 w-4" />,
        }
  }, [loading, data?.ok, isOnline])

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <StatusDot online={isOnline} pulse={loading || refreshing} />
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Omex
              </h1>
              <Badge
                variant={headerBadge.variant}
                className="inline-flex items-center gap-2 text-sm"
              >
                {headerBadge.icon}
                {headerBadge.text}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Updated {formatTime(lastUpdatedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Started {startedAtLabel}
              </span>
            </div>

            {data?.ok === false && data?.error ? (
              <div className="mt-2 text-sm text-muted-foreground">
                {data.error}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => load("refresh")}
              disabled={loading || refreshing}
              className="h-11 gap-2 px-4"
            >
              <RefreshCw
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Separator className="my-10" />

        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Status"
            value={isOnline ? "Online" : "Offline"}
            icon={<CheckCircle2 className="h-5 w-5" />}
            hint={data?.ok === false ? "API reported an issue" : "Live"}
          />

          <MetricCard
            title="Uptime"
            value={uptimeLabel}
            icon={<Clock className="h-5 w-5" />}
            hint={data?.started_at ? `Started ${startedAtLabel}` : "—"}
          />

          <MetricCard
            title="Shards"
            value={`${shardsUp}/${shardTotal || 0}`}
            icon={<Server className="h-5 w-5" />}
            hint={shardsDown > 0 ? `${shardsDown} offline` : "All online"}
          />

          <MetricCard
            title="Latency"
            value={avgLatency == null ? "—" : `${avgLatency}ms`}
            icon={<Zap className="h-5 w-5" />}
            hint={p95Latency == null ? "—" : `p95 ${p95Latency}ms`}
          />
        </div>

        {/* Shards */}
        <div className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Shards</h2>
              <p className="mt-1 text-base text-muted-foreground">
                Showing {filteredShards.length} of {shards.length || 0}
              </p>
            </div>

            <div className="w-full sm:w-80">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by shard ID"
                  className="h-11 pl-10 text-base"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <Card className="mt-6 border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="border-b border-border/60 bg-muted/30">
                    <tr className="text-left">
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Shard
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        Latency
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredShards.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="px-5 py-4 font-medium">#{s.id}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-3">
                            <StatusDot online={s.online} />
                            <span className="font-medium">
                              {s.online ? "Online" : "Offline"}
                            </span>
                            <Badge
                              variant={s.online ? "secondary" : "destructive"}
                              className="ml-1"
                            >
                              {s.online ? "UP" : "DOWN"}
                            </Badge>
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono">
                          {s.latency_ms == null ? "—" : `${s.latency_ms}ms`}
                        </td>
                      </tr>
                    ))}

                    {filteredShards.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-5 py-12 text-center text-muted-foreground"
                        >
                          No shards match your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
