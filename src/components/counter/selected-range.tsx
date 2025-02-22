import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { cn } from "../../utils/helpers"
import { getGaussianOffset } from "../../utils/math"

interface SelectedRangeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectedRange = React.forwardRef<HTMLDivElement, SelectedRangeProps>(({ className, ...props }, ref) => {
	const CONFIG = useSelector((state: RootState) => state.config)
	const { values, selectedIndex, isMouseDown, isTouchStart } = useSelector((state: RootState) => state.app)

	return (
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
									: CONFIG.monochrome
										? "var(--color-foreground)"
										: "var(--color-primary)",
							right: isMouseDown || isTouchStart ? getGaussianOffset(selectedIndex, index) : 0,
						}}
					/>
				))
				.reverse()}
		</div>
	)
})
SelectedRange.displayName = "SelectedRange"
