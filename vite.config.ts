import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "")

	return {
		plugins: [react(), tailwindcss()],
		base: env.NODE_ENV === "production" ? "/counter/" : "/",
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "src"),
			},
		},
	}
})
