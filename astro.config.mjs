// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://yourlabmarketing.com",
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
});
