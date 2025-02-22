import { cn } from "@/utils/helpers"
import React from "react"

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Block = React.forwardRef<HTMLDivElement, BlockProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("bg-muted rounded-sm border p-4", className)} {...props}>
		{children}
	</div>
))
Block.displayName = "Block"
