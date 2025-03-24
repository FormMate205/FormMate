import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icons } from '@/shared';

interface EarlyTerminateAlertProps {
    onConfirm: () => void;
}

const EarlyTerminateAlert = ({ onConfirm }: EarlyTerminateAlertProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className='cursor-pointer border-b'>계약 조기 종료</div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle />
                    <div className='flex justify-center'>
                        <Icons
                            name='exclamation'
                            size={28}
                            className='fill-primary-500'
                        />
                    </div>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    조기 종료는{' '}
                    <span className='text-primary-500'>상호 동의 하에만</span>{' '}
                    이루어집니다. <br />
                    조기 종료 시,{' '}
                    <span className='text-primary-500'>미납 금액 52,000원</span>
                    은 상환 의무가 사라집니다.
                </AlertDialogDescription>

                {/* ✅ 추가 설명은 따로 아래에서 처리 (레이아웃 가능) */}
                <div className='m-2 text-center font-medium text-black'>
                    상대에게 조기 종료를 신청하시겠습니까?
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>아니오</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        예
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EarlyTerminateAlert;
