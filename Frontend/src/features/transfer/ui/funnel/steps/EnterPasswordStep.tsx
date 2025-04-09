import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import NumberPad from '@/shared/ui/NumberPad';
import PasswordDots from '@/shared/ui/PasswordDots';

type EnterPasswordStepProps = {
    onConfirm: (password: string) => void;
    onReset?: () => void;
};

const EnterPasswordStep = ({ onConfirm, onReset }: EnterPasswordStepProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleNumberClick = (num: string) => {
        if (inputValue.length >= 6) return;
        const newValue = inputValue + num;
        setInputValue(newValue);
        if (newValue.length === 6) {
            onConfirm(newValue);
        }
    };

    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    const handleConfirm = () => {
        onConfirm(inputValue);
    };

    useEffect(() => {
        if (onReset) {
            setInputValue('');
        }
    }, [onReset]);

    return (
        <div className='relative flex h-full flex-col justify-between px-4 py-2'>
            <div className='flex flex-col justify-center p-6'>
                <div className='mb-4 flex items-center'>
                    <span className='flex-1 text-center text-xl font-semibold'>
                        결제 비밀번호를 입력하세요
                    </span>
                </div>
                <PasswordDots inputValue={inputValue} />
            </div>
            <div className='sticky bottom-0 left-0 mx-auto flex w-full max-w-[640px] flex-col gap-6 pb-6'>
                <NumberPad
                    onDelete={handleDelete}
                    onNumberClick={handleNumberClick}
                />
                <Button
                    variant='primary'
                    onClick={handleConfirm}
                    disabled={inputValue.length !== 6}
                >
                    확인
                </Button>
            </div>
        </div>
    );
};

export default EnterPasswordStep;
