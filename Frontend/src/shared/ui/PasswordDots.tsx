interface PasswordDotsProps {
    inputValue: string;
    length?: number; // 기본값 6
}

const PasswordDots = ({ inputValue, length = 6 }: PasswordDotsProps) => {
    return (
        <div className='mt-10 mb-8 flex justify-center gap-3'>
            {[...Array(length)].map((_, idx) => (
                <div
                    key={idx}
                    className={`h-8 w-8 border-b-[1.4px] text-center text-2xl font-semibold ${
                        inputValue[idx]
                            ? 'border-primary-500'
                            : 'border-line-200'
                    }`}
                >
                    {inputValue[idx] ? '•' : ''}
                </div>
            ))}
        </div>
    );
};

export default PasswordDots;
