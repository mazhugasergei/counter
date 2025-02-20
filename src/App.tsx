import React from "react"
import { Block } from "./components/block"
import { ChevronUpDownIcon } from "./components/icons"
import { cn } from "./utils/helpers"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLDivElement>(null)
	const handlerRef = React.useRef<HTMLDivElement>(null)
	const [sliderHeight, setSliderHeight] = React.useState<number | null>(null)
	const [selectedValueIndex, setSelectedValueIndex] = React.useState(0)
	const [isMouseDown, setIsMouseDown] = React.useState(false)

	// slider config
	const minValue = 0
	const maxValue = 100
	const step = 1
	const majorDivision = 5
	const numbers = true

	// gaussian curve
	const getOffset = (selectedValueIndex: number, index: number) => {
		if (!isMouseDown) return
		const maxOffset = 15
		const sigma = 5
		const x = Math.abs(selectedValueIndex - index)
		const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
		return y * maxOffset
	}

	// validations
	if (maxValue <= minValue) return <Block>Max value must be greater than min value</Block>
	if (!step) return <Block>Step must be defined and greater than 0</Block>
	if ((maxValue - minValue) % step) return <Block>Step must divide the range</Block>
	if ((maxValue - minValue) % majorDivision) return <Block>Major division must divide the range</Block>

	const values = React.useMemo(() => {
		const length = (maxValue - minValue) / step + 1
		return Array.from({ length }, (_, i) => minValue + i * step)
	}, [minValue, maxValue, step])

	React.useEffect(() => {
		const handleWindowResize = () => {
			if (!sliderRef.current) return
			setSliderHeight(sliderRef.current.offsetHeight)
		}

		handleWindowResize()
		window.addEventListener("resize", handleWindowResize)
		return () => {
			window.removeEventListener("resize", handleWindowResize)
		}
	}, [sliderRef])

	React.useEffect(() => {
		if (!handlerRef.current) return

		const handleMouseDown = () => {
			setIsMouseDown(true)
			// document.body.style.cursor = "none"
		}
		const handleMouseUp = () => {
			setIsMouseDown(false)
			// document.body.style.cursor = "default"
		}

		const handleMouseMove = (e: MouseEvent | TouchEvent) => {
			if (!isMouseDown || !sliderRef.current || !handlerRef.current || !sliderHeight) return
			const eY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
			// calculate new value
			const offsetFromBottom = sliderRef.current.getBoundingClientRect().bottom - eY
			let newValueIndex = Math.round((offsetFromBottom / sliderHeight) * ((maxValue - minValue) / step))
			if (newValueIndex < 0) newValueIndex = 0
			if (newValueIndex > values.length - 1) newValueIndex = values.length - 1
			setSelectedValueIndex(newValueIndex)
			// move handler
			handlerRef.current.style.bottom = `${(sliderHeight / (values.length - 1)) * newValueIndex}px`
		}

		handlerRef.current.addEventListener("mousedown", handleMouseDown)
		handlerRef.current.addEventListener("touchstart", handleMouseDown)
		document.addEventListener("mouseup", handleMouseUp)
		document.addEventListener("touchend", handleMouseUp)
		document.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("touchmove", handleMouseMove)

		return () => {
			handlerRef.current?.removeEventListener("mousedown", handleMouseDown)
			handlerRef.current?.removeEventListener("touchstart", handleMouseDown)
			document.removeEventListener("mouseup", handleMouseUp)
			document.removeEventListener("touchend", handleMouseUp)
			document.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("touchmove", handleMouseMove)
		}
	}, [handlerRef, sliderRef, sliderHeight, values, isMouseDown])

	return (
		<main>
			{/* container */}
			<div ref={containerRef} className="flex min-h-screen justify-between p-6">
				{/* slider */}
				<div ref={sliderRef} className={cn("flex gap-3", numbers ? "pl-8" : "pl-2")}>
					{/* dividers */}
					<div className="flex flex-col items-end justify-between">
						{values
							.map((value, index) => (
								<div
									key={value}
									className="relative"
									style={{
										width: !(index % majorDivision) ? "10px" : "7px",
										borderTop: "1px solid var(--color-foreground)",
										right: getOffset(selectedValueIndex, index),
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
									className="relative"
									style={{
										width: "3px",
										borderTop: "1px solid var(--color-foreground)",
										opacity: selectedValueIndex >= index ? 1 : 0.2,
										// borderTop: `1px solid ${selectedValueIndex >= index ? "var(--color-primary)" : "var(--color-secondary)"}`,
										right: getOffset(selectedValueIndex, index),
									}}
								/>
							))
							.reverse()}
					</div>

					{/* handler */}
					<div ref={handlerRef} className="relative translate-y-1/2 self-end">
						{isMouseDown ? (
							<div className="grid h-6 w-6 place-items-center">
								<div className="bg-foreground h-4 w-4 rounded-full" />
							</div>
						) : (
							<ChevronUpDownIcon className="pointer-events-none select-none" />
						)}
					</div>
				</div>

				<div className="flex flex-col justify-between">
					{/* debug */}
					<Block>
						<pre>
							{JSON.stringify(
								{
									isMouseDown,
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
