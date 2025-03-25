import { Fragment } from 'react/jsx-runtime';

const summaryData = [
    {
        label: '대기',
        value: '2',
        className: 'border-line-300',
    },
    {
        label: '진행',
        value: '10',
        className: 'border-primary-500 text-primary-500 border',
    },
    {
        label: '완료',
        value: '5',
        className: 'bg-line-50 text-line-500 border-line-300',
    },
];

const StatusSummary = () => {
    return (
        <section className='flex rounded-lg bg-white px-10 py-4'>
            <div className='text-line-700 flex flex-1 items-center justify-center gap-2 text-center font-semibold'>
                {summaryData.map((item, index) => (
                    <Fragment key={item.label}>
                        <div className='flex flex-1 flex-col items-center gap-2'>
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-lg border-[1.5px] text-center ${item.className}`}
                            >
                                {item.value}
                            </div>
                            <span>{item.label}</span>
                        </div>

                        {index < summaryData.length - 1 && (
                            <div className='flex h-full flex-1'>
                                <div className='bg-line-300 mt-7 flex h-0.5 flex-1 justify-center'></div>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </section>
    );
};

export default StatusSummary;
