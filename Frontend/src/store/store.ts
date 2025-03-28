import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import userSlice from "./Auth/authSlice.ts"

const persistConfig = {
    key: "root",
    storage
}

const combinedReducer = combineReducers({
    user: userSlice
})

const rootReducer = persistReducer(persistConfig, combinedReducer)

export const store = configureStore({
    reducer: rootReducer,
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch