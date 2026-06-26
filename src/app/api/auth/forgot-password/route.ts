import { auth } from "@/lib/auth";
import {
  forwardAuthResponse,
  validationErrorResponse,
} from "@/lib/forward-auth-response";
import { forgotPasswordSchema } from "@/features/auth/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const origin = new URL(request.url).origin;

  const authResponse = await auth.api.requestPasswordReset({
    body: {
      email: parsed.data.email,
      redirectTo: `${origin}/reset-password`,
    },
    headers: request.headers,
    asResponse: true,
  });

  return forwardAuthResponse(authResponse);
}
