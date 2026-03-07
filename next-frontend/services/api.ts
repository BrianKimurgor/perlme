import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const normalizeBaseUrl = (rawBaseUrl?: string) => {
    const fallback = "http://localhost:5000";
    const base = (rawBaseUrl || fallback).replace(/\/+$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL),
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["User"],
    endpoints: () => ({}),
});
