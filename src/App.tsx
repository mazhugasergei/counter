import React from "react"
import { Block } from "./components/block"
import { ChevronUpDownIcon } from "./components/icons"
import { cn } from "./utils/helpers"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLDivElement>(null)
	const handlerRef = React.useRef<HTMLDivElement>(null)
	const [sliderHeight, setSliderHeight] = React.useState<number | null>(null)
	const [selectedIndex, setSelectedIndex] = React.useState(0)
	const [isMouseDown, setIsMouseDown] = React.useState(false)
	const [isTouchStart, setIsTouchStart] = React.useState(false)

	// config
	const debug = true
	const monochrome = true
	const numbers = true
	const numbersOffset = 0.5
	const minValue = 0
	const maxValue = 120
	const step = 1
	const majorDivision = 5
	const numberedDivision = 10

	// gaussian curve
	const getOffset = (selectedIndex: number, index: number) => {
		const maxOffset = 23
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
		<Container ref={containerRef}>
			<Slider
				ref={sliderRef}
				getOffset={getOffset}
				selectedIndex={selectedIndex}
				numbers={numbers}
				numbersOffset={numbersOffset}
				maxValue={maxValue}
			>
				<Dividers
					values={values}
					selectedIndex={selectedIndex}
					isMouseDown={isMouseDown}
					isTouchStart={isTouchStart}
					getOffset={getOffset}
					majorDivision={majorDivision}
					numberedDivision={numberedDivision}
					numbers={numbers}
					numbersOffset={numbersOffset}
				/>

				<SelectedRange
					values={values}
					selectedIndex={selectedIndex}
					isMouseDown={isMouseDown}
					isTouchStart={isTouchStart}
					monochrome={monochrome}
					getOffset={getOffset}
				/>

				<Handler ref={handlerRef} isMouseDown={isMouseDown} isTouchStart={isTouchStart} />
			</Slider>

			<Display>
				<Debug
					debug={debug}
					sliderHeight={sliderHeight}
					isMouseDown={isMouseDown}
					isTouchStart={isTouchStart}
					selectedIndex={selectedIndex}
					values={values}
				/>

				<Values values={values} selectedIndex={selectedIndex} />
			</Display>
		</Container>
	)
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("flex min-h-screen justify-between px-6 py-10 select-none", className)} {...props}>
		{children}
	</div>
))
Container.displayName = "Container"

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
	getOffset: (selectedIndex: number, index: number) => number
	selectedIndex: number
	numbers: boolean
	numbersOffset: number
	maxValue: number
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
	({ getOffset, selectedIndex, numbers, numbersOffset, maxValue, children, className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex gap-3", className)}
			style={{
				paddingLeft: (() => {
					const maxOffset = getOffset(0, 0) / 16
					const characterWidth = 6.6 / 16
					const maxValueLength = maxValue.toString().length
					const numbersWidth = numbers ? maxValueLength * characterWidth + numbersOffset : 0
					return maxOffset + numbersWidth + "rem"
				})(),
			}}
			{...props}
		>
			{children}
		</div>
	)
)
Slider.displayName = "Slider"

interface DividersProps extends React.HTMLAttributes<HTMLDivElement> {
	values: number[]
	selectedIndex: number
	isMouseDown: boolean
	isTouchStart: boolean
	getOffset: (selectedIndex: number, index: number) => number
	majorDivision: number
	numberedDivision: number
	numbers: boolean
	numbersOffset: number
}

const Dividers = React.forwardRef<HTMLDivElement, DividersProps>(
	(
		{
			values,
			selectedIndex,
			isMouseDown,
			isTouchStart,
			getOffset,
			majorDivision,
			numberedDivision,
			numbers,
			numbersOffset,
			className,
			...props
		},
		ref
	) => (
		<div ref={ref} className={cn("flex flex-col items-end justify-between", className)} {...props}>
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
	)
)
Dividers.displayName = "Dividers"

interface SelectedRangeProps extends React.HTMLAttributes<HTMLDivElement> {
	values: number[]
	selectedIndex: number
	isMouseDown: boolean
	isTouchStart: boolean
	monochrome: boolean
	getOffset: (selectedIndex: number, index: number) => number
}

const SelectedRange = React.forwardRef<HTMLDivElement, SelectedRangeProps>(
	({ values, selectedIndex, isMouseDown, isTouchStart, monochrome, getOffset, className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col justify-between", className)} {...props}>
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
	)
)
SelectedRange.displayName = "SelectedRange"

interface HandlerProps extends React.HTMLAttributes<HTMLDivElement> {
	isMouseDown: boolean
	isTouchStart: boolean
}

const Handler = React.forwardRef<HTMLDivElement, HandlerProps>(
	({ isMouseDown, isTouchStart, className, ...props }, ref) => {
		const Circle = () => (
			<div className="grid h-6 w-6 place-items-center">
				<div className="bg-foreground h-4 w-4 rounded-full" />
			</div>
		)

		return (
			<div ref={ref} className={cn("relative translate-y-1/2 self-end", className)} {...props}>
				{isMouseDown || isTouchStart ? <Circle /> : <ChevronUpDownIcon className="pointer-events-none" />}
			</div>
		)
	}
)
Handler.displayName = "Handler"

interface DisplayProps extends React.HTMLAttributes<HTMLDivElement> {}

const Display = React.forwardRef<HTMLDivElement, DisplayProps>(({ children, className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col justify-end", className)} {...props}>
		{children}
	</div>
))
Display.displayName = "Display"

interface DebugProps extends React.HTMLAttributes<HTMLDivElement> {
	debug: boolean
	sliderHeight: number | null
	isMouseDown: boolean
	isTouchStart: boolean
	selectedIndex: number
	values: number[]
}

const Debug = React.forwardRef<HTMLDivElement, DebugProps>(
	({ debug, sliderHeight, isMouseDown, isTouchStart, selectedIndex, values }, ref) => {
		return (
			debug && (
				<Block ref={ref} className="mb-auto">
					<pre>
						{JSON.stringify(
							{
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
			)
		)
	}
)
Debug.displayName = "Debug"

interface ValuesProps extends React.HTMLAttributes<HTMLDivElement> {
	values: number[]
	selectedIndex: number
}

const Values = React.forwardRef<HTMLDivElement, ValuesProps>(({ values, selectedIndex }, ref) => {
	return (
		<div ref={ref} className="text-right font-mono">
			<div className="text-secondary text-md">Value</div>
			<div className="text-7xl">{values[selectedIndex]}</div>
		</div>
	)
})
