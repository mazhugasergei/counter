import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface App {
	values: number[]
	sliderHeight: number | null
	selectedIndex: number
	isMouseDown: boolean
	isTouchStart: boolean
}

const initialState: App = {
	values: [],
	sliderHeight: null,
	selectedIndex: 0,
	isMouseDown: false,
	isTouchStart: false,
}

const slice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setValues: (state, action: PayloadAction<number[]>) => {
			state.values = action.payload
		},
		setSliderHeight: (state, action: PayloadAction<number | null>) => {
			state.sliderHeight = action.payload
		},
		setSelectedIndex: (state, action: PayloadAction<number>) => {
			state.selectedIndex = action.payload
		},
		setIsMouseDown: (state, action: PayloadAction<boolean>) => {
			state.isMouseDown = action.payload
		},
		setIsTouchStart: (state, action: PayloadAction<boolean>) => {
			state.isTouchStart = action.payload
		},
	},
})

export const { setValues, setSliderHeight, setSelectedIndex, setIsMouseDown, setIsTouchStart } = slice.actions
export const app = slice.reducer
