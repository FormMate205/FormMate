const ACCESS_TOKEN_KEY = 'accessToken';

// accessToken 저장
export const setAccessToken = (token: string) => {
    const formattedToken = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    localStorage.setItem(ACCESS_TOKEN_KEY, formattedToken);
};

// accessToken 유효성 검사
export const isTokenValid = (): boolean => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return false;

    try {
        const tokenParts = token.split(' ');
        const jwtToken = tokenParts.length > 1 ? tokenParts[1] : tokenParts[0];
        const payload = JSON.parse(atob(jwtToken.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};
