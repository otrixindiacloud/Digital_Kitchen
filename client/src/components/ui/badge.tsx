import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
        secondary:
          "border-transparent bg-gradient-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary/20",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/20",
        success:
          "border-transparent bg-gradient-success text-white hover:bg-success/90 shadow-success/20",
        warning:
          "border-transparent bg-gradient-warning text-warning-foreground hover:bg-warning/90 shadow-warning/20",
        info:
          "border-transparent bg-gradient-info text-white hover:bg-info/90 shadow-info/20",
        outline: 
          "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-primary hover:bg-primary/10 hover:border-primary/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
