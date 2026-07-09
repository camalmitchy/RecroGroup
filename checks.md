You are auditing this Next.js project for production readiness. Go through EVERY section below. For each check: actually inspect the relevant files or run the relevant command — do not assume or skip based on project type. Report PASS / FAIL / N/A with a one-line reason for each item, and list concrete file paths/line numbers when flagging issues.

## 1. Build & Type Safety
- Run `npm run build` (or yarn/pnpm equivalent) and report any errors or warnings
- If TypeScript is used, run `tsc --noEmit` and list all type errors
- Run the linter (`next lint`) and list all warnings/errors
- Search the codebase for leftover `console.log`, `debugger`, and commented-out code blocks

## 2. Environment & Config
- List all env vars referenced in the code (search for `process.env`)
- Check if there's a `.env.example` and whether it's in sync with actual usage
- Flag any `NEXT_PUBLIC_` variable that looks like it could contain a secret (API keys, tokens, DB URLs)
- Review `next.config.js`/`next.config.ts` for production-relevant settings (images, redirects, headers, output mode)

## 3. Performance
- Analyze the build output size per route (from the build log) and flag any unusually large pages/chunks
- Search for raw `<img>` tags that should be `next/image`
- Search for manual `<link>`/`@font-face` font loading that should use `next/font`
- Search for `"use client"` directives and flag any that seem unnecessary (e.g., components with no interactivity/hooks)
- Check `fetch` calls and route segment configs for caching/revalidation strategy — flag anything with no caching consideration

## 4. SEO & Metadata
- Check whether pages define `metadata` or `generateMetadata` (title, description, OG tags)
- Check for `robots.txt` and `sitemap.xml`/`sitemap.ts`
- Check for OG image setup

## 5. Error Handling
- Check for `error.tsx` and `not-found.tsx` in the app directory
- Check API routes for try/catch and proper error responses
- Check if any error monitoring tool (Sentry, etc.) is configured

## 6. Security
- Run `npm audit` and summarize high/critical vulnerabilities
- Search for hardcoded secrets, API keys, or credentials in the codebase
- Check `next.config.js`/middleware for security headers (CSP, X-Frame-Options, etc.)
- Check API routes for authentication/authorization checks
- Check for input validation on forms and API routes (e.g., zod, yup, or manual checks)

## 7. Accessibility
- Search for images missing `alt` attributes
- Search for interactive elements (`div`/`span` with `onClick`) that lack keyboard accessibility or ARIA roles

## 8. Testing
- Check if test files exist and run the test suite if present
- Report current test coverage if a coverage tool is configured

## 9. Data & Backend
- If Prisma or another ORM is used, check connection handling for serverless compatibility (connection pooling/singleton pattern)
- Check for pending/unapplied database migrations
- Check API routes for rate limiting

## 10. Deployment Readiness
- Check for custom `404`/`500` pages that aren't defaults
- Check `package.json` scripts for a proper production start command
- Note any TODO/FIXME comments left in the code

---

At the end, output a single summary table with columns: Category | Status | Key Issues Found | Suggested Fix. Order by severity (security/build-breaking issues first). Do not attempt to fix anything automatically — just report. I'll decide what to prioritize.