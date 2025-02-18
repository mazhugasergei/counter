import React from "react"
import { cn } from "./utils/helpers"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLDivElement>(null)
	const handlerRef = React.useRef<HTMLDivElement>(null)
	const [sliderHeight, setSliderHeight] = React.useState<number | null>(null)
	const [selectedValueIndex, setSelectedValueIndex] = React.useState(0)
	const minValue = 0
	const maxValue = 100
	const step = 1
	const majorDivision = 5
	const numbers = true
	const sigma = 5

	if (maxValue <= minValue) return <Block>Max value must be greater than min value</Block>
	if (!step) return <Block>Step must be defined and greater than 0</Block>
	if ((maxValue - minValue) % step) return <Block>Step must divide the range</Block>
	if ((maxValue - minValue) % majorDivision) return <Block>Major division must divide the range</Block>

	const values = React.useMemo(() => {
		const length = (maxValue - minValue) / step + 1
		return Array.from({ length }, (_, i) => minValue + i * step)
	}, [minValue, maxValue, step])

	React.useEffect(() => {
		if (!sliderRef.current) return
		setSliderHeight(sliderRef.current.offsetHeight)
	}, [sliderRef])

	React.useEffect(() => {
		if (!handlerRef.current) return

		let isMouseDown = false
		const handleMouseDown = () => (isMouseDown = true)
		const handleMouseUp = () => (isMouseDown = false)

		const handleMouseMove = (e: MouseEvent) => {
			if (!isMouseDown || !sliderRef.current || !handlerRef.current || !sliderHeight) return
			// calculate new value
			const offsetFromBottom = sliderRef.current.getBoundingClientRect().bottom - e.clientY
			let newValueIndex = Math.round((offsetFromBottom / sliderHeight) * ((maxValue - minValue) / step))
			if (newValueIndex < 0) newValueIndex = 0
			if (newValueIndex > values.length - 1) newValueIndex = values.length - 1
			setSelectedValueIndex(newValueIndex)
			// move handler
			handlerRef.current.style.top = `${sliderHeight - (sliderHeight / (values.length - 1)) * newValueIndex}px`
		}

		handlerRef.current.addEventListener("mousedown", handleMouseDown)
		document.addEventListener("mouseup", handleMouseUp)
		document.addEventListener("mousemove", handleMouseMove)

		return () => {
			handlerRef.current?.removeEventListener("mousedown", handleMouseDown)
			document.removeEventListener("mouseup", handleMouseUp)
			document.removeEventListener("mousemove", handleMouseMove)
		}
	}, [handlerRef, sliderRef, sliderHeight])

	return (
		<main>
			{/* container */}
			<div ref={containerRef} className="flex min-h-screen justify-between p-6">
				{/* slider */}
				<div ref={sliderRef} className={cn("flex gap-2", numbers ? "pl-8" : "pl-2")}>
					{/* dividers */}
					<div className="flex flex-col items-end justify-between">
						{values
							.map((value, index) => (
								<div
									key={value}
									style={{
										width: !(index % majorDivision) ? "10px" : "7px",
										borderTop: "1px solid var(--color-foreground)",
										transform: (() => {
											const x = Math.abs(selectedValueIndex - index)
											const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
											const maxOffset = 15
											return `translateX(-${y * maxOffset}px)`
										})(),
									}}
								>
									{/* numbers */}
									{numbers && (
										<div className="absolute top-0 right-[100%] -translate-x-2 -translate-y-1/2 font-mono text-xs select-none">
											{!(index % majorDivision) ? value : ""}
										</div>
									)}
								</div>
							))
							.reverse()}
					</div>

					{/* selected range */}
					<div className="flex flex-col justify-between">
						{values
							.map((value, index) => (
								<div
									key={value}
									style={{
										width: "3px",
										borderTop: "1px solid var(--color-foreground)",
										opacity: selectedValueIndex >= index ? 1 : 0.2,
										transform: (() => {
											const x = Math.abs(selectedValueIndex - index)
											const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
											const maxOffset = 15
											return `translateX(-${y * maxOffset}px)`
										})(),
									}}
								/>
							))
							.reverse()}
					</div>

					{/* handler */}
					<div
						ref={handlerRef}
						className="bg-foreground relative h-4 w-4 -translate-y-[calc(50%+1px)] rounded-full"
						style={{
							top: "100%",
						}}
					/>
				</div>

				<div className="flex flex-col justify-between">
					{/* debug */}
					<Block>
						<pre>
							{JSON.stringify(
								{
									value: values[selectedValueIndex],
									selectedValueIndex,
								},
								null,
								2
							)}
						</pre>
					</Block>

					<div className="flex flex-col items-end">
						<div className="text-secondary text-md font-mono">Value</div>
						<div className="font-mono text-7xl">{values[selectedValueIndex]}</div>
					</div>
				</div>
			</div>
		</main>
	)
}

const Block = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ children, className, ...props }, ref) => (
		<div ref={ref} className={cn("bg-muted rounded-sm border p-4", className)} {...props}>
			{children}
		</div>
	)
)
Block.displayName = "Block"
