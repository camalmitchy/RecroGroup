import { auth } from "@/lib/auth";
import {
  forwardAuthResponse,
  validationErrorResponse,
} from "@/lib/forward-auth-response";
import { signInSchema } from "@/features/auth/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const authResponse = await auth.api.signInEmail({
    body: parsed.data,
    headers: request.headers,
    asResponse: true,
  });

  return forwardAuthResponse(authResponse);
}
