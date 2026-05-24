import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: ["src/index.ts", "src/**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@walletconnect/ethereum-provider": resolve(
        __dirname,
        "tests/__mocks__/@walletconnect/ethereum-provider.ts"
      ),
    },
  },
});
