import { Icons } from '@/shared';

interface FunnelHeaderProps {
    title: string;
    onBack?: () => void;
}

const FunnelHeader = ({ title, onBack }: FunnelHeaderProps) => {
    return (
        <div className='flex w-full items-center justify-between px-4 py-4'>
            <div className='flex items-center gap-3'>
                {onBack && (
                    <button aria-label='뒤로가기' onClick={onBack}>
                        <Icons
                            name='chev-left'
                            size={18}
                            className='fill-line-700'
                        />
                    </button>
                )}
                <p className='font-semibold'>{title}</p>
            </div>
        </div>
    );
};

export default FunnelHeader;
