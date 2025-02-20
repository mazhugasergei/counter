import React from "react"
import { cn } from "../utils/helpers"

interface DisplayProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Display = React.forwardRef<HTMLDivElement, DisplayProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col justify-end", className)} {...props}>
		{children}
	</div>
))
Display.displayName = "Display"
