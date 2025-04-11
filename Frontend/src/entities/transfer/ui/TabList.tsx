import ArrowListItem from '@/shared/ui/ArrowListItem';
import { TabListItem } from '../model/types';

interface TabListProps {
    title: string;
    items: TabListItem[];
    onClickItem?: (item: TabListItem) => void;
    lastItemRef?: (node: HTMLDivElement | null) => void;
}

const TabList = ({ title, items, onClickItem, lastItemRef }: TabListProps) => {
    return (
        <div className='flex flex-col gap-2'>
            <span className='text-lg font-semibold'>{title}</span>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <div key={item.id} ref={isLast ? lastItemRef : undefined}>
                        <ArrowListItem
                            title={item.title}
                            subString={item.subString}
                            onClick={() => onClickItem?.(item)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default TabList;
