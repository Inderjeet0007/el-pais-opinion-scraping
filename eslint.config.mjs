import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest", // Enable modern JavaScript features
      sourceType: "module", // For ES Modules
      globals: {
        require: "readonly", // Allow 'require' globally
        module: "readonly", // Allow 'module' globally
        __dirname: "readonly", // Allow '__dirname' globally
        process: "readonly", // Allow 'process' globally
        exports: "readonly", // Allow 'exports' globally
        Buffer: "readonly", // Allow 'Buffer' globally
        console: "readonly", // Allow 'console' globally
        setTimeout: "readonly", // Allow 'setTimeout' globally
        clearTimeout: "readonly", // Allow 'clearTimeout' globally
        setInterval: "readonly", // Allow 'setInterval' globally
        clearInterval: "readonly", // Allow 'clearInterval' globally
      },
    },
    rules: {
      "no-undef": "error", // Ensure variables are defined
    },
  },
];
