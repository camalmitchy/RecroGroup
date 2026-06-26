import { NextResponse } from "next/server";

export async function forwardAuthResponse(authResponse: Response) {
  const text = await authResponse.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Request failed" };
  }

  const response = NextResponse.json(data, { status: authResponse.status });

  if (typeof authResponse.headers.getSetCookie === "function") {
    for (const cookie of authResponse.headers.getSetCookie()) {
      response.headers.append("set-cookie", cookie);
    }
  } else {
    const setCookie = authResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
  }

  return response;
}

export function validationErrorResponse(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}) {
  return NextResponse.json(
    {
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
}
