import { api } from "./api";

interface Profile {
    id: string
    name: string
    age: number
    bio: string
    photos: string[]
    distance: number
    interests: string[]
    location: string
    verified: boolean
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get discover/recommendations
        getDiscoverProfiles: builder.query<Profile[], void>({
            query: () => '/api/discover',
        }),
        
        // Like a user
        likeUser: builder.mutation({
            query: (userId: string) => ({
                url: `/api/users/${userId}/like`,
                method: 'POST',
            }),
        }),
        
        // Reject a user
        rejectUser: builder.mutation({
            query: (userId: string) => ({
                url: `/api/users/${userId}/reject`,
                method: 'POST',
            }),
        }),
    
        // Get user stats
        getUserStats: builder.query({
            query: () => '/api/users/stats',
        }),
    }),
})

export const {
    useGetDiscoverProfilesQuery,
    useLikeUserMutation,
    useRejectUserMutation,
    useGetUserStatsQuery,
} = userApi;