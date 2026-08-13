"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../lib/utils"
import {
  modalContentStyle,
  modalOverlayStyle,
} from "../lib/overlay-z-index"
import {
  FloatingWindowChrome,
  FloatingWindowProvider,
  useFloatingWindow,
  useFloatingWindowDrag,
} from "./floating-window"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    style={{ ...modalOverlayStyle, ...style }}
    className={cn(
      "fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  overlayClassName?: string
  /** 默认 true；AI 浮窗等场景可关掉，避免整屏黑遮罩 */
  showOverlay?: boolean
  /** 默认 true：显示右上角关闭按钮 */
  showClose?: boolean
  /** 默认 true：支持拖动标题条移动 */
  movable?: boolean
  /** 默认 true：支持边缘/角落缩放 */
  resizable?: boolean
  minWidth?: number
  minHeight?: number
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      style,
      children,
      overlayClassName,
      showOverlay = true,
      showClose = true,
      movable = true,
      resizable = true,
      minWidth,
      minHeight,
      ...props
    },
    ref
  ) => {
    const floatingEnabled = movable || resizable
    const {
      setNodeRef,
      floatingStyle,
      onDragPointerDown,
      onResizePointerDown,
      dragContext,
    } = useFloatingWindow({
      enabled: floatingEnabled,
      minWidth,
      minHeight,
    })

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        setNodeRef(node)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref, setNodeRef]
    )

    return (
      <DialogPortal>
        {showOverlay ? (
          <DialogOverlay className={overlayClassName} />
        ) : null}
        <DialogPrimitive.Content
          ref={setRefs}
          style={{ ...modalContentStyle, ...floatingStyle, ...style }}
          className={cn(
            "fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            floatingStyle &&
              "max-h-none translate-x-0 translate-y-0 animate-none overflow-auto transition-none data-[state=open]:zoom-in-100 data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0",
            className
          )}
          {...props}
        >
          <FloatingWindowProvider value={dragContext}>
            <FloatingWindowChrome
              enabled={floatingEnabled}
              onDragPointerDown={movable ? onDragPointerDown : () => undefined}
              onResizePointerDown={
                resizable ? onResizePointerDown : () => () => undefined
              }
            />
            {children}
          </FloatingWindowProvider>
          {showClose ? (
            <DialogPrimitive.Close
              data-no-drag
              className="absolute right-3 top-3 z-50 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  onPointerDown,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const drag = useFloatingWindowDrag()
  return (
    <div
      className={cn(
        // Reserve space for the absolute close button so titles/actions never sit under it
        "flex cursor-grab flex-col space-y-1.5 pr-10 text-center active:cursor-grabbing sm:text-left",
        className
      )}
      onPointerDown={(event) => {
        drag?.onDragPointerDown(event)
        onPointerDown?.(event)
      }}
      {...props}
    />
  )
}
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
