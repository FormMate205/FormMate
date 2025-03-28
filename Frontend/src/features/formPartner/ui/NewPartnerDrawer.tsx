import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { FormPartner } from '@/entities/formDraft/model/types';
import useFormPartnerStore from '@/entities/formPartner/model/formPartnerStore';
import SearchListItem from '@/entities/formPartner/ui/SearchListItem';
import { maskUserName } from '@/shared/model/maskUserName';
import { useGetNewFormPartner } from '../api/formPartnerAPI';

const NewPartnerDrawer = () => {
    const navigate = useNavigate();
    const { setPartner } = useFormPartnerStore();

    // 새로운 계약 상대 검색
    const [searchValue, setSearchValue] = useState('');

    const { data } = useGetNewFormPartner(searchValue);

    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    // 계약 상대 선택
    const handleSelectPartner = (partner: FormPartner) => {
        setPartner(partner);
        navigate('/form/check');
        return;
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant={'primary'} className='w-full'>
                    새로운 계약 상대 검색하기
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className='w-full'>
                    <DrawerHeader>
                        <DrawerTitle>새로운 계약 상대 검색</DrawerTitle>
                        <DrawerDescription>
                            계약할 상대의 전화번호를 입력하세요.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className='px-4'>
                        <Input
                            variant='search'
                            placeholder="'-'를 제외하고 전화번호를 입력해주세요."
                            value={searchValue}
                            onChange={onInputValueChange}
                        />

                        {searchValue &&
                            (data ? (
                                <SearchListItem
                                    name={maskUserName(data.userName)}
                                    phonenumber={data.phoneNumber}
                                    onClick={() => handleSelectPartner(data)}
                                />
                            ) : (
                                <div className='text-line-900'>
                                    전화번호가 일치하는 사용자가 없습니다.
                                </div>
                            ))}
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant={'choiceEmpty'}>취소</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default NewPartnerDrawer;
