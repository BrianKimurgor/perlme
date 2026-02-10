import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "@/services/authApi";
import authReducer from "./slices/authSlice";

// create a persist config for the auth Slice
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user','token','isAuthenticated','userType']
}

//create a persist reducer for the auth slice
const persistentAuthReducer = persistReducer(authPersistConfig,authReducer);

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: persistentAuthReducer
    },
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false}).concat(authApi.middleware),
});

// export the persisted store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
