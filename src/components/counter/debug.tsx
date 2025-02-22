import { Block } from "@/components/block"
import { RootState } from "@/store"
import React, { ComponentProps } from "react"
import { useSelector } from "react-redux"

interface DebugProps extends ComponentProps<typeof Block> {}

export const Debug = React.forwardRef<HTMLDivElement, DebugProps>(({ ...props }, ref) => {
	const CONFIG = useSelector((state: RootState) => state.config)
	const obj = useSelector((state: RootState) => state.config)

	return (
		CONFIG.debug && (
			<Block ref={ref} {...props}>
				<pre className="text-sm">{JSON.stringify(obj, null, 2)}</pre>
			</Block>
		)
	)
})
Debug.displayName = "Debug"
