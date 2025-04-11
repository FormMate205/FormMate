interface AmountShortcutsProps {
    onClick: (amount: number) => void;
}

const shortcuts = [10000, 50000, 100000, 500000];

const AmountShortcuts = ({ onClick }: AmountShortcutsProps) => {
    return (
        <div className='flex justify-between px-3'>
            {shortcuts.map((amt) => (
                <div
                    key={amt}
                    className='bg-line-100 cursor-pointer rounded-2xl px-4 py-2'
                    onClick={() => onClick(amt)}
                >
                    + {(amt / 10000).toFixed(0)}만
                </div>
            ))}
        </div>
    );
};

export default AmountShortcuts;
