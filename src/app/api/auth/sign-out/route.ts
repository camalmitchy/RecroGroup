import { auth } from "@/lib/auth";
import { forwardAuthResponse } from "@/lib/forward-auth-response";

export async function POST(request: Request) {
  const authResponse = await auth.api.signOut({
    headers: request.headers,
    asResponse: true,
  });

  return forwardAuthResponse(authResponse);
}
