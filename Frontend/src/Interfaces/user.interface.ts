export interface LoginResponse {
    user: {
        _id: string;
        userName: string;
        email: string;
        OGName: string;
        bio?: string;
        avatar: string;
        coverImage?: string;
        birthDate?: string;
        isVerified: boolean;
        isPrivate: boolean;
        lastActive: string;
        isFirstLogin: boolean;
    },
    accessToken: string,
    refreshToken: string
}

export interface emailResponse {
    data: string;
    status: string;
}

export interface OTPresponse {
    email: string;
    status: string;
}

export interface SignUpResponse {
    status: string;
    user: {
        _id: string;
        userName: string;
        email: string;
        OGName: string;
        bio?: string;
        avatar: string;
        coverImage?: string;
        birthDate?: string;
        isVerified: boolean;
        isPrivate: boolean;
        lastActive: string;
        isFirstLogin: boolean;
        createdAt: string;
        updatedAt: string
    }
}

export interface GetUserResponse {
    _id: string;
    userName: string;
    email: string;
    OGName: string;
    bio?: string;
    avatar: string;
    coverImage?: string;
    birthDate?: string;
    isVerified: boolean;
    isPrivate: boolean;
    lastActive: string;
    isFirstLogin: boolean;
    createdAt: string;
    updatedAt: string;
    isFollowed: boolean;
    followersCount: number;
    followingCount: number
}

export interface SuggestedUser {
    OGName: string;
    avatar: string;
    followersCount: number;
    followingCount: number;
    isFollowed: boolean;
    userName: string;
    _id: string
}

export interface SearchUser {
    OGName: string;
    userName: string;
    avatar: string;
    _id: string
}

export interface FCMTokenResponse {
    _id: string;
    userName: string;
    email: string;
    OGName: string;
    bio?: string;
    avatar: string;
    coverImage?: string;
    birthDate?: string;
    isVerified: boolean;
    isPrivate: boolean;
    lastActive: string;
    isFirstLogin: boolean;
    createdAt: string;
    updatedAt: string;
    FCMtoken: string
}