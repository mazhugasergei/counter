import React from "react"
import { IconProps } from "."

export const ChevronUpDownIcon = React.forwardRef<SVGSVGElement, IconProps>(({ size, ...props }, ref) => (
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
		<path d="m7 15 5 5 5-5" />
		<path d="m7 9 5-5 5 5" />
	</svg>
))
ChevronUpDownIcon.displayName = "ChevronUpDownIcon"
