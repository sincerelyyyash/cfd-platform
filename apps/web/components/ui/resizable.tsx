"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
	return (
		<ResizablePrimitive.PanelGroup
			data-slot="resizable-panel-group"
			className={cn(
				"flex h-full w-full data-[panel-group-direction=vertical]:flex-col [--panel-gap-size:0px]",
				className
			)}
			{...props}
		/>
	)
}

function ResizablePanel({
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
	return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
	withHandle?: boolean
}) {
	return (
		<ResizablePrimitive.PanelResizeHandle
			data-slot="resizable-handle"
			className={cn(
				"relative flex bg-slate-800 w-px items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
				className
			)}
			{...props}
		>
			{withHandle && (
				<div className="bg-slate-900 z-10 flex h-4 w-3 items-center justify-center rounded-xs border border-slate-800 text-slate-400">
					<GripVerticalIcon className="size-2.5" />
				</div>
			)}
		</ResizablePrimitive.PanelResizeHandle>
	)
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
