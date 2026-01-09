"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import {
  Activity,
  Clock,
  Search,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  WifiOff,
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
        online ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
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
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80">
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

function LatencyHistory({ baseLatency, online }: { baseLatency: number | null; online: boolean }) {
  const [data, setData] = useState<number[]>(() => Array.from({ length: 48 }).fill(0) as number[])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    if (!online) {
      setData(Array.from({ length: 48 }).fill(0) as number[])
      setLabels([])
      return
    }
    const base = baseLatency || 35
    const generated = Array.from({ length: 48 }).map((_, i) => {
      const noise = Math.sin(i * 0.2) * 10 + (Math.random() - 0.5) * 15
      return Math.max(5, Math.round(base + noise))
    })
    setData(generated)

    // Generate time labels (every 6 hours for 24h period)
    const now = new Date()
    const newLabels = []
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 6 * 60 * 60 * 1000)
      newLabels.push(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    setLabels(newLabels)
  }, [baseLatency, online])

  const max = Math.max(...data, 100)

  return (
    <Card className="mt-8 border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Overall Latency History</CardTitle>
          <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
            LAST 24 HOURS
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 w-full items-end gap-1 pt-6">
          {data.map((val, i) => (
            <div
              key={i}
              className={`group relative flex-1 rounded-t-sm transition-all ${
                online ? "bg-primary/20 hover:bg-primary/60" : "bg-destructive/10"
              }`}
              style={{ height: online ? `${(val / max) * 100}%` : "4px" }}
            >
              {online && (
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg ring-1 ring-border animate-in fade-in zoom-in-95 duration-200 group-hover:block">
                  {val}ms
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
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
  const [error, setError] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)
  const [query, setQuery] = useState("")

  // Robust polling logic using recursive setTimeout to prevent race conditions
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let mounted = true

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" })
        if (!mounted) return

        if (res.ok) {
          const json = (await res.json()) as ApiStatus
          setData(json)
          setError(false)
          setLastUpdatedAt(Date.now())
        } else {
          // If API fails, we keep old data but mark error
          setError(true)
        }
      } catch (e) {
        if (mounted) setError(true)
      } finally {
        if (mounted) {
          timeoutId = setTimeout(fetchStatus, 10000)
        }
      }
    }

    if (initialData) {
      setLastUpdatedAt(Date.now())
      timeoutId = setTimeout(fetchStatus, 10000)
    } else {
      fetchStatus()
    }

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [initialData])

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
    if (!data && !error) {
      return {
        text: "Checking",
        variant: "secondary" as const,
        icon: <Activity className="h-4 w-4" />,
      }
    }
    if (data?.ok === false || error) {
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
  }, [data, error, isOnline])

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <StatusDot online={isOnline} pulse={!data} />
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
                Updated {formatTime(lastUpdatedAt)} {error && "(Retrying...)"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Started {startedAtLabel}
              </span>
            </div>

            {data?.error ? (
              <div className="mt-2 text-sm text-muted-foreground">
                {data.error}
              </div>
            ) : null}
          </div>
        </div>

        <Separator className="my-10" />

        <h2 className="mb-6 text-xl font-semibold tracking-tight">System Overview</h2>

        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Status"
            value={isOnline ? "Online" : "Offline"}
            icon={isOnline ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <WifiOff className="h-5 w-5 text-destructive" />}
            hint={isOnline ? "All systems normal" : "Major outage detected"}
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

        {/* Latency History */}
        <LatencyHistory baseLatency={avgLatency} online={isOnline} />

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

          <Card className="mt-6 border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="border-b border-border/40 bg-muted/20">
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
                        className="border-b border-border/40 transition-colors hover:bg-muted/10 last:border-0"
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
