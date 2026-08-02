declare module "cloudflare:workers" {
  export const env: {
    DB: D1Database;
  } & Record<string, unknown>;
}

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1Database {
  prepare(query: string): unknown;
}
