
import authReducer from "@/src/store/AuthSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { authApi } from "./Apis/AuthApi";
import { blocksApi } from "./Apis/BlocksApi";
import { exploreApi } from "./Apis/ExploreApi";
import { groupsApi } from "./Apis/GroupsApi";
import { messagesApi } from "./Apis/MessagesApi";
import { notificationsApi } from "./Apis/NotificationsApi";
import { postsApi } from "./Apis/PostsApi";
import { profileApi } from "./Apis/ProfileApi";
import { usersApi } from "./Apis/UsersApi";
import { vibesApi } from "./Apis/VibesApi";
import themeReducer from "./themeSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [exploreApi.reducerPath]: exploreApi.reducer,
  [blocksApi.reducerPath]: blocksApi.reducer,
  [groupsApi.reducerPath]: groupsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [vibesApi.reducerPath]: vibesApi.reducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // persist auth slice only
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // important for redux-persist
    }).concat(
      authApi.middleware,
      postsApi.middleware,
      messagesApi.middleware,
      usersApi.middleware,
      exploreApi.middleware,
      blocksApi.middleware,
      groupsApi.middleware,
      profileApi.middleware,
      notificationsApi.middleware,
      vibesApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
