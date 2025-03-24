import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface ProgressProps
    extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    color?: 'pink' | 'blue'; // 확장 가능
}

function Progress({
    className,
    value,
    color = 'pink',
    ...props
}: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            data-slot='progress'
            className={cn(
                'bg-line-100 relative h-2 w-full overflow-hidden rounded-full',
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot='progress-indicator'
                className={cn(
                    'h-full w-full flex-1 rounded-full transition-all',
                    color === 'blue' ? 'bg-primary-500' : 'bg-subPink-600',
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
