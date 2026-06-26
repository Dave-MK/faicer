import { NextResponse } from "next/server";
import { getRecentNotifications } from "@/lib/notifications";

// Reads session-scoped activity; never statically cache.
export const dynamic = "force-dynamic";

export async function GET() {
  const notifications = await getRecentNotifications();
  return NextResponse.json({ notifications });
}
