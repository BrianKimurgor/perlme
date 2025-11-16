import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
// import other reducers if any

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
