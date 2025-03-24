import { cn } from '../../lib/utils';

interface TagItemProps {
    text: string;
    color?: 'default' | 'purple' | 'red' | 'gray';
}

const COLOR_CLASSES = {
    default: 'bg-primary-100 text-primary-500',
    purple: 'text-subPurple-700 bg-subPurple-100',
    red: 'text-subPink-600 bg-subPink-100',
    gray: 'text-line-700 bg-line-100',
};

const TagItem = ({ text, color = 'default' }: TagItemProps) => {
    return (
        <div className={cn(COLOR_CLASSES[color], 'w-fit rounded-sm px-2.5')}>
            <span>{text}</span>
        </div>
    );
};
export default TagItem;
