import React from "react"
import { Block } from "./block"

interface DebugProps extends React.HTMLAttributes<HTMLDivElement> {
	debug: boolean
	sliderHeight: number | null
	isMouseDown: boolean
	isTouchStart: boolean
	selectedIndex: number
	values: number[]
}

export const Debug = React.forwardRef<HTMLDivElement, DebugProps>(
	({ debug, sliderHeight, isMouseDown, isTouchStart, selectedIndex, values }, ref) => {
		return (
			debug && (
				<Block ref={ref} className="mb-auto">
					<pre>
						{JSON.stringify(
							{
								sliderHeight,
								isMouseDown,
								isTouchStart,
								value: values[selectedIndex],
								selectedIndex,
							},
							null,
							2
						)}
					</pre>
				</Block>
			)
		)
	}
)
Debug.displayName = "Debug"
