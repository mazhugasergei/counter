import { configureStore } from "@reduxjs/toolkit"
import { app } from "./app.slice"
import { config } from "./config.slice"

export const store = configureStore({
	reducer: {
		app,
		config,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
