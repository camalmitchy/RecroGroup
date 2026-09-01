import { toNextJsHandler } from "better-auth/next-js";

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
      { message: "Authentication is unavailable. Check server logs." },
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
