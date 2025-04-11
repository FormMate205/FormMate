import { useUserStore } from '@/entities/user/model/userStore';
import { Icons } from '@/shared';

interface NotiContainerProps {
    name: string;
}

const NotiContainer = ({ name }: NotiContainerProps) => {
    const { user } = useUserStore();

    return (
        <div className='bg-primary-50 border-primary-400 mx-4 my-4 flex w-full flex-col items-center gap-2 rounded-lg border px-5 py-3'>
            <div className='flex w-full items-start gap-2'>
                <Icons
                    name='docs'
                    size={24}
                    className='fill-primary-500 mt-1'
                />
                <div className='text-line-950 flex flex-col gap-1'>
                    <p className='flex items-end gap-1'>
                        <span className='text-xl font-semibold'>
                            {user?.userName}, {name}
                        </span>
                        <span>차용증 초안 생성</span>
                    </p>
                    <p>차용증 수정은 초안 생성 후 가능합니다.</p>
                </div>
            </div>
        </div>
    );
};

export default NotiContainer;
