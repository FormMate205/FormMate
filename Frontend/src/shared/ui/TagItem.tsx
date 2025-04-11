import { cn } from '../../lib/utils';

interface TagItemProps {
    text: string;
    color?: 'primary' | 'subPurple' | 'subPink' | 'line';
}

const COLOR_CLASSES = {
    primary: 'bg-primary-100 text-primary-500',
    subPurple: 'text-subPurple-700 bg-subPurple-100',
    subPink: 'text-subPink-600 bg-subPink-100',
    line: 'text-line-700 bg-line-100',
};

const TagItem = ({ text, color = 'primary' }: TagItemProps) => {
    return (
        <div className={cn(COLOR_CLASSES[color], 'w-fit rounded-sm px-2.5')}>
            <span>{text}</span>
        </div>
    );
};
export default TagItem;
