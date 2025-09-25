import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border-2 p-6 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-5 [&>svg]:top-5 [&>svg]:text-foreground shadow-lg backdrop-blur-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background/80 text-foreground border-primary/20 hover:border-primary/40",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/5 hover:bg-destructive/10",
        success:
          "border-success/50 text-success [&>svg]:text-success bg-success/5 hover:bg-success/10",
        warning:
          "border-warning/50 text-warning [&>svg]:text-warning bg-warning/5 hover:bg-warning/10",
        info:
          "border-info/50 text-info [&>svg]:text-info bg-info/5 hover:bg-info/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-bold leading-tight tracking-tight text-lg", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed font-medium", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
