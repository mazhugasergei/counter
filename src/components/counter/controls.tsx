import { cn } from "@/utils/helpers"
import React from "react"
import { Debug } from "./debug"
import { Settings } from "./settings"
import { Values } from "./values"

interface ControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Controls = React.forwardRef<HTMLDivElement, ControlsProps>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col items-end gap-4", className)} {...props}>
		<Settings />
		<Debug />
		<Values className="mt-auto text-right" />
	</div>
))
Controls.displayName = "Controls"
