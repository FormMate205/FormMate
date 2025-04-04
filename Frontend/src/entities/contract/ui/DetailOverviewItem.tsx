import { cn } from '@/lib/utils';
import { TagItem } from '@/shared';
import { TagColor } from '@/shared/model/types';

const tagColorMap: Record<string, TagColor> = {
    중도: 'subPurple',
    진행: 'primary',
    연체: 'subPink',
    이자: 'line',
};

const textColorMap: Record<TagColor, string> = {
    primary: 'text-primary-700',
    subPurple: 'text-subPurple-700',
    subPink: 'text-subPink-700',
    line: 'text-line-700',
};

interface DetailOverviewItemProps {
    tagText: string;
    color?: string;
    mainText: string;
    subText: string;
}

const DetailOverviewItem = ({
    tagText,
    mainText,
    subText,
}: DetailOverviewItemProps) => {
    const color = tagColorMap[tagText] || 'primary';
    return (
        <div className='flex items-center gap-2'>
            <TagItem text={tagText} color={color} />
            <div className='text-line-900 flex items-center gap-1'>
                <span className={cn('font-medium', textColorMap[color])}>
                    {mainText}
                </span>
                <span>|</span>
                <span>{subText}</span>
            </div>
        </div>
    );
};

export default DetailOverviewItem;
