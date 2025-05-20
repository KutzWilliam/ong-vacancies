
export type UserType = 'user' | 'ong';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    description?: string;
    localization?: string;
    type: UserType;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        name: string;
        email: string;
        type: UserType;
    };
}