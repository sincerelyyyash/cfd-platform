"use client"

import * as React from "react"

function ResizablePanelGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="resizable-panel-group" className={`flex ${className ?? ""}`} {...props} />
}

function ResizablePanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="resizable-panel" className={className} {...props} />
}

function ResizableHandle({ className }: { className?: string }) {
  return <div data-slot="resizable-handle" className={`bg-border w-px h-full ${className ?? ""}`} />
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }


