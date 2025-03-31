const ACCESS_TOKEN_KEY = 'accessToken';

// accessToken을 localStorage에 저장
export const saveAccessToken = (token: string) => {
    const pureToken = token.startsWith('Bearer ')
        ? token.replace(/^Bearer\s+/i, '')
        : token;
    localStorage.setItem(ACCESS_TOKEN_KEY, pureToken);
};

// localStorage에서 accessToken을 불러옴
export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// accessToken을 localStorage에서 제거
export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};
