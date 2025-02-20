import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { setSliderHeight, setValues } from "../store/app.slice"
import { cn } from "../utils/helpers"
import { getGaussianOffset } from "../utils/math"

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(({ children, className, ...props }, ref) => {
	const dispatch = useDispatch()
	const CONFIG = useSelector((state: RootState) => state.config)
	const sliderRef = React.useRef<HTMLDivElement | null>(null)
	React.useImperativeHandle(ref, () => sliderRef.current!)

	// values
	const values = React.useMemo(() => {
		const length = (CONFIG.maxValue - CONFIG.minValue) / CONFIG.step + 1
		return Array.from({ length }, (_, i) => CONFIG.minValue + i * CONFIG.step)
	}, [CONFIG.minValue, CONFIG.maxValue, CONFIG.step])

	React.useEffect(() => {
		dispatch(setValues(values))
	}, [values, dispatch])

	// slider height
	React.useEffect(() => {
		const handleWindowResize = () => {
			if (!sliderRef.current) return
			dispatch(setSliderHeight(sliderRef.current.offsetHeight))
		}

		handleWindowResize()
		window.addEventListener("resize", handleWindowResize)
		return () => {
			window.removeEventListener("resize", handleWindowResize)
		}
	}, [dispatch])

	return (
		<div
			ref={(node) => {
				sliderRef.current = node
				if (typeof ref === "function") ref(node)
				else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
			}}
			className={cn("flex gap-3", className)}
			style={{
				paddingLeft: (() => {
					const maxOffset = getGaussianOffset(0, 0) / 16
					const characterWidth = 6.6 / 16
					const maxValueLength = CONFIG.maxValue.toString().length
					const numbersWidth = CONFIG.numbers ? maxValueLength * characterWidth + CONFIG.numbersOffset : 0
					return maxOffset + numbersWidth + "rem"
				})(),
			}}
			{...props}
		>
			{children}
		</div>
	)
})
Slider.displayName = "Slider"
