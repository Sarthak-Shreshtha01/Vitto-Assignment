import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    // Integration tests round-trip to a hosted Supabase pooler; the 5s
    // default is too tight for that over a real network.
    testTimeout: 20000,
  },
});
