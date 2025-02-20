import React from "react"
import { cn } from "../utils/helpers"
import { ChevronUpDownIcon } from "./icons"

interface HandlerProps extends React.HTMLAttributes<HTMLDivElement> {
	isMouseDown: boolean
	isTouchStart: boolean
}

export const Handler = React.forwardRef<HTMLDivElement, HandlerProps>(
	({ isMouseDown, isTouchStart, className, ...props }, ref) => {
		const Circle = () => (
			<div className="grid h-6 w-6 place-items-center">
				<div className="bg-foreground h-4 w-4 rounded-full" />
			</div>
		)

		return (
			<div ref={ref} className={cn("relative translate-y-1/2 self-end", className)} {...props}>
				{isMouseDown || isTouchStart ? <Circle /> : <ChevronUpDownIcon className="pointer-events-none" />}
			</div>
		)
	}
)
Handler.displayName = "Handler"
