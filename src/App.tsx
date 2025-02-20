import React from "react"
import { Block } from "./components/block"
import { ChevronUpDownIcon } from "./components/icons"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLDivElement>(null)
	const handlerRef = React.useRef<HTMLDivElement>(null)
	const [sliderHeight, setSliderHeight] = React.useState<number | null>(null)
	const [selectedIndex, setSelectedIndex] = React.useState(0)
	const [isMouseDown, setIsMouseDown] = React.useState(false)
	const [isTouchStart, setIsTouchStart] = React.useState(false)

	// config
	const config = {
		debug: false,
		monochrome: true,
		numbers: true,
		numbersOffset: 0.5,
		minValue: 0,
		maxValue: 120,
		step: 1,
		majorDivision: 5,
		numberedDivision: 10,
	}
	const { debug, monochrome, numbers, numbersOffset, minValue, maxValue, step, majorDivision, numberedDivision } =
		config

	// gaussian curve
	const getOffset = (selectedIndex: number, index: number) => {
		const maxOffset = 25
		const sigma = 5
		const x = Math.abs(selectedIndex - index)
		const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
		return y * maxOffset
	}

	// validations
	if (maxValue <= minValue) return <Block>Max value must be greater than min value</Block>
	if (!step) return <Block>Step must be defined and greater than 0</Block>
	if ((maxValue - minValue) % step) return <Block>Step must divide the range</Block>
	if ((maxValue - minValue) % majorDivision) return <Block>Major division must divide the range</Block>
	if ((maxValue - minValue) % numberedDivision) return <Block>Numbered division must divide the range</Block>

	const values = React.useMemo(() => {
		const length = (maxValue - minValue) / step + 1
		return Array.from({ length }, (_, i) => minValue + i * step)
	}, [minValue, maxValue, step])

	// slider height
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

	// move handler
	React.useEffect(() => {
		if (!handlerRef.current || !sliderHeight) return
		handlerRef.current.style.bottom = `${(sliderHeight / (values.length - 1)) * selectedIndex}px`
	}, [selectedIndex])

	// events
	React.useEffect(() => {
		if (!containerRef.current) return

		const handleMouseDown = (e: MouseEvent) => {
			setIsMouseDown(true)
			calculateNewIndex(e.clientY)
			document.body.style.cursor = "none"
		}
		const handleMouseUp = () => {
			setIsMouseDown(false)
			document.body.style.cursor = "default"
		}

		const handleTouchStart = (e: TouchEvent) => {
			setIsTouchStart(true)
			calculateNewIndex(e.touches[0].clientY)
		}

		const handleTouchEnd = () => {
			setIsTouchStart(false)
		}

		const calculateNewIndex = (clientY: number) => {
			if (!sliderRef.current || !sliderHeight) return
			const offsetFromBottom = sliderRef.current.getBoundingClientRect().bottom - clientY
			let newIndex = Math.round((offsetFromBottom / sliderHeight) * ((maxValue - minValue) / step))
			if (newIndex < 0) newIndex = 0
			if (newIndex > values.length - 1) newIndex = values.length - 1
			setSelectedIndex(newIndex)
		}

		const handleMouseMove = (e: MouseEvent) => {
			if (!isMouseDown) return
			calculateNewIndex(e.clientY)
		}

		const handleTouchMove = (e: TouchEvent) => {
			if (!isTouchStart) return
			calculateNewIndex(e.touches[0].clientY)
		}

		containerRef.current.addEventListener("mousedown", handleMouseDown)
		containerRef.current.addEventListener("touchstart", handleTouchStart)
		document.addEventListener("mouseup", handleMouseUp)
		document.addEventListener("touchend", handleTouchEnd)
		document.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("touchmove", handleTouchMove)

		return () => {
			containerRef.current?.removeEventListener("mousedown", handleMouseDown)
			containerRef.current?.removeEventListener("touchstart", handleTouchStart)
			document.removeEventListener("mouseup", handleMouseUp)
			document.removeEventListener("touchend", handleTouchEnd)
			document.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("touchmove", handleTouchMove)
		}
	}, [containerRef, isMouseDown, isTouchStart, sliderRef, sliderHeight, values.length, minValue, maxValue, step])

	return (
		<div ref={containerRef} className="flex min-h-screen justify-between px-6 py-10 select-none">
			{/* slider */}
			<div
				ref={sliderRef}
				className="flex gap-3"
				style={{
					paddingLeft: numbers
						? `${maxValue.toString().length * 0.4125 + numbersOffset + getOffset(0, 0) / 16}rem`
						: "0.5rem",
				}}
			>
				{/* dividers */}
				<div className="flex flex-col items-end justify-between">
					{values
						.map((value, index) => (
							<div
								key={value}
								className="relative border-t"
								style={{
									width: !(index % majorDivision) ? "10px" : "7px",
									borderColor: "var(--color-foreground)",
									right: isMouseDown || isTouchStart ? getOffset(selectedIndex, index) : 0,
								}}
							>
								{/* numbers */}
								{numbers && (
									<div
										className="absolute top-0 right-full -translate-y-1/2 font-mono text-xs"
										style={{ transform: `translateX(-${numbersOffset}rem)` }}
									>
										{!(index % numberedDivision) ? value : ""}
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
								className="relative w-1 border-t"
								style={{
									borderColor:
										index > selectedIndex
											? "var(--color-secondary)"
											: monochrome
												? "var(--color-foreground)"
												: "var(--color-primary)",
									right: isMouseDown || isTouchStart ? getOffset(selectedIndex, index) : 0,
								}}
							/>
						))
						.reverse()}
				</div>

				{/* handler */}
				<div ref={handlerRef} className="relative translate-y-1/2 self-end">
					{isMouseDown || isTouchStart ? (
						<div className="grid h-6 w-6 place-items-center">
							<div className="bg-foreground h-4 w-4 rounded-full" />
						</div>
					) : (
						<ChevronUpDownIcon className="pointer-events-none select-none" />
					)}
				</div>
			</div>

			<div className="flex flex-col justify-end">
				{/* debug */}
				{debug && (
					<Block className="mb-auto">
						<pre>
							{JSON.stringify(
								{
									...config,
									sliderHeight,
									isMouseDown,
									isTouchStart,
									value: values[selectedIndex],
									selectedIndex,
								},
								null,
								2
							)}
						</pre>
					</Block>
				)}

				{/* values */}
				<div className="text-right font-mono">
					<div className="text-secondary text-md">Value</div>
					<div className="text-7xl">{values[selectedIndex]}</div>
				</div>
			</div>
		</div>
	)
}
