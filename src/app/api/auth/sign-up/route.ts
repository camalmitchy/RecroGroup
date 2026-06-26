import { auth } from "@/lib/auth";
import {
  forwardAuthResponse,
  validationErrorResponse,
} from "@/lib/forward-auth-response";
import { signUpSchema } from "@/features/auth/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const { confirmPassword: _confirmPassword, ...signUpBody } = parsed.data;

  const authResponse = await auth.api.signUpEmail({
    body: {
      ...signUpBody,
      accountType: "CUSTOMER",
    },
    headers: request.headers,
    asResponse: true,
  });

  return forwardAuthResponse(authResponse);
}
