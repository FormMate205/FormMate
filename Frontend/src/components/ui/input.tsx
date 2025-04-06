import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Icons } from '../../shared';

const inputVariants = cva('rounded w-full border py-3 px-4', {
    variants: {
        variant: {
            default:
                'border-[var(--color-line-200)] placeholder-[var(--color-line-700)] focus:border-[var(--color-line-500)]',
            necessary:
                'border-[var(--color-line-200)] placeholder-[var(--color-line-700)] focus:border-[var(--color-line-500)]',
            valid: 'border-[var(--color-line-200)] placeholder-[var(--color-line-700)] focus:border-[var(--color-line-500)]',
            search: 'bg-[var(--color-line-50)] border-[var(--color-line-50)] placeholder-[var(--color-line-300)] focus:border-none pl-10',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'necessary' | 'valid' | 'search';
    isEmpty?: boolean;
    isValid?: boolean;
}

function Input({
    variant = 'default',
    className,
    isEmpty,
    isValid,
    ...props
}: InputProps) {
    // 동적 클래스 계산
    const getDynamicClasses = () => {
        const classes = [];

        // 필수 입력값이 비어있는 경우우
        if (variant === 'necessary' && isEmpty) {
            classes.push('!border-[var(--color-subPink-700)]');
        }

        // 인증 실패 여부
        if (variant === 'valid') {
            if (!isValid) {
                classes.push('!border-[var(--color-subPink-700)]');
            } else {
                classes.push('!border-[var(--color-primary-500)]');
            }
        }

        return classes.join(' ');
    };

    return (
        <div className='relative w-full'>
            {variant === 'search' && (
                <div className='absolute -translate-y-1/2 pointer-events-none top-1/2 left-4'>
                    <Icons name='search' size={16} color='fill-line-500' />
                </div>
            )}
            <input
                data-slot='input'
                className={cn(
                    inputVariants({ variant }),
                    'focus:outline-none',
                    getDynamicClasses(),
                    className,
                )}
                {...props}
            />
        </div>
    );
}

export { Input };
