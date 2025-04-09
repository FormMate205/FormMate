import now from 'lodash/now';

export const convertTime = (lastMessageTime: string[]) => {
    const current = new Date(now());

    // 현재 날짜 정보
    const curYear = current.getFullYear();
    const curMonth = current.getMonth() + 1;
    const curDay = current.getDate();

    // lastMessageTime의 년,월,일,시,분
    const msgYear = Number(lastMessageTime[0]);
    const msgMonth = Number(lastMessageTime[1]);
    const msgDay = Number(lastMessageTime[2]);
    const msgHour = Number(lastMessageTime[3]);
    const msgMinute = Number(lastMessageTime[4]);

    // 어제 날짜 계산
    const yesterday = new Date(current);
    yesterday.setDate(curDay - 1);
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = yesterday.getMonth() + 1;
    const yesterdayDay = yesterday.getDate();

    // 같은 날짜인지 확인
    if (curYear === msgYear && curMonth === msgMonth && curDay === msgDay) {
        const period = msgHour < 12 ? '오전' : '오후';
        const hour = msgHour <= 12 ? msgHour : msgHour - 12;
        const displayHour = hour === 0 ? 12 : hour;
        const displayMinute = String(msgMinute).padStart(2, '0');
        return `${period} ${displayHour}:${displayMinute}`;
    }

    // 어제 날짜인지 확인
    if (
        yesterdayYear === msgYear &&
        yesterdayMonth === msgMonth &&
        yesterdayDay === msgDay
    ) {
        return '어제';
    }

    // 같은 년도인지 확인
    if (curYear === msgYear) {
        return `${msgMonth}월 ${msgDay}일`;
    }

    // 이전 년도일 경우
    return `${msgYear}년 ${msgMonth}월 ${msgDay}일`;
};
