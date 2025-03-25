interface ToastModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
}

const ToastModal = ({ isOpen, title, description }: ToastModalProps) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20'>
            <div className='flex items-center gap-2 rounded-lg bg-white px-6 py-4 shadow-lg'>
                {/* ✓ 아이콘 */}
                <span className='text-primary-500 text-2xl'>✓</span>
                {/* 텍스트 */}
                <div className='text-base font-semibold'>{title}</div>
                {/* 서브 텍스트 (옵션) */}
                {description && (
                    <p className='text-line-500 mt-2 text-sm whitespace-pre-wrap'>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ToastModal;
