import { toNextJsHandler } from "better-auth/next-js";

import { publicAuthErrorMessage } from "@/lib/auth-runtime";

export const runtime = "nodejs";

async function handleAuth(request: Request) {
  try {
    const { auth } = await import("@/lib/auth");
    const handlers = toNextJsHandler(auth);
    const response =
      request.method === "GET"
        ? await handlers.GET(request)
        : await handlers.POST(request);

    return response;
  } catch (error) {
    console.error("[auth] Unhandled auth route error", error);
    return Response.json(
      { message: publicAuthErrorMessage(error) },
      { status: 500 },
    );
  }
}

export function GET(request: Request) {
  return handleAuth(request);
}

export function POST(request: Request) {
  return handleAuth(request);
}
