import StatusSummaryItem from './StatusSummaryItem';

const summaryData = [
    { label: '진행', value: '3' },
    { label: '갚을', value: '2', colorClass: 'text-primary-500' },
    { label: '받을', value: '1', colorClass: 'text-primary-500' },
    {
        label: '종료',
        value: '10',
        colorClass: 'text-line-300',
        isBorder: false,
    },
];

const StatusSummary = () => {
    return (
        <section className='flex rounded-lg bg-white py-3'>
            <div className='flex w-full text-center'>
                {summaryData.map((item, idx) => (
                    <StatusSummaryItem
                        key={idx}
                        label={item.label}
                        value={item.value}
                        colorClass={item.colorClass}
                        isBorder={item.isBorder !== false}
                    />
                ))}
            </div>
        </section>
    );
};

export default StatusSummary;
