import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import { Post } from "./PostsApi";

// -------------------- TYPES --------------------
export interface ExploreUser {
    id: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    age?: number;
    distance?: number;
    _count?: {
        followers: number;
        posts: number;
    };
}

export interface RecommendationResponse {
    posts?: Post[];
    users?: ExploreUser[];
}

// -------------------- API --------------------
export const exploreApi = createApi({
    reducerPath: "exploreApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Explore", "Recommendations"],

    endpoints: (builder) => ({
        // Explore public content
        explore: builder.query<RecommendationResponse, void>({
            query: () => "discover/explore",
            providesTags: ["Explore"],
        }),

        // Get personalized recommendations (requires auth)
        getRecommendations: builder.query<RecommendationResponse, void>({
            query: () => "discover/recommendations",
            transformResponse: (response: any) => ({
                users: Array.isArray(response.data) ? response.data : [],
                posts: []
            }),
            providesTags: ["Recommendations"],
        }),
    }),
});

// -------------------- HOOKS --------------------
export const { useExploreQuery, useGetRecommendationsQuery } = exploreApi;
