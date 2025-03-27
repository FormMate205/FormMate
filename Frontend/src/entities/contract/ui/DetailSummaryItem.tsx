import { Icons, TagItem } from '@/shared';

type TagColor = 'default' | 'purple' | 'red' | 'gray';

const tagColorMap: Record<string, TagColor> = {
    중도: 'purple',
    납부: 'default',
    연체: 'red',
    이자: 'gray',
};

interface SummaryItemProps {
    tagText: string;
    color?: string;
    mainText: string;
    subText: string;
    withIcon?: boolean;
}

const DetailSummaryItem = ({
    tagText,
    color,
    mainText,
    subText,
    withIcon,
}: SummaryItemProps) => {
    return (
        <div className='flex items-center gap-2'>
            <TagItem text={tagText} color={tagColorMap[tagText]} />
            <div className='text-line-900 flex items-center gap-1'>
                <span
                    className={
                        color
                            ? `font-medium text-${color}-600`
                            : 'text-primary-500 font-medium'
                    }
                >
                    {mainText}
                </span>
                <span>|</span>
                <span>{subText}</span>
                {withIcon && (
                    <Icons
                        name='question'
                        size={14}
                        className='fill-line-900'
                    />
                )}
            </div>
        </div>
    );
};

export default DetailSummaryItem;
