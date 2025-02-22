import React, { ComponentProps } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { cn } from "../../utils/helpers"
import { Block } from "../block"

interface DebugProps extends ComponentProps<typeof Block> {}

export const Debug = React.forwardRef<HTMLDivElement, DebugProps>(({ className, ...props }, ref) => {
	const CONFIG = useSelector((state: RootState) => state.config)
	const { values, sliderHeight, selectedIndex, isMouseDown, isTouchStart } = useSelector(
		(state: RootState) => state.app
	)

	return (
		CONFIG.debug && (
			<Block ref={ref} className={cn("mb-auto", className)} {...props}>
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
})
Debug.displayName = "Debug"
