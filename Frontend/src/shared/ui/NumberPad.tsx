interface NumberPadProps {
    onNumberClick: (num: string) => void;
    onDelete: () => void;
}

const NumberPad = ({ onNumberClick, onDelete }: NumberPadProps) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'];

    return (
        <div className='grid grid-cols-3 gap-8 text-center text-2xl'>
            {keys.map((key, index) => {
                if (key === '') {
                    return <div key={index} />;
                }

                if (key === '←') {
                    return (
                        <div
                            key={key}
                            onClick={onDelete}
                            className='cursor-pointer'
                        >
                            ←
                        </div>
                    );
                }

                return (
                    <div
                        key={key}
                        onClick={() => onNumberClick(key)}
                        className='cursor-pointer'
                    >
                        {key}
                    </div>
                );
            })}
        </div>
    );
};

export default NumberPad;
