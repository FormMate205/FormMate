import { useState } from 'react';

const Calendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거 (날짜만 비교)

    // 이번 주 월요일
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    // 이번 주 날짜 배열
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    // 오늘이 몇 번째 index인지 계산해서 초기 선택
    const todayIndex = weekDates.findIndex(
        (date) =>
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth(),
    );

    const [selectedIndex, setSelectedIndex] = useState(todayIndex);

    return (
        <div className='mb-6 rounded-lg bg-white px-2'>
            <div className='flex justify-between'>
                {weekDates.map((date, idx) => (
                    <div
                        key={idx}
                        className={`cursor-pointer items-center px-2 py-2 text-center ${
                            selectedIndex === idx
                                ? 'bg-primary-500 rounded-full text-white'
                                : ''
                        }`}
                        onClick={() => setSelectedIndex(idx)}
                    >
                        <p>{date.getDate()}</p>
                        <p className='text-xs'>
                            {date.toLocaleDateString('ko-KR', {
                                weekday: 'short',
                            })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
