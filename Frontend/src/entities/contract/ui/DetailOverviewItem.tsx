import { cn } from '@/lib/utils';
import { Icons, TagItem } from '@/shared';
import { TagColor } from '@/shared/model/types';

const tagColorMap: Record<string, TagColor> = {
    중도: 'subPurple',
    진행: 'primary',
    연체: 'subPink',
    이자: 'line',
};

interface DetailOverviewItemProps {
    tagText: string;
    color?: string;
    mainText: string;
    subText: string;
    withIcon?: boolean;
}

const DetailOverviewItem = ({
    tagText,
    mainText,
    subText,
    withIcon,
}: DetailOverviewItemProps) => {
    const color = tagColorMap[tagText] || 'primary';
    return (
        <div className='flex items-center gap-2'>
            <TagItem text={tagText} color={color} />
            <div className='text-line-900 flex items-center gap-1'>
                <span className={cn('font-medium', `text-${color}-600`)}>
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

export default DetailOverviewItem;
