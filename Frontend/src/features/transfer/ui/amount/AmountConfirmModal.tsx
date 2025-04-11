import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/shared';

interface AmountConfirmModalProps {
    inputValue: number;
    recommendAmount: number;
    partnerName: string;
    earlyRepaymentFeeRate?: number;
    onConfirm: () => void;
    disabled?: boolean;
}

const AmountConfirmModal = ({
    inputValue,
    recommendAmount,
    partnerName,
    earlyRepaymentFeeRate = 0,
    onConfirm,
    disabled = false,
}: AmountConfirmModalProps) => {
    const diff = inputValue - recommendAmount;

    const getDescription = () => {
        if (diff > 0) {
            return (
                <>
                    이번 달 상환 금액보다 <br />
                    <span className='text-primary-500'>
                        {diff.toLocaleString()}원
                    </span>
                    을 추가로 납부하려고 합니다. <br />
                    일부는 중도상환 수수료 (
                    <span className='text-primary-500'>
                        {earlyRepaymentFeeRate.toFixed(1)}%
                    </span>
                    ) 가 부과됩니다.
                </>
            );
        }
        if (diff < 0) {
            return (
                <>
                    이번 달 상환 금액보다{' '}
                    <span className='text-primary-500'>
                        {Math.abs(diff).toLocaleString()}원
                    </span>
                    이 부족합니다. <br />
                    기한 내에 납부하지 않을 경우 연체 처리되며, <br />
                    추가 이자가 부과될 수 있습니다.
                </>
            );
        }
        return (
            <>
                {partnerName}님께{' '}
                <span className='text-primary-500'>
                    {inputValue.toLocaleString()}원
                </span>
                을 송금할 예정입니다.
            </>
        );
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={disabled ? 'primaryDisabled' : 'primary'}
                    disabled={!inputValue || disabled}
                >
                    확인
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex justify-center'>
                        <Icons
                            name='exclamation'
                            size={28}
                            className='fill-primary-500'
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {getDescription()}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='text-center font-medium text-black'>
                    상환액을 송금하시겠습니까?
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        확인
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AmountConfirmModal;
