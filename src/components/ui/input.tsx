import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-brand-disabled/80 bg-white px-3.5 py-2 text-sm text-brand-text shadow-sm transition-colors outline-none placeholder:text-brand-muted/70 focus-visible:border-brand-orange focus-visible:ring-4 focus-visible:ring-brand-orange/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-brand-disabled disabled:bg-brand-disabled/40 disabled:text-brand-muted aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 file:mr-3 file:inline-flex file:h-7 file:border-0 file:bg-brand-orange-soft file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand-navy md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
