import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 touch-optimized",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 hover:bg-primary/90 focus:shadow-glow",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-105 hover:from-red-600 hover:to-red-700 focus:shadow-glow",
        outline:
          "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-primary hover:bg-primary/10 hover:border-primary/40 hover:scale-105 focus:shadow-glow",
        secondary:
          "bg-gradient-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:scale-105 hover:bg-secondary/80 focus:shadow-glow",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:scale-105 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-200",
        success: "bg-gradient-success text-white shadow-md hover:shadow-lg hover:scale-105 hover:bg-success/90 focus:shadow-glow",
        warning: "bg-gradient-warning text-warning-foreground shadow-md hover:shadow-lg hover:scale-105 hover:bg-warning/90 focus:shadow-glow",
        info: "bg-gradient-info text-white shadow-md hover:shadow-lg hover:scale-105 hover:bg-info/90 focus:shadow-glow",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
