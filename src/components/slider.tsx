import React from "react"
import { cn } from "../utils/helpers"

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
	getGaussianOffset: (selectedIndex: number, index: number) => number
	selectedIndex: number
	numbers: boolean
	numbersOffset: number
	maxValue: number
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
	({ getGaussianOffset, selectedIndex, numbers, numbersOffset, maxValue, children, className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex gap-3", className)}
			style={{
				paddingLeft: (() => {
					const maxOffset = getGaussianOffset(0, 0) / 16
					const characterWidth = 6.6 / 16
					const maxValueLength = maxValue.toString().length
					const numbersWidth = numbers ? maxValueLength * characterWidth + numbersOffset : 0
					return maxOffset + numbersWidth + "rem"
				})(),
			}}
			{...props}
		>
			{children}
		</div>
	)
)
Slider.displayName = "Slider"
