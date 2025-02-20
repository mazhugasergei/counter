import React from "react"
import { cn } from "../utils/helpers"

interface SelectedRangeProps extends React.HTMLAttributes<HTMLDivElement> {
	values: number[]
	selectedIndex: number
	isMouseDown: boolean
	isTouchStart: boolean
	monochrome: boolean
	getGaussianOffset: (selectedIndex: number, index: number) => number
}

export const SelectedRange = React.forwardRef<HTMLDivElement, SelectedRangeProps>(
	({ values, selectedIndex, isMouseDown, isTouchStart, monochrome, getGaussianOffset, className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col justify-between", className)} {...props}>
			{values
				.map((value, index) => (
					<div
						key={value}
						className="relative w-1 border-t"
						style={{
							borderColor:
								index > selectedIndex
									? "var(--color-secondary)"
									: monochrome
										? "var(--color-foreground)"
										: "var(--color-primary)",
							right: isMouseDown || isTouchStart ? getGaussianOffset(selectedIndex, index) : 0,
						}}
					/>
				))
				.reverse()}
		</div>
	)
)
SelectedRange.displayName = "SelectedRange"
