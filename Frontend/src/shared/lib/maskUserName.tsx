// 이름 양끝 글자 제외 * 처리
export const maskUserName = (userName: string): string => {
    if (!userName) return '';
    if (userName.length <= 2) return userName;

    const firstChar = userName.charAt(0);
    const lastChar = userName.charAt(userName.length - 1);

    const maskedMiddle = '*'.repeat(userName.length - 2);

    return `${firstChar}${maskedMiddle}${lastChar}`;
};
