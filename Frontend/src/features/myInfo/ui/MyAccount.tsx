import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
import { deleteAccount } from '@/entities/account/api/deleteAccount';
import { useAccountStore } from '@/entities/account/model/accountStore';
import { useUserStore } from '@/entities/user/model/userStore';
import { Icons } from '@/shared';
import { ToastModal } from '@/widgets';
import ConfirmModal from '@/widgets/modal/ConfirmModal';

const MyAccount = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userName = useUserStore((state) => state.user?.userName ?? '사용자');
    const { clearAccount, setAccountInfo } = useAccountStore();
    const { data: accountInfo } = useGetAccountInfo();
    const [openAlert, setOpenAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { setHasAccount } = useUserStore();

    useEffect(() => {
        if (accountInfo) {
            setAccountInfo({
                hasAccount: true,
                bankName: accountInfo.bankName,
                accountNumber: accountInfo.accountNumber,
            });
        }
    }, [accountInfo, setAccountInfo]);

    const { mutate: handleDeleteAccount } = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            console.log('삭제 성공!');
            setHasAccount(false);
            setOpenAlert(false);
            clearAccount();
            queryClient.invalidateQueries({ queryKey: ['accountInfo'] });
            window.location.href = '/myinfo';
        },
        onError: (err) => {
            console.error('계좌 삭제 실패:', err);
            alert('계좌 삭제에 실패했습니다. 다시 시도해주세요.');
        },
    });

    const handleDelete = () => {
        setOpenAlert(true);
    };

    const handleConfirmDelete = () => {
        console.log('삭제 확인 클릭함');
        handleDeleteAccount();
    };

    const bankData = accountInfo;

    const handleCopy = () => {
        const fullAccount =
            bankData?.bankName && bankData?.accountNumber
                ? `${bankData.bankName} ${bankData.accountNumber}`
                : '';
        if (fullAccount) {
            navigator.clipboard
                .writeText(fullAccount)
                .then(() => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                })
                .catch(() => alert('복사 실패'));
        }
    };

    if (!accountInfo) {
        return (
            <div className='relative rounded-lg bg-white p-4 shadow-sm'>
                <div className='absolute right-5 my-auto cursor-pointer'>
                    <Button
                        variant='primary'
                        className='px-4'
                        onClick={() => navigate(`/account`)}
                    >
                        계좌 등록
                    </Button>
                </div>

                <p className='text-xl font-semibold'>{userName}</p>

                <div className='text-line-500 mt-1 flex items-center gap-1.5 text-sm'>
                    <span>등록된 계좌가 없어요</span>
                </div>
            </div>
        );
    } else {
        return (
            <div className='relative rounded-lg bg-white p-4 shadow-sm'>
                <div className='absolute top-4 right-5 cursor-pointer'>
                    <Icons name='trash' size={15} onClick={handleDelete} />
                </div>

                <p className='text-xl font-semibold'>{userName} 님</p>

                <div className='text-line-500 mt-2 flex items-center gap-1.5 text-sm'>
                    <span>{`${accountInfo.bankName} ${accountInfo.accountNumber}`}</span>
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
                            onConfirm={handleConfirmDelete}
                            title='계좌를 삭제하시겠습니까?'
                            description={`삭제한 내역은 되돌릴 수 없습니다.\n새로운 계좌를 등록해야 이체 시 연동 가능합니다.`}
                        />
                    </div>
                )}
            </div>
        );
    }
};

export default MyAccount;
