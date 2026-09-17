import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import type { RouteResult } from "@/lib/controllers/types";

// Every route handler funnels its controller call through this one
// function, so turning a result (or a thrown ApiError) into an actual HTTP
// response happens in exactly one place - route files never construct a
// NextResponse themselves. See docs/Architecture.md §9.
export async function handleRoute(action: () => Promise<RouteResult>): Promise<NextResponse> {
  try {
    const { status, body } = await action();
    return NextResponse.json(body, { status });
  } catch (error) {
    return toErrorResponse(error);
  }
}
