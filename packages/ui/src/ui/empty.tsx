import * as React from "react";
import { cn } from "../lib/utils";

function Empty({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-card/40 px-4 py-6 text-center",
        className
      )}
      {...props}
    />
  );
}

function EmptyIcon({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-2 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function EmptyTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-semibold text-foreground", className)} {...props} />
  );
}

function EmptyDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-xs leading-5 text-muted-foreground", className)} {...props} />;
}

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription };
