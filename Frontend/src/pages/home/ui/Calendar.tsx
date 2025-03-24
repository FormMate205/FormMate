import { useState, useEffect } from 'react';

const Calendar = () => {
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    useEffect(() => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

        const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
        setWeekDates(dates);
    }, []);

    return (
        <div className='mb-8 flex justify-around text-xs'>
            {weekDates.map((date, idx) => (
                <div
                    key={idx}
                    className={`cursor-pointer text-center ${selectedIndex === idx ? 'bg-primary-500 h-8 w-8 rounded-full leading-8 text-white' : ''}`}
                    onClick={() => setSelectedIndex(idx)}
                >
                    {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'][idx]}
                    <p>{date.getDate()}</p>
                </div>
            ))}
        </div>
    );
};

export default Calendar;
