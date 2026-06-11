// Next.js 14 instrumentation hook. Routes server/edge runtime
// initialisation to the right Sentry config based on where the
// request is being handled.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
