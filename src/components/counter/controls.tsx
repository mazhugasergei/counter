import React from "react"
import { cn } from "../../utils/helpers"

interface ControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Controls = React.forwardRef<HTMLDivElement, ControlsProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col justify-end", className)} {...props}>
		{children}
	</div>
))
Controls.displayName = "Controls"
