import React from "react"
import { Block } from "./components/block"
import { Container } from "./components/container"
import { Debug } from "./components/debug"
import { Display } from "./components/display"
import { Dividers } from "./components/dividers"
import { Handler } from "./components/handler"
import { SelectedRange } from "./components/selected-range"
import { Slider } from "./components/slider"
import { Values } from "./components/values"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLDivElement>(null)
	const handlerRef = React.useRef<HTMLDivElement>(null)
	const [sliderHeight, setSliderHeight] = React.useState<number | null>(null)
	const [selectedIndex, setSelectedIndex] = React.useState(0)
	const [isMouseDown, setIsMouseDown] = React.useState(false)
	const [isTouchStart, setIsTouchStart] = React.useState(false)

	const CONFIG = {
		debug: true,
		monochrome: true,
		numbers: true,
		numbersOffset: 0.5,
		minValue: 0,
		maxValue: 120,
		step: 1,
		majorDivision: 5,
		numberedDivision: 10,
	}

	// gaussian curve
	const getGaussianOffset = (selectedIndex: number, index: number) => {
		const maxOffset = 23
		const sigma = 5
		const x = Math.abs(selectedIndex - index)
		const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
		return y * maxOffset
	}

	// validations
	if (CONFIG.maxValue <= CONFIG.minValue) return <Block>Max value must be greater than min value</Block>
	if (!CONFIG.step) return <Block>CONFIG.Step must be defined and greater than 0</Block>
	if ((CONFIG.maxValue - CONFIG.minValue) % CONFIG.step) return <Block>Step must divide the range</Block>
	if ((CONFIG.maxValue - CONFIG.minValue) % CONFIG.majorDivision)
		return <Block>Major division must divide the range</Block>
	if ((CONFIG.maxValue - CONFIG.minValue) % CONFIG.numberedDivision)
		return <Block>Numbered division must divide the range</Block>

	// calculate values
	const values = React.useMemo(() => {
		const length = (CONFIG.maxValue - CONFIG.minValue) / CONFIG.step + 1
		return Array.from({ length }, (_, i) => CONFIG.minValue + i * CONFIG.step)
	}, [CONFIG.minValue, CONFIG.maxValue, CONFIG.step])

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
			let newIndex = Math.round((offsetFromBottom / sliderHeight) * ((CONFIG.maxValue - CONFIG.minValue) / CONFIG.step))
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
	}, [
		containerRef,
		isMouseDown,
		isTouchStart,
		sliderRef,
		sliderHeight,
		values.length,
		CONFIG.minValue,
		CONFIG.maxValue,
		CONFIG.step,
	])

	return (
		<Container ref={containerRef}>
			<Slider
				ref={sliderRef}
				getGaussianOffset={getGaussianOffset}
				selectedIndex={selectedIndex}
				numbers={CONFIG.numbers}
				numbersOffset={CONFIG.numbersOffset}
				maxValue={CONFIG.maxValue}
			>
				<Dividers
					values={values}
					selectedIndex={selectedIndex}
					isMouseDown={isMouseDown}
					isTouchStart={isTouchStart}
					getGaussianOffset={getGaussianOffset}
					majorDivision={CONFIG.majorDivision}
					numberedDivision={CONFIG.numberedDivision}
					numbers={CONFIG.numbers}
					numbersOffset={CONFIG.numbersOffset}
				/>

				<SelectedRange
					values={values}
					selectedIndex={selectedIndex}
					isMouseDown={isMouseDown}
					isTouchStart={isTouchStart}
					monochrome={CONFIG.monochrome}
					getGaussianOffset={getGaussianOffset}
				/>

				<Handler ref={handlerRef} isMouseDown={isMouseDown} isTouchStart={isTouchStart} />
			</Slider>

			<Display>
				<Debug
					debug={CONFIG.debug}
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
