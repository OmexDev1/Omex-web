export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type BotStatusPayload = {
  online: boolean
  started_at: string | null
  uptime_seconds: number
  shard_count: number
  shards: Array<{ id: number; online: boolean; latency_ms: number | null }>
}

const BOT_NAME = "Omex"

let wasDown = false
let downSinceUnix: number | null = null

function nowUnix(): number {
  return Math.floor(Date.now() / 1000)
}

function safeString(v: unknown): string {
  if (v === null) return "null"
  if (v === undefined) return "undefined"
  if (typeof v === "string") return v.length ? v : "(empty)"
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") return String(v)
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

function chunkFields(
  fields: Array<{ name: string; value: string; inline?: boolean }>,
  maxFields = 25
) {
  const chunks: Array<Array<{ name: string; value: string; inline?: boolean }>> = []
  for (let i = 0; i < fields.length; i += maxFields) {
    chunks.push(fields.slice(i, i + maxFields))
  }
  return chunks
}

function buildEmbeds(params: {
  title: string
  summary: string
  eventUnix: number
  statusData?: BotStatusPayload
  fetchMeta?: {
    url?: string
    httpStatus?: number
    httpOk?: boolean
    errorMessage?: string
    responseMs?: number
  }
  outageMeta?: {
    downSinceUnix?: number | null
    isTransition?: boolean
  }
}) {
  const { title, summary, eventUnix, statusData, fetchMeta, outageMeta } = params


  const fields: Array<{ name: string; value: string; inline?: boolean }> = []


  fields.push({
    name: "Event time",
    value: `<t:${eventUnix}:R>\n<t:${eventUnix}:F>`,
    inline: true,
  })


  if (outageMeta?.downSinceUnix) {
    fields.push({
      name: "Down since",
      value: `<t:${outageMeta.downSinceUnix}:R>\n<t:${outageMeta.downSinceUnix}:F>`,
      inline: true,
    })
  } else {
    fields.push({
      name: "Down since",
      value: "unknown",
      inline: true,
    })
  }

  if (typeof outageMeta?.isTransition === "boolean") {
    fields.push({
      name: "Transition",
      value: outageMeta.isTransition ? "yes" : "no",
      inline: true,
    })
  }


  if (fetchMeta) {
    if (fetchMeta.url) {
      fields.push({ name: "Status URL", value: safeString(fetchMeta.url), inline: false })
    }
    if (typeof fetchMeta.responseMs === "number") {
      fields.push({ name: "Fetch latency (ms)", value: safeString(fetchMeta.responseMs), inline: true })
    }
    if (typeof fetchMeta.httpStatus === "number") {
      fields.push({ name: "HTTP status", value: safeString(fetchMeta.httpStatus), inline: true })
    }
    if (typeof fetchMeta.httpOk === "boolean") {
      fields.push({ name: "HTTP ok", value: safeString(fetchMeta.httpOk), inline: true })
    }
    if (fetchMeta.errorMessage) {
      const msg = fetchMeta.errorMessage.length > 900 ? fetchMeta.errorMessage.slice(0, 900) + "…" : fetchMeta.errorMessage
      fields.push({ name: "Error", value: msg, inline: false })
    }
  }


  if (statusData) {
    fields.push({ name: "Online", value: safeString(statusData.online), inline: true })
    fields.push({ name: "Shard count", value: safeString(statusData.shard_count), inline: true })
    fields.push({ name: "Uptime (seconds)", value: safeString(statusData.uptime_seconds), inline: true })
    fields.push({
      name: "Started at",
      value: statusData.started_at ? `${statusData.started_at}` : "null",
      inline: false,
    })


    const shardLines = statusData.shards
      .slice(0, 50) // avoid absurd size
      .map((s) => `#${s.id}: online=${s.online} latency_ms=${s.latency_ms ?? "null"}`)

    const shardText = shardLines.length ? shardLines.join("\n") : "(none)"
    fields.push({
      name: `Shards (up to ${Math.min(statusData.shards.length, 50)})`,
      value: shardText.length > 1000 ? shardText.slice(0, 1000) + "…" : shardText,
      inline: false,
    })


    const raw = safeString(statusData)
    fields.push({
      name: "Raw payload (trimmed)",
      value: raw.length > 1000 ? raw.slice(0, 1000) + "…" : raw,
      inline: false,
    })
  }


  const fieldChunks = chunkFields(fields, 25)

  return fieldChunks.map((chunk, idx) => ({
    title: idx === 0 ? title : `${title} (continued ${idx + 1})`,
    description: idx === 0 ? summary : undefined,
    fields: chunk,
    timestamp: new Date(eventUnix * 1000).toISOString(),
    footer: { text: "Omex.bot" },
  }))
}

async function sendDiscordWebhook(payload: { embeds: any[] }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch {

  }
}

async function sendDevAlert(params: {
  title: string
  summary: string
  eventUnix: number
  statusData?: BotStatusPayload
  fetchMeta?: {
    url?: string
    httpStatus?: number
    httpOk?: boolean
    errorMessage?: string
    responseMs?: number
  }
  outageMeta?: {
    downSinceUnix?: number | null
    isTransition?: boolean
  }
}) {
  const embeds = buildEmbeds(params)
  await sendDiscordWebhook({ embeds })
}

export async function GET() {
  const url = process.env.BOT_STATUS_URL
  const token = process.env.BOT_STATUS_TOKEN

  if (!url) {
    return Response.json(
      {
        ok: false,
        online: false,
        started_at: null,
        uptime_seconds: 0,
        shard_count: 0,
        shards: [],
        error: "date is not set",
      },
      { status: 500 }
    )
  }

  const startMs = Date.now()

  try {
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const responseMs = Date.now() - startMs

    if (!res.ok) {
      throw new Error(`Status server returned ${res.status}`)
    }

    const data = (await res.json()) as BotStatusPayload
    const isDown = !data.online


    if (isDown && !wasDown) {
      wasDown = true
      downSinceUnix = nowUnix()

      await sendDevAlert({
        title: `${BOT_NAME} offline`,
        summary: `Omex api is offline or Omex is offline`,
        eventUnix: downSinceUnix,
        statusData: data,
        fetchMeta: {
          url,
          httpStatus: res.status,
          httpOk: res.ok,
          responseMs,
        },
        outageMeta: {
          downSinceUnix,
          isTransition: true,
        },
      })
    }


    if (!isDown && wasDown) {
      const upAt = nowUnix()
      const wentDownAt = downSinceUnix

      wasDown = false
      downSinceUnix = null

      await sendDevAlert({
        title: `${BOT_NAME} online`,
        summary: `date info.`,
        eventUnix: upAt,
        statusData: data,
        fetchMeta: {
          url,
          httpStatus: res.status,
          httpOk: res.ok,
          responseMs,
        },
        outageMeta: {
          downSinceUnix: wentDownAt,
          isTransition: true,
        },
      })
    }

    return Response.json({ ok: true, ...data }, { status: 200 })
  } catch (e) {
    const responseMs = Date.now() - startMs


    if (!wasDown) {
      wasDown = true
      downSinceUnix = nowUnix()

      await sendDevAlert({
        title: `${BOT_NAME} offline`,
        summary: `status date could not be fetched`,
        eventUnix: downSinceUnix,
        fetchMeta: {
          url,
          httpStatus: undefined,
          httpOk: false,
          errorMessage: e instanceof Error ? e.message : "Unknown error",
          responseMs,
        },
        outageMeta: {
          downSinceUnix,
          isTransition: true,
        },
      })
    }

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
