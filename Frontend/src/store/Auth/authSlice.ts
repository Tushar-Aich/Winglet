import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
    _id: String;
    userName: String;
    email: String;
    OGName: String;
    bio?: String;
    avatar: String;
    coverImage?: String;
    birthDate?: String;
    isVerified: Boolean;
    isPrivate: Boolean;
    lastActive: String;
    isFirstLogin: Boolean;
}

interface LoginData {
    user: User;
    accessToken: string;
}

interface UserState {
    user: User | null;
    status: Boolean;
    token: string | null;
}

const initialState: UserState = {
    user: null,
    status: false,
    token: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        storeLogin: (state, action: PayloadAction<LoginData>) => {
            state.status = true;
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
        },
        storeLogout: (state) => {
            state.status = false;
            state.user = null;
            state.token = null;
        },
        updateToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        }
    }
})

export const { storeLogin, storeLogout, updateToken } = userSlice.actions
export default userSlice.reducer