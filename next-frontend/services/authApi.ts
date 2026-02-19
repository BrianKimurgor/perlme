import { api } from "./api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
        query: (body) => ({
            url: "/auth/login",
            method: "POST",
            body,
        }),
        }),
        register: builder.mutation({
        query: (body) => ({
            url: "/auth/register",
            method: "POST",
            body,
        }),
        }),
        verifyEmail: builder.mutation({
            query: (body) => ({
                url: "/auth/verify-email",
                method: "PUT",
                body: {
                    email: body.email,
                    confirmationCode: body.confirmationCode 
                },
            })
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useVerifyEmailMutation } = authApi;
