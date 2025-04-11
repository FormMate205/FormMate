export interface User {
    id: string;
    userName: string;
    email: string;
    isLogged: boolean;
    hasAccount: boolean;
}

export interface UserDetail {
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    addressDetail?: string;
    provider?: string;
}
