import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Block } from "./components/block"
import { Container } from "./components/container"
import { Debug } from "./components/debug"
import { Display } from "./components/display"
import { Dividers } from "./components/dividers"
import { Handler } from "./components/handler"
import { SelectedRange } from "./components/selected-range"
import { Slider } from "./components/slider"
import { Values } from "./components/values"
import { AppDispatch, RootState } from "./store"
import { setIsMouseDown, setIsTouchStart, setSelectedIndex } from "./store/app.slice"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLDivElement>(null)
	const handlerRef = React.useRef<HTMLDivElement>(null)
	const dispatch = useDispatch<AppDispatch>()
	const CONFIG = useSelector((state: RootState) => state.config)
	const { values, sliderHeight, isMouseDown, isTouchStart } = useSelector((state: RootState) => state.app)

	// validations
	if (CONFIG.maxValue <= CONFIG.minValue) return <Block>Max value must be greater than min value</Block>
	if (!CONFIG.step) return <Block>CONFIG.Step must be defined and greater than 0</Block>
	if ((CONFIG.maxValue - CONFIG.minValue) % CONFIG.step) return <Block>Step must divide the range</Block>
	if ((CONFIG.maxValue - CONFIG.minValue) % CONFIG.majorDivision)
		return <Block>Major division must divide the range</Block>
	if ((CONFIG.maxValue - CONFIG.minValue) % CONFIG.numberedDivision)
		return <Block>Numbered division must divide the range</Block>

	// events
	React.useEffect(() => {
		if (!containerRef.current) return

		const handleMouseDown = (e: MouseEvent) => {
			dispatch(setIsMouseDown(true))
			calculateNewIndex(e.clientY)
			document.body.style.cursor = "none"
		}
		const handleMouseUp = () => {
			dispatch(setIsMouseDown(false))
			document.body.style.cursor = "default"
		}

		const handleTouchStart = (e: TouchEvent) => {
			dispatch(setIsTouchStart(true))
			calculateNewIndex(e.touches[0].clientY)
		}

		const handleTouchEnd = () => {
			dispatch(setIsTouchStart(false))
		}

		const calculateNewIndex = (clientY: number) => {
			if (!sliderRef.current || !sliderHeight) return
			const offsetFromBottom = sliderRef.current.getBoundingClientRect().bottom - clientY
			let newIndex = Math.round((offsetFromBottom / sliderHeight) * ((CONFIG.maxValue - CONFIG.minValue) / CONFIG.step))
			if (newIndex < 0) newIndex = 0
			if (newIndex > values.length - 1) newIndex = values.length - 1
			dispatch(setSelectedIndex(newIndex))
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
	}, [containerRef, sliderRef, sliderHeight, isMouseDown, isTouchStart, CONFIG.minValue, CONFIG.maxValue, CONFIG.step])

	return (
		<Container ref={containerRef}>
			<Slider ref={sliderRef}>
				<Dividers />
				<SelectedRange />
				<Handler ref={handlerRef} />
			</Slider>

			<Display>
				<Debug />
				<Values />
			</Display>
		</Container>
	)
}
