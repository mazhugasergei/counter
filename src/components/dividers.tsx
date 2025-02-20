import React from "react"
import { cn } from "../utils/helpers"

interface DividersProps extends React.HTMLAttributes<HTMLDivElement> {
	values: number[]
	selectedIndex: number
	isMouseDown: boolean
	isTouchStart: boolean
	getGaussianOffset: (selectedIndex: number, index: number) => number
	majorDivision: number
	numberedDivision: number
	numbers: boolean
	numbersOffset: number
}

export const Dividers = React.forwardRef<HTMLDivElement, DividersProps>(
	(
		{
			values,
			selectedIndex,
			isMouseDown,
			isTouchStart,
			getGaussianOffset,
			majorDivision,
			numberedDivision,
			numbers,
			numbersOffset,
			className,
			...props
		},
		ref
	) => (
		<div ref={ref} className={cn("flex flex-col items-end justify-between", className)} {...props}>
			{values
				.map((value, index) => (
					<div
						key={value}
						className="relative border-t"
						style={{
							width: !(index % majorDivision) ? "10px" : "7px",
							borderColor: "var(--color-foreground)",
							right: isMouseDown || isTouchStart ? getGaussianOffset(selectedIndex, index) : 0,
						}}
					>
						{/* numbers */}
						{numbers && (
							<div
								className="absolute top-0 right-full -translate-y-1/2 font-mono text-xs"
								style={{ transform: `translateX(-${numbersOffset}rem)` }}
							>
								{!(index % numberedDivision) ? value : ""}
							</div>
						)}
					</div>
				))
				.reverse()}
		</div>
	)
)
Dividers.displayName = "Dividers"
