import { cn } from '@/lib/utils';
import { TagItem } from '@/shared';
import { tagColorMap, textColorMap } from '../config/constants';

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
