"use client"

import * as React from "react"
import { cn } from "../lib/utils"

export type FloatingBounds = {
  x: number
  y: number
  width: number
  height: number
}

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

const DEFAULT_MIN_WIDTH = 320
const DEFAULT_MIN_HEIGHT = 220

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function isInteractiveDragTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(
    target.closest(
      "button,a,input,textarea,select,option,[role='button'],[role='combobox'],[role='menuitem'],[data-no-drag],[data-radix-collection-item]"
    )
  )
}

export type FloatingWindowContextValue = {
  onDragPointerDown: (event: React.PointerEvent) => void
}

const FloatingWindowContext =
  React.createContext<FloatingWindowContextValue | null>(null)

export function useFloatingWindowDrag() {
  return React.useContext(FloatingWindowContext)
}

export function FloatingWindowProvider({
  value,
  children,
}: {
  value: FloatingWindowContextValue
  children: React.ReactNode
}) {
  return (
    <FloatingWindowContext.Provider value={value}>
      {children}
    </FloatingWindowContext.Provider>
  )
}

export type UseFloatingWindowOptions = {
  enabled?: boolean
  minWidth?: number
  minHeight?: number
}

function applyBoundsToDom(el: HTMLElement | null, bounds: FloatingBounds) {
  if (!el) return
  el.style.setProperty("left", `${bounds.x}px`)
  el.style.setProperty("top", `${bounds.y}px`)
  el.style.setProperty("width", `${bounds.width}px`)
  el.style.setProperty("height", `${bounds.height}px`)
  el.style.setProperty("max-width", "none")
  el.style.setProperty("transform", "none")
  el.style.setProperty("margin", "0")
}

export function useFloatingWindow({
  enabled = true,
  minWidth = DEFAULT_MIN_WIDTH,
  minHeight = DEFAULT_MIN_HEIGHT,
}: UseFloatingWindowOptions = {}) {
  const nodeRef = React.useRef<HTMLElement | null>(null)
  const liveBoundsRef = React.useRef<FloatingBounds | null>(null)
  const [bounds, setBounds] = React.useState<FloatingBounds | null>(null)
  const dragRef = React.useRef<{
    pointerId: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const resizeRef = React.useRef<{
    pointerId: number
    edge: ResizeEdge
    startX: number
    startY: number
    origin: FloatingBounds
  } | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const pendingBoundsRef = React.useRef<FloatingBounds | null>(null)

  const measure = React.useCallback((): FloatingBounds | null => {
    const el = nodeRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    }
  }, [])

  const paintBounds = React.useCallback((next: FloatingBounds) => {
    liveBoundsRef.current = next
    pendingBoundsRef.current = next
    if (rafRef.current != null) return
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      const pending = pendingBoundsRef.current
      if (!pending) return
      applyBoundsToDom(nodeRef.current, pending)
    })
  }, [])

  const commitBounds = React.useCallback((next: FloatingBounds) => {
    liveBoundsRef.current = next
    applyBoundsToDom(nodeRef.current, next)
    setBounds(next)
  }, [])

  const ensureBounds = React.useCallback((): FloatingBounds | null => {
    if (liveBoundsRef.current) return liveBoundsRef.current
    const measured = measure()
    if (!measured) return null
    // Switch from centered transform layout to absolute coords immediately (no React lag).
    commitBounds(measured)
    return measured
  }, [commitBounds, measure])

  const setNodeRef = React.useCallback((node: HTMLElement | null) => {
    nodeRef.current = node
    if (node && liveBoundsRef.current) {
      applyBoundsToDom(node, liveBoundsRef.current)
    }
  }, [])

  React.useEffect(() => {
    if (!enabled) return

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current
      if (drag && event.pointerId === drag.pointerId) {
        event.preventDefault()
        const prev = liveBoundsRef.current
        if (!prev) return
        const maxX = Math.max(0, window.innerWidth - prev.width)
        const maxY = Math.max(0, window.innerHeight - 48)
        paintBounds({
          ...prev,
          x: clamp(event.clientX - drag.offsetX, 0, maxX),
          y: clamp(event.clientY - drag.offsetY, 0, maxY),
        })
        return
      }

      const resize = resizeRef.current
      if (!resize || event.pointerId !== resize.pointerId) return
      event.preventDefault()
      const { edge, startX, startY, origin } = resize
      const dx = event.clientX - startX
      const dy = event.clientY - startY
      let { x, y, width, height } = origin

      if (edge.includes("e")) {
        width = clamp(origin.width + dx, minWidth, window.innerWidth - origin.x)
      }
      if (edge.includes("s")) {
        height = clamp(
          origin.height + dy,
          minHeight,
          window.innerHeight - origin.y
        )
      }
      if (edge.includes("w")) {
        const nextWidth = clamp(
          origin.width - dx,
          minWidth,
          origin.x + origin.width
        )
        x = origin.x + (origin.width - nextWidth)
        width = nextWidth
      }
      if (edge.includes("n")) {
        const nextHeight = clamp(
          origin.height - dy,
          minHeight,
          origin.y + origin.height
        )
        y = origin.y + (origin.height - nextHeight)
        height = nextHeight
      }

      paintBounds({
        x: clamp(x, 0, Math.max(0, window.innerWidth - width)),
        y: clamp(y, 0, Math.max(0, window.innerHeight - 48)),
        width,
        height,
      })
    }

    const onPointerUp = (event: PointerEvent) => {
      const wasDragging =
        dragRef.current?.pointerId === event.pointerId ||
        resizeRef.current?.pointerId === event.pointerId
      if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
      if (resizeRef.current?.pointerId === event.pointerId) {
        resizeRef.current = null
      }
      if (wasDragging && liveBoundsRef.current) {
        // Final sync into React state after gesture ends.
        setBounds({ ...liveBoundsRef.current })
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: false })
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [enabled, minHeight, minWidth, paintBounds])

  const onDragPointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      if (!enabled || event.button !== 0) return
      if (isInteractiveDragTarget(event.target)) return
      const current = ensureBounds()
      if (!current) return
      event.preventDefault()
      event.stopPropagation()
      try {
        ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
      } catch {
        // ignore
      }
      dragRef.current = {
        pointerId: event.pointerId,
        offsetX: event.clientX - current.x,
        offsetY: event.clientY - current.y,
      }
    },
    [enabled, ensureBounds]
  )

  const onResizePointerDown = React.useCallback(
    (edge: ResizeEdge) => (event: React.PointerEvent) => {
      if (!enabled || event.button !== 0) return
      const current = ensureBounds()
      if (!current) return
      event.preventDefault()
      event.stopPropagation()
      try {
        ;(event.currentTarget as HTMLElement).setPointerCapture?.(
          event.pointerId
        )
      } catch {
        // ignore
      }
      resizeRef.current = {
        pointerId: event.pointerId,
        edge,
        startX: event.clientX,
        startY: event.clientY,
        origin: { ...current },
      }
    },
    [enabled, ensureBounds]
  )

  const floatingStyle: React.CSSProperties | undefined = bounds
    ? {
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        maxWidth: "none",
        transform: "none",
        margin: 0,
      }
    : undefined

  const resetBounds = React.useCallback(() => {
    liveBoundsRef.current = null
    setBounds(null)
  }, [])

  const dragContext = React.useMemo(
    () => ({ onDragPointerDown }),
    [onDragPointerDown]
  )

  return {
    bounds,
    setNodeRef,
    floatingStyle,
    onDragPointerDown,
    onResizePointerDown,
    resetBounds,
    dragContext,
  }
}

