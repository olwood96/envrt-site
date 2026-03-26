# CLAUDE.md — envrt-site

## Rules

- **Never** include `Co-Authored-By` lines in git commits.
- Always read the existing codebase patterns before making changes.

## Project Overview

Public marketing website for ENVRT (envrt.com). Built with Next.js, serves as the main landing page, blog/content hub, and entry point for the platform.

**Stack:** Next.js / TypeScript / Tailwind CSS / Supabase / Vercel

### Key Directories

| Path | Purpose |
|------|---------|
| `src/` | Source code (pages, components, utilities) |
| `content/` | Blog/content markdown or data files |
| `public/` | Static assets |
| `sql/` | Database setup scripts |

### Deployment

Hosted on Vercel. Config in `vercel.json` and `next.config.mjs`.
