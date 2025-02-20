import { createSlice } from "@reduxjs/toolkit"

interface Config {
	debug: boolean
	monochrome: boolean
	numbers: boolean
	numbersOffset: number
	minValue: number
	maxValue: number
	step: number
	majorDivision: number
	numberedDivision: number
}

const initialState: Config = {
	debug: true,
	monochrome: true,
	numbers: true,
	numbersOffset: 0.5,
	minValue: 0,
	maxValue: 120,
	step: 1,
	majorDivision: 5,
	numberedDivision: 10,
}

const slice = createSlice({
	name: "config",
	initialState,
	reducers: {},
})

export const {} = slice.actions
export const config = slice.reducer
