import { RootState } from "@/store"
import { cn } from "@/utils/helpers"
import { getGaussianOffset } from "@/utils/math"
import React from "react"
import { useSelector } from "react-redux"

interface DividersProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Dividers = React.forwardRef<HTMLDivElement, DividersProps>(({ className, ...props }, ref) => {
	const CONFIG = useSelector((state: RootState) => state.config)
	const { values, selectedIndex, isMouseDown, isTouchStart } = useSelector((state: RootState) => state.app)

	return (
		<div ref={ref} className={cn("flex flex-col items-end justify-between", className)} {...props}>
			{values
				.map((value, index) => (
					<div
						key={value}
						className="relative border-t"
						style={{
							width: !(index % CONFIG.majorDivision) ? "10px" : "7px",
							borderColor: "var(--color-foreground)",
							right: isMouseDown || isTouchStart ? getGaussianOffset(selectedIndex, index) : 0,
						}}
					>
						{/* numbers */}
						{CONFIG.numbers && (
							<div
								className="absolute top-0 right-full -translate-y-1/2 font-mono text-xs"
								style={{ transform: `translateX(-${CONFIG.numbersOffset}rem)` }}
							>
								{!(index % CONFIG.numberedDivision) ? value : ""}
							</div>
						)}
					</div>
				))
				.reverse()}
		</div>
	)
})
Dividers.displayName = "Dividers"
