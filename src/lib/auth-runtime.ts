function hasDatabaseUrl() {
  return Boolean(
    process.env.DATABASE_URL?.trim() ||
      process.env.POSTGRES_PRISMA_URL?.trim() ||
      process.env.POSTGRES_URL?.trim() ||
      process.env.POSTGRES_URL_NON_POOLING?.trim(),
  );
}

function hasAuthSecret() {
  return Boolean(
    process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim(),
  );
}

export function missingAuthEnvVars() {
  const missing: string[] = [];
  if (!hasDatabaseUrl()) missing.push("DATABASE_URL");
  if (!hasAuthSecret()) missing.push("BETTER_AUTH_SECRET");
  return missing;
}

export function authConfigErrorMessage() {
  const missing = missingAuthEnvVars();
  if (missing.length === 0) return null;

  return `Authentication is not configured. Set ${missing.join(" and ")} in Vercel → Settings → Environment Variables for Production, then redeploy.`;
}

export function publicAuthErrorMessage(error: unknown) {
  const configured = authConfigErrorMessage();
  if (configured) return configured;

  const text =
    error instanceof Error ? `${error.name} ${error.message}` : String(error);

  if (/DATABASE_URL/i.test(text)) {
    return "DATABASE_URL is missing or invalid. Use a hosted Postgres URL with sslmode=require on Vercel, not localhost.";
  }

  if (/BETTER_AUTH_SECRET/i.test(text) || /default secret/i.test(text)) {
    return "BETTER_AUTH_SECRET is missing. Add a secret of at least 32 characters in Vercel, then redeploy.";
  }

  if (
    /can't reach database|ECONNREFUSED|ENOTFOUND|P1001|P1017|timeout/i.test(
      text,
    )
  ) {
    return "Cannot reach the database. Check DATABASE_URL on Vercel (hosted Postgres, sslmode=require, not localhost).";
  }

  if (/does not exist in the database|P2021|P2010/i.test(text)) {
    return "The database schema is missing. Run `npx prisma migrate deploy` against the production database.";
  }

  return "Authentication is unavailable. Check the Vercel function logs for this request.";
}
