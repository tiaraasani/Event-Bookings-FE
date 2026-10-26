import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-4 focus-visible:ring-brand-orange/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:border-transparent disabled:bg-brand-disabled disabled:text-[#5b6b88] disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-brand-orange text-white shadow-sm shadow-brand-orange/20 hover:bg-brand-orange-dark focus-visible:ring-brand-orange/25",
        outline:
          "border-brand-navy/30 bg-white text-brand-navy shadow-sm hover:border-brand-navy hover:bg-brand-neutral/60",
        secondary:
          "bg-brand-navy text-white shadow-sm shadow-brand-navy/15 hover:bg-brand-navy-dark",
        ghost:
          "text-brand-navy hover:bg-brand-neutral hover:text-brand-navy-dark",
        destructive:
          "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 focus-visible:ring-red-200",
        link: "h-auto rounded-none p-0 text-brand-navy underline-offset-4 hover:text-brand-orange hover:underline",
      },
      size: {
        default: "h-10 px-4 text-sm",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 px-6 text-sm",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
