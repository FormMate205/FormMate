import { useState } from 'react';
import AccountInfo from '@/pages/home/ui/AccountInfo';
import { Icons } from '@/shared';
import { ToastModal } from '@/widgets';
import ConfirmModal from '@/widgets/modal/ConfirmModal';

interface MyAccountProps {
    hasAccount: boolean;
    accountNumber?: string;
    userName?: string;
}

const MyAccount = ({ hasAccount, accountNumber, userName }: MyAccountProps) => {
    const [openAlert, setOpenAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleDelete = () => {
        setOpenAlert(true);
    };
    const handleCopy = () => {
        if (accountNumber) {
            navigator.clipboard
                .writeText(accountNumber)
                .then(() => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                })
                .catch(() => alert('복사 실패'));
        }
    };

    if (!hasAccount) return <AccountInfo />;

    return (
        <div className='relative rounded-lg bg-white p-4 shadow-sm'>
            <div className='absolute top-4 right-5 cursor-pointer'>
                <Icons name='trash' size={15} onClick={handleDelete} />
            </div>

            <p className='text-xl font-semibold'>{userName} 님</p>

            <div className='text-line-500 mt-2 flex items-center gap-1.5 text-sm'>
                <span>{accountNumber}</span>
                <Icons
                    name='copy'
                    size={12}
                    className='cursor-pointer'
                    onClick={handleCopy}
                />
            </div>

            <ToastModal isOpen={showToast} title='복사되었습니다' />

            {openAlert && (
                <div className='fixed inset-0 z-50'>
                    <ConfirmModal
                        open={openAlert}
                        onClose={() => setOpenAlert(false)}
                        onConfirm={handleDelete}
                        title='계좌를 삭제하시겠습니까?'
                        description={`삭제한 내역은 되돌릴 수 없습니다.\n새로운 계좌를 등록해야 이체 시 연동 가능합니다.`}
                    />
                </div>
            )}
        </div>
    );
};

export default MyAccount;
