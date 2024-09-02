import { apiSlice } from "./apiSlice"

const AUTH_URL = "/user";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login:builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),

        logout:builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),

        createAdmin:builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/admin`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),
    })
})

export const { useLoginMutation, useLogoutMutation, useCreateAdminMutation } = authApiSlice