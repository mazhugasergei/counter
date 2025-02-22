import { cn } from "@/utils/helpers"
import React from "react"
import { Button } from "./button"

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
	children: [React.ReactElement<MenuTriggerProps>, React.ReactElement<MenuListProps>]
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
	({ children: [MenuTrigger, MenuList], className, ...props }, ref) => {
		const [open, setOpen] = React.useState(false)
		const menuRef = React.useRef<HTMLDivElement | null>(null)
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
				document.removeEventListener("click", closeOnOuterClick, true)
				window.removeEventListener("scroll", closeOnScroll)
			}
		}, [])

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
				{/* trigger */}
				{React.cloneElement(MenuTrigger, {
					onClick: () => setOpen((prev) => !prev),
					className: cn(MenuTrigger.props.className, open && "bg-accent"),
					...MenuTrigger.props,
				})}

				{/* list */}
				{open && React.cloneElement(MenuList, { ...MenuList.props })}
			</div>
		)
	}
)
Menu.displayName = "Menu"

interface MenuTriggerProps extends React.ComponentProps<typeof Button> {}

export const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>((props, ref) => (
	<Button ref={ref} variant="ghost" size="icon" {...props} />
))
MenuTrigger.displayName = "MenuTrigger"

interface MenuListProps extends React.HTMLAttributes<HTMLUListElement> {
	children: React.ReactElement<MenuItemProps> | React.ReactElement<MenuItemProps>[]
}

export const MenuList = React.forwardRef<HTMLUListElement, MenuListProps>(({ className, ...props }, ref) => {
	const listRef = React.useRef<HTMLUListElement | null>(null)
	React.useImperativeHandle(ref, () => listRef.current!)

	// Adjust menu position after render
	React.useEffect(() => {
		if (!listRef.current) return

		const adjustPosition = () => {
			const list = listRef.current
			if (!list) return

			const rect = list.getBoundingClientRect()

			// Adjust horizontal position
			if (rect.x + rect.width > window.innerWidth) {
				list.style.left = "auto"
				list.style.right = "0"
			} else {
				list.style.left = "0"
				list.style.right = "auto"
			}

			// Adjust vertical position
			if (rect.y + rect.height > window.innerHeight) {
				list.style.top = "auto"
				list.style.bottom = "calc(100% + .25rem)"
			} else {
				list.style.top = "calc(100% + .25rem)"
				list.style.bottom = "auto"
			}
		}

		// Run after paint to ensure correct positioning
		const timeout = setTimeout(adjustPosition)
		return () => clearTimeout(timeout)
	}, [])

	return (
		<ul
			ref={(node) => {
				listRef.current = node
				if (typeof ref === "function") ref(node)
				else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = node
			}}
			className={cn("bg-background absolute rounded-lg border p-2", className)}
			{...props}
		/>
	)
})
MenuList.displayName = "MenuList"

interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(({ children, ...props }, ref) => (
	<li ref={ref} {...props}>
		<Button variant="ghost">{children}</Button>
	</li>
))
MenuItem.displayName = "MenuItem"
