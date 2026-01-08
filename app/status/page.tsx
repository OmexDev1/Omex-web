import type { Metadata } from "next"
import StatusClient from "./StatusClient"

export const metadata: Metadata = {
  title: "Status - Omex",
  description: "Check the current status of Omex bot",
}

export const dynamic = "force-dynamic"

async function getStatus() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/status`, {
      headers: {
        "x-internal-key": process.env.INTERNAL_API_KEY!,
      },
      cache: "no-store",
    })

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function StatusPage() {
  const data = await getStatus()
  return <StatusClient initialData={data} />
}
