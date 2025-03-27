import { Icons } from '@/shared';

interface NotiContainerProps {
    name: string;
}

const NotiContainer = ({ name }: NotiContainerProps) => {
    const userName = '강지은';

    return (
        <div className='bg-primary-500 mx-4 my-4 flex w-full items-center gap-4 rounded-lg px-5 py-3'>
            <Icons name='docs' size={36} className='fill-white' />
            <div className='gap- 1 flex flex-col text-white'>
                <p>
                    <span className='text-xl font-semibold'>
                        {userName}, {name}
                    </span>
                    <span> 을 위한</span>
                </p>
                <p>차용증 계약서를 작성하겠습니다.</p>
            </div>
        </div>
    );
};

export default NotiContainer;
