export interface User {
    userId: number;
    isLogin: boolean;
    session: string;
    isSessionTokenActive: boolean;
}