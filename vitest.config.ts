import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ["**/*.browser.test.{ts,js}"],
          name: "browser",
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@@": fileURLToPath(new URL("./", import.meta.url)),
          },
        },
      },
      {
        test: {
          include: ["**/*.node.test.{ts,js}"],
          name: "node",
          environment: "node",
        },
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@@": fileURLToPath(new URL("./", import.meta.url)),
          },
        },
      },
    ],
  },
});
