import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AccountInfo } from '@/features/account/model/types';
import { Icons } from '@/shared';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { ToastModal } from '@/widgets';

interface AccountSummaryProps {
    accountInfo: AccountInfo;
    onTransfer: () => void;
}

const AccountSummary = ({ accountInfo, onTransfer }: AccountSummaryProps) => {
    const { bankName, accountNumber, accountBalance } = accountInfo;
    const [showToast, setShowToast] = useState(false);
    // 계좌번호 복사
    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className='flex flex-col gap-7 px-2'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-1'>
                    <span className='text-line-500 font-medium'>
                        {bankName} {accountNumber}
                    </span>
                    <Icons
                        name='copy'
                        size={14}
                        className='fill-line-500 cursor-pointer'
                        onClick={handleCopy}
                    />
                </div>
                <div className='text-4xl font-semibold'>
                    {formatCurrency(accountBalance ?? 0)}
                </div>
            </div>
            <Button variant='primary' onClick={onTransfer}>
                송금하기
            </Button>
            {showToast && (
                <ToastModal
                    isOpen={showToast}
                    title='계좌번호가 복사되었습니다'
                />
            )}
        </div>
    );
};

export default AccountSummary;
