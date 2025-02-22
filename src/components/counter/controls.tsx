import { cn } from "@/utils/helpers"
import React from "react"

interface ControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Controls = React.forwardRef<HTMLDivElement, ControlsProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col justify-end", className)} {...props}>
		{children}
	</div>
))
Controls.displayName = "Controls"
