// src/store/baseQueryWithReauth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "./AuthSlice";
import type { RootState } from "./index";

// Simple flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const baseQuery = fetchBaseQuery({
    baseUrl: "http://192.168.88.113:3000/api/",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        console.log("🔄 Token expired, attempting refresh...");

        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const refreshToken = await AsyncStorage.getItem("refreshToken");

                if (refreshToken) {
                    console.log("📤 Sending refresh token request...");

                    const refreshResult = await baseQuery(
                        {
                            url: "auth/refresh",
                            method: "POST",
                            body: { refreshToken },
                        },
                        api,
                        extraOptions
                    );

                    if (refreshResult.data) {
                        const data = refreshResult.data as {
                            accessToken: string;
                            refreshToken: string;
                            user: any;
                        };

                        console.log("✅ Token refreshed successfully");

                        // Store the new tokens
                        const state = api.getState() as RootState;
                        api.dispatch(
                            setCredentials({
                                token: data.accessToken,
                                user: state.auth.user || data.user,
                            })
                        );

                        await AsyncStorage.setItem("token", data.accessToken);
                        await AsyncStorage.setItem("refreshToken", data.refreshToken);

                        // Notify all waiting requests
                        onTokenRefreshed(data.accessToken);

                        // Retry the original request with new token
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        console.error("❌ Token refresh failed, logging out");
                        api.dispatch(logout());
                        await AsyncStorage.clear();
                    }
                } else {
                    console.error("❌ No refresh token available, logging out");
                    api.dispatch(logout());
                    await AsyncStorage.clear();
                }
            } finally {
                isRefreshing = false;
            }
        } else {
            // Wait for the token refresh to complete
            await new Promise<string>((resolve) => {
                subscribeTokenRefresh((token) => {
                    resolve(token);
                });
            });

            // Retry with new token
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};
