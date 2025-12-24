import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        // Primary: h-12 px-6 bg-[#135bec] hover:bg-[#0e45b5]
        primary: 'bg-[#135bec] hover:bg-[#0e45b5] text-white rounded-lg shadow-md hover:scale-[1.02] active:scale-95',
        
        // Secondary: h-12 px-6 border
        secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium rounded-lg hover:scale-[1.02] active:scale-95',
        
        // Ghost: h-10 px-4
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 font-medium rounded-lg hover:scale-[1.02] active:scale-95',
        
        // Keep existing for compatibility
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 rounded-md',
        outline: 'border bg-background hover:bg-accent rounded-md',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        // Design System sizes
        primary: 'h-12 px-6',
        secondary: 'h-12 px-6',
        ghost: 'h-10 px-4',
        
        // Keep existing
        default: 'h-9 px-4',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'primary',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        "duration-150", // Fast timing
        className
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
