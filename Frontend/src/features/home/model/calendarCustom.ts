export const calendarCustom = {
    months: 'w-full flex flex-col space-y-4',
    month: 'w-full space-y-8',
    caption: 'flex justify-between pt-2 relative items-center w-full',
    caption_label:
        'text-sm font-bold absolute left-1/2 transform -translate-x-1/2',
    nav: 'w-full flex items-center justify-between',
    nav_button: 'bg-transparent p-0 opacity-50 hover:opacity-100',
    table: 'w-full border-collapse space-y-1',
    head_row: 'flex w-full',
    head_cell:
        'text-muted-foreground rounded-md w-full font-light text-xs text-[0.8rem]',
    row: 'flex w-full mt-2',
    cell: 'h-9 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
    day: 'h-9 w-full p-0 font-normal aria-selected:opacity-100',
    day_selected:
        'bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
    day_today: 'border rounded-full border-blue-300 text-blue-600',
    day_outside: 'text-muted-foreground opacity-50',
    day_disabled: 'text-muted-foreground opacity-50',
    day_range_middle:
        'aria-selected:bg-accent aria-selected:text-accent-foreground',
    day_hidden: 'invisible',
};
