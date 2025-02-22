import { RootState } from "@/store"
import { cn } from "@/utils/helpers"
import React from "react"
import { useSelector } from "react-redux"

interface ValuesProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Values = React.forwardRef<HTMLDivElement, ValuesProps>(({ className, ...props }, ref) => {
	const { values, selectedIndex } = useSelector((state: RootState) => state.app)

	return (
		<div ref={ref} className={cn("font-mono", className)} {...props}>
			<div className="text-secondary text-md">Value</div>
			<div className="text-7xl">{values[selectedIndex]}</div>
		</div>
	)
})