const RESIZE_HANDLES: Array<{
  edge: ResizeEdge
  className: string
}> = [
  { edge: "n", className: "left-2 right-2 top-0 h-1.5 cursor-n-resize" },
  { edge: "s", className: "left-2 right-2 bottom-0 h-1.5 cursor-s-resize" },
  { edge: "e", className: "top-2 bottom-2 right-0 w-1.5 cursor-e-resize" },
  { edge: "w", className: "top-2 bottom-2 left-0 w-1.5 cursor-w-resize" },
  { edge: "ne", className: "right-0 top-0 h-3 w-3 cursor-ne-resize" },
  { edge: "nw", className: "left-0 top-0 h-3 w-3 cursor-nw-resize" },
  { edge: "se", className: "right-0 bottom-0 h-3 w-3 cursor-se-resize" },
  { edge: "sw", className: "left-0 bottom-0 h-3 w-3 cursor-sw-resize" },
]

export function FloatingWindowChrome({
  enabled = true,
  onDragPointerDown,
  onResizePointerDown,
  className,
}: {
  enabled?: boolean
  onDragPointerDown: (event: React.PointerEvent) => void
  onResizePointerDown: (edge: ResizeEdge) => (event: React.PointerEvent) => void
  className?: string
}) {
  if (!enabled) return null

  return (
    <>
      <div
        data-floating-drag-handle
        onPointerDown={onDragPointerDown}
        className={cn(
          "absolute inset-x-10 top-0 z-20 flex h-9 cursor-grab touch-none items-center justify-center active:cursor-grabbing",
          className
        )}
        aria-hidden
      >
        <div className="h-1 w-12 rounded-full bg-muted-foreground/40" />
      </div>
      {RESIZE_HANDLES.map((handle) => (
        <div
          key={handle.edge}
          data-floating-resize={handle.edge}
          onPointerDown={onResizePointerDown(handle.edge)}
          className={cn("absolute z-30 touch-none", handle.className)}
          aria-hidden
        />
      ))}
    </>
  )
}
