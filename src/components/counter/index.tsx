import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { type AppDispatch, type RootState } from "../../store"
import { setIsMouseDown, setIsTouchStart, setSelectedIndex } from "../../store/app.slice"
import { cn } from "../../utils/helpers"
import { Block } from "../block"
import { Controls } from "./controls"
import { Debug } from "./debug"
import { Dividers } from "./dividers"
import { Handler } from "./handler"
import { SelectedRange } from "./selected-range"
import { Slider } from "./slider"
import { Values } from "./values"

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Counter = React.forwardRef<HTMLDivElement, CounterProps>(({ className, ...props }, ref) => {
	const counterRef = React.useRef<HTMLDivElement | null>(null)
	React.useImperativeHandle(ref, () => counterRef.current!)
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
		if (!counterRef.current) return

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

		counterRef.current.addEventListener("mousedown", handleMouseDown)
		counterRef.current.addEventListener("touchstart", handleTouchStart)
		document.addEventListener("mouseup", handleMouseUp)
		document.addEventListener("touchend", handleTouchEnd)
		document.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("touchmove", handleTouchMove)

		return () => {
			counterRef.current?.removeEventListener("mousedown", handleMouseDown)
			counterRef.current?.removeEventListener("touchstart", handleTouchStart)
			document.removeEventListener("mouseup", handleMouseUp)
			document.removeEventListener("touchend", handleTouchEnd)
			document.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("touchmove", handleTouchMove)
		}
	}, [counterRef, sliderRef, sliderHeight, isMouseDown, isTouchStart, CONFIG.minValue, CONFIG.maxValue, CONFIG.step])

	return (
		<div
			ref={(node) => {
				counterRef.current = node
				if (typeof ref === "function") ref(node)
				else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
			}}
			className={cn("flex min-h-screen justify-between px-6 py-10 select-none", className)}
			{...props}
		>
			<Slider ref={sliderRef}>
				<Dividers />
				<SelectedRange />
				<Handler ref={handlerRef} />
			</Slider>

			<Controls>
				<Debug />
				<Values />
			</Controls>
		</div>
	)
})
Counter.displayName = "Counter"
