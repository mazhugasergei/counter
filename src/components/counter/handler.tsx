import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { cn } from "../../utils/helpers"
import { ChevronUpDownIcon } from "../icons"

interface HandlerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Handler = React.forwardRef<HTMLDivElement, HandlerProps>(({ className, ...props }, ref) => {
	const { values, selectedIndex, sliderHeight, isMouseDown, isTouchStart } = useSelector(
		(state: RootState) => state.app
	)
	const handlerRef = React.useRef<HTMLDivElement | null>(null)
	React.useImperativeHandle(ref, () => handlerRef.current!)

	// move handler
	React.useEffect(() => {
		if (!handlerRef.current || !sliderHeight) return
		handlerRef.current.style.bottom = `${(sliderHeight / (values.length - 1)) * selectedIndex}px`
	}, [selectedIndex])

	return (
		<div
			ref={(node) => {
				handlerRef.current = node
				if (typeof ref === "function") ref(node)
				else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
			}}
			className={cn("relative translate-y-1/2 self-end", className)}
			{...props}
		>
			{isMouseDown || isTouchStart ? <Circle /> : <ChevronUpDownIcon className="pointer-events-none" />}
		</div>
	)
})
Handler.displayName = "Handler"

const Circle = () => (
	<div className="grid h-6 w-6 place-items-center">
		<div className="bg-foreground h-4 w-4 rounded-full" />
	</div>
)
