import React from "react"
import { IconProps } from "."

export const DotsIcon = React.forwardRef<SVGSVGElement, IconProps>(({ size, ...props }, ref) => (
	<svg
		ref={ref}
		xmlns="http://www.w3.org/2000/svg"
		width={size ?? 24}
		height={size ?? 24}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<circle cx="12" cy="12" r="1" />
		<circle cx="19" cy="12" r="1" />
		<circle cx="5" cy="12" r="1" />
	</svg>
))
DotsIcon.displayName = "DotsIcon"
