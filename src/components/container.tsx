import React from "react"
import { cn } from "../utils/helpers"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("flex min-h-screen justify-between px-6 py-10 select-none", className)} {...props}>
		{children}
	</div>
))
Container.displayName = "Container"
