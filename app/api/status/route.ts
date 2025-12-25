export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type BotStatusPayload = {
  online: boolean
  started_at: string | null
  uptime_seconds: number
  shard_count: number
  shards: Array<{ id: number; online: boolean; latency_ms: number | null }>
}

export async function GET() {
  const url = process.env.BOT_STATUS_URL
  const token = process.env.BOT_STATUS_TOKEN // <-- add this to your .env (server-only)

  if (!url) {
    return Response.json(
      {
        ok: false,
        online: false,
        started_at: null,
        uptime_seconds: 0,
        shard_count: 0,
        shards: [],
        error: "BOT_STATUS_URL is not set",
      },
      { status: 500 }
    )
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)

    const headers: Record<string, string> = {
      accept: "application/json",
    }

    // Forward Bearer token to your bot status API (keeps token off the client)
    if (token && token.trim().length > 0) {
      headers.authorization = `Bearer ${token.trim()}`
    }

    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return Response.json(
        {
          ok: false,
          online: false,
          started_at: null,
          uptime_seconds: 0,
          shard_count: 0,
          shards: [],
          error: `Upstream returned ${res.status}`,
        },
        { status: 502 }
      )
    }

    const json = (await res.json()) as BotStatusPayload

    return Response.json({
      ok: true,
      online: Boolean(json.online),
      started_at: json.started_at ?? null,
      uptime_seconds: Number(json.uptime_seconds ?? 0),
      shard_count: Number(json.shard_count ?? (json.shards?.length ?? 0)),
      shards: Array.isArray(json.shards) ? json.shards : [],
    })
  } catch (e) {
    return Response.json(
      {
        ok: false,
        online: false,
        started_at: null,
        uptime_seconds: 0,
        shard_count: 0,
        shards: [],
        error: e instanceof Error ? e.message : "Failed to reach status server",
      },
      { status: 502 }
    )
  }
}
