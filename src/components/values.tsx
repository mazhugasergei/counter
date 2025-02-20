import React from "react"

interface ValuesProps extends React.HTMLAttributes<HTMLDivElement> {
	values: number[]
	selectedIndex: number
}

export const Values = React.forwardRef<HTMLDivElement, ValuesProps>(({ values, selectedIndex }, ref) => {
	return (
		<div ref={ref} className="text-right font-mono">
			<div className="text-secondary text-md">Value</div>
			<div className="text-7xl">{values[selectedIndex]}</div>
		</div>
	)
})
