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
            query: () => 'discover/recommendations',
            transformResponse: (response: any) => {
                const users = Array.isArray(response?.data) ? response.data : [];
                return users.map((user: any) => ({
                    id: user.id,
                    name: user.username || 'Unknown',
                    age: user.age || 0,
                    bio: user.bio || '',
                    photos: user.photos || [],
                    distance: user.distance || 0,
                    interests: user.interests || [],
                    location: user.location || '',
                    verified: !!user.isVerified,
                }));
            },
        }),
        
        // Right swipe -> follow user
        likeUser: builder.mutation({
            query: (userId: string) => ({
                url: `users/${userId}/follow`,
                method: 'POST',
            }),
        }),
        
        // Left swipe -> record pass as a benign status check (no follow action)
        rejectUser: builder.mutation({
            query: (userId: string) => ({
                url: `users/${userId}/status`,
                method: 'GET',
            }),
        }),
    
        // Lightweight placeholder stats endpoint until dedicated stats route exists
        getUserStats: builder.query({
            query: () => 'discover/recommendations',
        }),
    }),
})

export const {
    useGetDiscoverProfilesQuery,
    useLikeUserMutation,
    useRejectUserMutation,
    useGetUserStatsQuery,
} = userApi;