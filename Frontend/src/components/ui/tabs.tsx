import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';
import { cn } from '../../lib/utils';

function Tabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot='tabs'
            className={cn('flex h-full flex-col', className)}
            {...props}
        />
    );
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot='tabs-list'
            className={cn(
                'text-line-700 inline-flex items-center justify-center',
                className,
            )}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot='tabs-trigger'
            className={cn(
                "border-line-200 inline-flex flex-1 cursor-pointer items-center justify-center border-b-[1.4px] px-2 py-4 text-lg font-medium whitespace-nowrap focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-black data-[state=active]:text-black [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot='tabs-content'
            className={cn('flex-1 p-4 outline-none', className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
