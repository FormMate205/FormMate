import { Button } from '../../../components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from '../../../components/ui/drawer';

const FilterDrawer = () => {
    <Drawer>
        <DrawerTrigger className='flex w-full justify-end'>
            <span>1개월•전체•최신순</span>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader></DrawerHeader>
            <div>거래 기간</div>
            <DrawerFooter>
                <Button>확인</Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>;
};

export default FilterDrawer;
