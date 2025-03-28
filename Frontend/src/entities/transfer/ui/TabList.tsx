import ArrowListItem from '@/shared/ui/ArrowListItem';
import { TabListItem } from '../model/types';

interface TabListProps {
    title: string;
    items: TabListItem[];
    onClickItem?: (item: TabListItem) => void;
}

const TabList = ({ title, items, onClickItem }: TabListProps) => {
    return (
        <div className='flex flex-col gap-2'>
            <span className='text-lg font-semibold'>{title}</span>
            {items.map((item) => (
                <ArrowListItem
                    key={item.id}
                    title={item.title}
                    subString={item.subString}
                    onClick={() => onClickItem?.(item)}
                />
            ))}
        </div>
    );
};

export default TabList;
