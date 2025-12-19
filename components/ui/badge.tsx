import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-bold text-xs transition-all',
  {
    variants: {
      variant: {
        // Tier badge: bg-blue-100 text-blue-700 rounded-full uppercase
        tier: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase',
        
        // Discount: bg-green-500 text-white
        discount: 'px-2 py-1 bg-green-500 text-white rounded',
        
        // Status: bg-green-100 text-green-700 font-medium
        status: 'px-2 py-1 bg-green-100 text-green-700 font-medium rounded',
        
        // Keep existing
        default: 'border-transparent bg-primary text-primary-foreground rounded-md',
        secondary: 'border-transparent bg-secondary text-secondary-foreground rounded-md',
        destructive: 'border-transparent bg-destructive text-white rounded-md',
        outline: 'text-foreground border rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
