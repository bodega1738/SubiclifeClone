import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg',
        'text-gray-900 placeholder:text-gray-400',
        'focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        'outline-none transition-all duration-150',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
