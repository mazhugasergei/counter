import { RootState } from "@/store"
import { setConfig } from "@/store/config.slice"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { SettingsIcon } from "../icons"
import { Menu, MenuItem } from "../menu"

interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Settings = React.forwardRef<HTMLDivElement, SettingsProps>((props, ref) => {
	const dispatch = useDispatch()
	const CONFIG = useSelector((state: RootState) => state.config)

	const handleToggleDebug = React.useCallback(() => {
		dispatch(setConfig({ debug: !CONFIG.debug }))
	}, [CONFIG.debug, dispatch])

	return (
		<div ref={ref} {...props}>
			<Menu openIcon={<SettingsIcon size={20} />} closeIcon={<SettingsIcon size={20} />}>
				<MenuItem onClick={handleToggleDebug}>Debug menu [{CONFIG.debug ? "ON" : "OFF"}]</MenuItem>
			</Menu>
		</div>
	)
})
Settings.displayName = "Settings"
