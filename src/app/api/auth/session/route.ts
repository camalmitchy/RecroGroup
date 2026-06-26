import { auth } from "@/lib/auth";
import { forwardAuthResponse } from "@/lib/forward-auth-response";

export async function GET(request: Request) {
  const authResponse = await auth.api.getSession({
    headers: request.headers,
    asResponse: true,
  });

  return forwardAuthResponse(authResponse);
}
