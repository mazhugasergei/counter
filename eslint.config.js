import js from "@eslint/js"
import pluginImport from "eslint-plugin-import"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginReactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": pluginReactHooks,
			"react-refresh": pluginReactRefresh,
		},
		rules: {
			semi: ["error", "never"],
			"@typescript-eslint/no-unused-vars": "off",
			...pluginReactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		},
	},
	{
		files: ["src**/*.{ts,tsx}"],
		plugins: {
			import: pluginImport,
		},
		rules: {
			"import/no-default-export": "error",
		},
	}
)
