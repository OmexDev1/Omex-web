export const runtime = "nodejs";

const serverStartedAt = Date.now();

export async function GET() {
  return Response.json({
    serverStartedAt,
    now: Date.now(),
  });
}
