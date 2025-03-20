import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'rounded-lg text-center transition-colors duration-200',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--color-primary-500)] !text-white text-[var(--font-size-text-md)] font-[var(--font-weight-medium)] px-4 py-1',
                primary:
                    'w-full bg-[var(--color-primary-500)] !text-white text-[var(--font-size-text-xl)] font-[var(--font-weight-semibold)] py-3',
                primaryDisabled:
                    'w-full bg-[var(--color-line-300)] text-[var(--color-line-700)] !text-[var(--color-line-700)] text-[var(--font-size-text-xl)] font-[var(--font-weight-semibold)] py-3 cursor-not-allowed',
                choiceEmpty:
                    'bg-white border border-[var(--color-primary-500)] text-[var(--color-primary-500)] text-sm font-[var(--font-weight-medium)] rounded-[4px] px-3 py-2',
                choiceFill:
                    'bg-[var(--color-primary-500)] border border-[var(--color-primary-500)] text-white text-sm font-[var(--font-weight-medium)] rounded-[4px] px-3 py-2',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, className }))}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
