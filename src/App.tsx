import React from "react"
import { cn } from "./utils/helpers"

export function App() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const [containerHeight, setContainerHeight] = React.useState<number | null>(null)
	const [selectedValueIndex, setSelectedValueIndex] = React.useState(0)
	const minValue = 0
	const maxValue = 100
	const step = 1
	const majorDivision = 5
	const radius = 10

	if (maxValue <= minValue) return <Block>Max value must be greater than min value</Block>
	if (!step) return <Block>Step must be defined and greater than 0</Block>
	if ((maxValue - minValue) % step) return <Block>Step must divide the range</Block>
	if ((maxValue - minValue) % majorDivision) return <Block>Major division must divide the range</Block>

	const values = React.useMemo(() => {
		const length = (maxValue - minValue) / step + 1
		return Array.from({ length }, (_, i) => minValue + i * step)
	}, [minValue, maxValue, step])

	React.useEffect(() => {
		if (!containerRef.current) return
		setContainerHeight(containerRef.current.clientHeight)

		const handleChangeValue = (e: WheelEvent) => {
			setSelectedValueIndex((prev) => {
				const newValue = prev + (e.deltaY < 0 ? 1 : -1)
				return Math.min(Math.max(newValue, 0), values.length - 1)
			})
		}
		containerRef.current?.addEventListener("wheel", handleChangeValue)

		return () => {
			containerRef.current?.removeEventListener("wheel", handleChangeValue)
		}
	}, [containerRef])

	return (
		<main className="p-2">
			{/* container */}
			<div ref={containerRef} className="bg-secondary">
				<div className="flex gap-2 pl-10">
					{/* dividers */}
					<div className="flex flex-col items-end space-y-1">
						{values
							.map((value, index) => (
								<div
									key={value}
									style={{
										width: !(index % majorDivision) ? "10px" : "7px",
										borderTop: "1px solid var(--color-foreground)",
										transform: (() => {
											const sigma = radius / 2
											const x = Math.abs(selectedValueIndex - index)
											const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
											const maxOffset = 15
											return `translateX(-${y * maxOffset}px)`
										})(),
									}}
								>
									{/* numbers */}
									<div className="absolute top-0 right-[100%] -translate-x-2 -translate-y-1/2 text-xs">
										{!(index % majorDivision) ? value : ""}
									</div>
								</div>
							))
							.reverse()}
					</div>

					{/* selected index */}
					<div className="flex flex-col space-y-1">
						{values
							.map((value, index) => (
								<div
									key={value}
									style={{
										width: "3px",
										borderTop: "1px solid var(--color-foreground)",
										opacity: selectedValueIndex >= index ? 1 : 0.3,
										transform: (() => {
											const sigma = radius / 2
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
				</div>
			</div>

			{/* debug */}
			<Block className="mt-2">
				<pre>{JSON.stringify({ containerHeight, selectedValueIndex, radius }, null, 2)}</pre>
			</Block>
		</main>
	)
}

const Block = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ children, className, ...props }, ref) => (
		<div ref={ref} className={cn("bg-secondary rounded-sm border p-4", className)} {...props}>
			{children}
		</div>
	)
)
Block.displayName = "Block"
