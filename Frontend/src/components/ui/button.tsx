import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'rounded-lg text-center transition-colors duration-200',
    {
        variants: {
            variant: {
                default:
                    'bg-primary-500 !text-white text-sm font-medium px-4 py-2',
                primary:
                    'w-full bg-primary-500 !text-white text-size-text-xl font-weight-semibold py-3',
                primaryDisabled:
                    'w-full bg-line-300 text-line-700 !text-line-700 text-size-text-xl font-semibold py-3 cursor-not-allowed',
                choiceEmpty:
                    'bg-white border border-primary-500 text-primary-500 text-sm font-medium rounded-[4px] px-3 py-2',
                choiceFill:
                    'bg-primary-500 border border-primary-500 text-white text-sm font-medium rounded-[4px] px-3 py-2',
                light: 'bg-primary-50 text-primary-500 mt-4 w-full rounded py-2',
                sendPlus: 'bg-primary-500 px-6 py-2 text-white',
                sendMinus: 'bg-subPink-600 px-6 py-2 text-white',
                logout: 'border border-line-200 px-8 py-1.5 text-sm text-line-400',
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
