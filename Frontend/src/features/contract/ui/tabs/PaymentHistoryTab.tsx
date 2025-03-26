import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PaymentItem from './PaymentItem';

const paymentList = [
    {
        date: '25.07.15',
        round: '6회차',
        amount: '-15,000원',
        tagText: '중도',
        description: '3,000원 초과',
    },
    {
        date: '25.06.15',
        round: '5회차',
        amount: '-12,000원',
        tagText: '정상',
        description: '정상납부',
    },
    {
        date: '25.05.15',
        round: '4회차',
        amount: '-12,000원',
        tagText: '정상',
        description: '정상납부',
    },
    {
        date: '25.05.15',
        round: '3회차',
        amount: '-1,000원',
        tagText: '연체',
        description: '23,000원 미납',
    },
    {
        date: '25.05.15',
        round: '2회차',
        amount: '0원',
        tagText: '연체',
        description: '12,000원 미납',
    },
    {
        date: '25.05.15',
        round: '1회차',
        amount: '12,000원',
        tagText: '정상',
        description: '정상 납부',
    },
];

const PaymentHistoryTab = () => {
    const [selectedTag, setSelectedTag] = useState('전체');

    const filteredList =
        selectedTag === '전체'
            ? paymentList
            : paymentList.filter((item) => item.tagText === selectedTag);

    return (
        <div className='flex flex-col gap-4'>
            <Select
                onValueChange={(value) => {
                    if (value === 'default') setSelectedTag('전체');
                    else if (value === 'progress') setSelectedTag('정상');
                    else if (value === 'delayed') setSelectedTag('연체');
                    else if (value === 'end') setSelectedTag('중도');
                }}
            >
                <div className='flex justify-end'>
                    <SelectTrigger className='w-20'>
                        <SelectValue placeholder='전체' />
                    </SelectTrigger>
                </div>

                <SelectContent>
                    <SelectItem value='default'>전체</SelectItem>
                    <SelectItem value='progress'>정상</SelectItem>
                    <SelectItem value='delayed'>연체</SelectItem>
                    <SelectItem value='end'>중도</SelectItem>
                </SelectContent>
            </Select>

            {filteredList.map((item, idx) => (
                <PaymentItem key={idx} {...item} />
            ))}
        </div>
    );
};

export default PaymentHistoryTab;
