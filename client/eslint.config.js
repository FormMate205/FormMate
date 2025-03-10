import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    plugins: {
      "react-hooks": pluginReactHooks,
      "unused-imports": unusedImports,
      tailwindcss,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "tailwindcss/classnames-order": "error",
    },
  },

  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-var": "warn",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": ["warn"],
      semi: ["error", "always"],
      quotes: ["error", "single"],
      indent: ["error", 4],
    },
  },

  {
    plugins: {
      tailwindcss,
    },
    rules: {
      "tailwindcss/classnames-order": "error",
    },
  },

  {
    plugins: { prettier },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },

  {
    rules: {
      ...prettierConfig.rules,
    },
  },
];
