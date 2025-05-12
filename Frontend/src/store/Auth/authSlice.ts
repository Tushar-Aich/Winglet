import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
    _id: String;
    userName: String;
    email: String;
    OGName: String;
    bio?: String;
    avatar: String;
    coverImage: String;
    birthDate?: String;
    isVerified: Boolean;
    isPrivate: Boolean;
    lastActive: Date;
    isFirstLogin: Boolean;
}

interface UserState {
    user: User | null
    status: Boolean
}

const initialState: UserState = {
    user: null,
    status: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        storeLogin: (state, action: PayloadAction<User>) => {
            state.status = true
            state.user = action.payload
        },
        storeLogout: (state) => {
            state.status = false
            state.user = null
        }
    }
})

export const { storeLogin, storeLogout } = userSlice.actions
export default userSlice.reducer