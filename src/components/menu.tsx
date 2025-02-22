import { DotsIcon } from "@/components/icons"
import { cn } from "@/utils/helpers"
import React from "react"
import { Button } from "./button"

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
	openIcon?: React.ReactElement
	closeIcon?: React.ReactElement
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
	({ children, className, openIcon = <DotsIcon size={20} />, closeIcon = <DotsIcon size={20} />, ...props }, ref) => {
		const [open, setOpen] = React.useState(false)
		const menuRef = React.useRef<HTMLDivElement | null>(null)
		const listRef = React.useRef<HTMLUListElement>(null)
		React.useImperativeHandle(ref, () => menuRef.current!)

		// events
		React.useEffect(() => {
			const closeOnOuterClick = (e: MouseEvent) => {
				if (!menuRef.current) return
				if (menuRef.current.contains(e.target as Node)) return
				setOpen(false)
			}

			const closeOnScroll = () => setOpen(false)

			document.addEventListener("click", closeOnOuterClick, true)
			window.addEventListener("scroll", closeOnScroll)

			return () => {
				document.removeEventListener("click", close, true)
				window.removeEventListener("scroll", closeOnScroll)
			}
		}, [])

		// adjust menu position
		React.useEffect(() => {
			if (!listRef.current) return

			const listClientRect = listRef.current.getBoundingClientRect()

			if (listClientRect.x + listClientRect.width > window.innerWidth) listRef.current.style.right = "0"
			else listRef.current.style.left = "0"

			if (listClientRect.y + listClientRect.height > window.innerHeight)
				listRef.current.style.bottom = "calc(100% + .25rem)"
			else listRef.current.style.top = "calc(100% + .25rem)"
		}, [open])

		return (
			<div
				ref={(node) => {
					menuRef.current = node
					if (typeof ref === "function") ref(node)
					else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
				}}
				className={cn("relative", className)}
				{...props}
			>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setOpen((prev) => !prev)}
					className={cn(open && "bg-accent")}
				>
					{open ? closeIcon : openIcon}
				</Button>

				{open && (
					<ul
						ref={listRef}
						onClick={() => setOpen(false)}
						className={cn("bg-background absolute rounded-lg border p-2")}
					>
						{children}
					</ul>
				)}
			</div>
		)
	}
)
Menu.displayName = "Menu"

interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(({ children, ...props }, ref) => (
	<li ref={ref} {...props}>
		<Button variant="ghost">{children}</Button>
	</li>
))
MenuItem.displayName = "MenuItem"
