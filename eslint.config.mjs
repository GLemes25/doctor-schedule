import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1️⃣ Side-effect imports → SEMPRE no topo (CSS, polyfills, etc)
            ["^\\u0000"],

            // 2️⃣ Next.js / React
            ["^next", "^react"],

            // 3️⃣ Packages
            ["^@?\\w"],

            // 4️⃣ Absolute imports (ex: @/)
            ["^@/"],

            // 5️⃣ Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],

      "simple-import-sort/exports": "error",
    },
  },
]);

export default eslintConfig;
