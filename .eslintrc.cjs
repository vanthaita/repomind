/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["error", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_" 
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",
    
    // General rules
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    
    // Code quality
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
    "template-curly-spacing": "error",
    
    // React rules
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/no-array-index-key": "warn",
    "react/no-danger": "warn",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unknown-property": "error",
    "react/no-unsafe": "warn",
    "react/self-closing-comp": "error",
    
    // Import rules
    "import/no-duplicates": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "build/",
    "dist/",
    "*.config.js",
    "*.config.ts"
  ]
};

module.exports = config;