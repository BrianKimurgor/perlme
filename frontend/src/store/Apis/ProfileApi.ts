import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// ─── Enums ────────────────────────────────────────────────────────────────────
export type Pronouns = "HE_HIM" | "SHE_HER" | "THEY_THEM" | "OTHER";
export type RelationshipIntention =
    | "MARRIAGE"
    | "LONG_TERM"
    | "LONG_TERM_OPEN_SHORT"
    | "SHORT_TERM_OPEN_LONG"
    | "CASUAL"
    | "FRIENDSHIP"
    | "FIGURING_OUT";
export type HasChildren = "YES" | "NO";
export type WantsChildren = "WANT" | "DONT_WANT" | "NOT_SURE";
export type Smoking = "NON_SMOKER" | "OCCASIONALLY" | "SMOKER";
export type Drinking = "NEVER" | "SOCIALLY" | "REGULARLY";
export type FitnessLevel = "VERY_ACTIVE" | "MODERATELY_ACTIVE" | "NOT_ACTIVE";
export type EducationLevel = "HIGH_SCHOOL" | "COLLEGE" | "BACHELORS" | "MASTERS" | "PHD";
export type DistancePreference = "KM_10" | "KM_50" | "KM_100" | "GLOBAL";
export type GenderOption = "MALE" | "FEMALE" | "NON_BINARY" | "OTHER";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Language {
    id: string;
    name: string;
    code: string;
}

export interface PersonalityTrait {
    id: string;
    name: string;
}

export interface Interest {
    id: string;
    name: string;
}

export interface DiscoveryPreferences {
    minAge: number;
    maxAge: number;
    distanceKm: number | null;
    distancePreference: DistancePreference;
    showLocation: boolean;
}

export interface FullProfile {
    id: string;
    username: string;
    email: string;
    bio: string | null;
    avatarUrl: string | null;
    coverPhotoUrl: string | null;
    gender: string | null;
    orientation: string | null;
    pronouns: Pronouns | null;
    relationshipIntention: RelationshipIntention | null;
    hasChildren: HasChildren | null;
    wantsChildren: WantsChildren | null;
    smoking: Smoking | null;
    drinking: Drinking | null;
    fitnessLevel: FitnessLevel | null;
    educationLevel: EducationLevel | null;
    occupation: string | null;
    industry: string | null;
    ethnicity: string | null;
    isVerified: boolean;
    isPhoneVerified: boolean;
    isPhotoVerified: boolean;
    profileCompletedAt: string | null;
    location: {
        country: string | null;
        city: string | null;
        visibility: string;
    } | null;
    interests: { interest: { id: string; name: string } }[];
    languages: { language: Language }[];
    personalityTraits: { trait: PersonalityTrait }[];
    discoveryPreferences: DiscoveryPreferences | null;
    interestedIn: { gender: GenderOption }[];
}

// ─── Request types ────────────────────────────────────────────────────────────
export interface SetLocationRequest {
    country: string;
    city: string;
}

export interface UpdateProfileRequest {
    bio?: string;
    pronouns?: Pronouns;
    relationshipIntention?: RelationshipIntention;
    hasChildren?: HasChildren;
    wantsChildren?: WantsChildren;
    smoking?: Smoking;
    drinking?: Drinking;
    fitnessLevel?: FitnessLevel;
    educationLevel?: EducationLevel;
    occupation?: string;
    industry?: string;
    ethnicity?: string;
    gender?: GenderOption;
    orientation?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Profile", "Languages", "Traits", "Interests"],

    endpoints: (builder) => ({
        // GET /api/profile/me
        getMyProfile: builder.query<FullProfile, void>({
            query: () => "profile/me",
            providesTags: ["Profile"],
            transformResponse: (response: any) => response.data,
        }),

        // GET /api/profile/:userId
        getUserProfile: builder.query<FullProfile, string>({
            query: (userId) => `profile/${userId}`,
            providesTags: (_r, _e, userId) => [{ type: "Profile", id: userId }],
            transformResponse: (response: any) => response.data,
        }),

        // PATCH /api/profile/me
        updateProfile: builder.mutation<FullProfile, UpdateProfileRequest>({
            query: (data) => ({ url: "profile/me", method: "PATCH", body: data }),
            invalidatesTags: ["Profile"],
            transformResponse: (response: any) => response.data,
        }),

        // PUT /api/profile/me/languages
        setLanguages: builder.mutation<void, string[]>({
            query: (languageIds) => ({
                url: "profile/me/languages",
                method: "PUT",
                body: { languageIds },
            }),
            invalidatesTags: ["Profile"],
        }),

        // PUT /api/profile/me/personality
        setPersonalityTraits: builder.mutation<void, string[]>({
            query: (traitIds) => ({
                url: "profile/me/personality",
                method: "PUT",
                body: { traitIds },
            }),
            invalidatesTags: ["Profile"],
        }),

        // PUT /api/profile/me/interested-in
        setInterestedIn: builder.mutation<void, GenderOption[]>({
            query: (genders) => ({
                url: "profile/me/interested-in",
                method: "PUT",
                body: { genders },
            }),
            invalidatesTags: ["Profile"],
        }),

        // PUT /api/profile/me/discovery-preferences
        setDiscoveryPreferences: builder.mutation<DiscoveryPreferences, Partial<DiscoveryPreferences>>({
            query: (data) => ({
                url: "profile/me/discovery-preferences",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Profile"],
            transformResponse: (response: any) => response.data,
        }),

        // GET /api/profile/languages
        getLanguages: builder.query<Language[], void>({
            query: () => "profile/languages",
            providesTags: ["Languages"],
            transformResponse: (response: any) => response.data,
        }),

        // GET /api/profile/personality-traits
        getPersonalityTraits: builder.query<PersonalityTrait[], void>({
            query: () => "profile/personality-traits",
            providesTags: ["Traits"],
            transformResponse: (response: any) => response.data,
        }),

        // GET /api/profile/interests
        getInterests: builder.query<Interest[], void>({
            query: () => "profile/interests",
            providesTags: ["Interests"],
            transformResponse: (response: any) => response.data,
        }),

        // PUT /api/profile/me/interests
        setInterests: builder.mutation<void, string[]>({
            query: (interestIds) => ({
                url: "profile/me/interests",
                method: "PUT",
                body: { interestIds },
            }),
            invalidatesTags: ["Profile"],
        }),

        // PUT /api/profile/me/location
        setLocation: builder.mutation<void, SetLocationRequest>({
            query: (data) => ({ url: "profile/me/location", method: "PUT", body: data }),
            invalidatesTags: ["Profile"],
        }),

        // POST /api/profile/me/phone/request-otp
        requestPhoneOtp: builder.mutation<{ message: string; devCode?: string }, { phoneNumber: string }>({
            query: (data) => ({
                url: "profile/me/phone/request-otp",
                method: "POST",
                body: data,
            }),
        }),

        // POST /api/profile/me/phone/verify
        verifyPhoneOtp: builder.mutation<{ message: string }, { code: string }>({
            query: (data) => ({
                url: "profile/me/phone/verify",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetMyProfileQuery,
    useGetUserProfileQuery,
    useUpdateProfileMutation,
    useSetLanguagesMutation,
    useSetPersonalityTraitsMutation,
    useSetInterestedInMutation,
    useSetDiscoveryPreferencesMutation,
    useGetLanguagesQuery,
    useGetPersonalityTraitsQuery,
    useGetInterestsQuery,
    useSetInterestsMutation,
    useSetLocationMutation,
    useRequestPhoneOtpMutation,
    useVerifyPhoneOtpMutation,
} = profileApi;
