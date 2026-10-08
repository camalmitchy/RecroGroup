export function paymentStatusPath(
  reference: string,
  accessToken?: string | null,
) {
  const path = `/api/payments/status/${encodeURIComponent(reference)}`;
  if (!accessToken) return path;
  return `${path}?token=${encodeURIComponent(accessToken)}`;
}

export function paymentPagePath(
  reference: string,
  accessToken?: string | null,
) {
  const path = `/payments/${encodeURIComponent(reference)}`;
  if (!accessToken) return path;
  return `${path}?token=${encodeURIComponent(accessToken)}`;
}
