interface NumberPadProps {
    onNumberClick: (num: string) => void;
    onDelete: () => void;
}

const keyPadItems = [
    { label: '1', type: 'number' },
    { label: '2', type: 'number' },
    { label: '3', type: 'number' },
    { label: '4', type: 'number' },
    { label: '5', type: 'number' },
    { label: '6', type: 'number' },
    { label: '7', type: 'number' },
    { label: '8', type: 'number' },
    { label: '9', type: 'number' },
    { label: '', type: 'empty' },
    { label: '0', type: 'number' },
    { label: '←', type: 'delete' },
];

const NumberPad = ({ onNumberClick, onDelete }: NumberPadProps) => {
    return (
        <div className='grid grid-cols-3 gap-8 text-center text-2xl'>
            {keyPadItems.map((item, index) => {
                if (item.type === 'empty') {
                    return <div key={`empty-${index}`} />;
                }

                if (item.type === 'delete') {
                    return (
                        <div
                            key={`delete`}
                            onClick={onDelete}
                            className='cursor-pointer'
                        >
                            {item.label}
                        </div>
                    );
                }

                return (
                    <div
                        key={`num-${item.label}`}
                        onClick={() => onNumberClick(item.label)}
                        className='cursor-pointer'
                    >
                        {item.label}
                    </div>
                );
            })}
        </div>
    );
};

export default NumberPad;
