import { Button } from '@/components/ui/button';
import { AccountInfo } from '@/features/account/model/types';
import { Icons } from '@/shared';

interface AccountSummaryProps {
    accountInfo: AccountInfo;
    onTransfer: () => void;
}

const AccountSummary = ({ accountInfo, onTransfer }: AccountSummaryProps) => {
    const { bankName, accountNumber, balance } = accountInfo;
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
                        onClick={() => {
                            navigator.clipboard.writeText(accountNumber);
                        }}
                    />
                </div>
                <div className='text-4xl font-semibold'>{balance} 원</div>
            </div>
            <Button variant='primary' onClick={onTransfer}>
                송금하기
            </Button>
        </div>
    );
};

export default AccountSummary;
