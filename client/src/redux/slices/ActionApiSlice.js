import { apiSlice } from "./apiSlice"
const ACTION_URL = "/user";

export const actionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register:builder.mutation({
            query: (data) => ({
                url: `${ACTION_URL}/register`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),

        update:builder.mutation({
            query: (data) => ({
                url: `${ACTION_URL}/team-update`,
                method: "PUT",
                body: data,
                credentials: "include",
            })
        }),
        list:builder.query({
            query: () => ({
                url: `${ACTION_URL}/get-team`,
                method: "GET",
                credentials: "include",
            })
        }),
        dropdown:builder.query({
            query: () => ({
                url: `${ACTION_URL}/dropdown`,
                method: "GET",
                credentials: "include",
            })
        }),
        delete:builder.mutation({
            query: (id) => ({
                url: `${ACTION_URL}/${id}`,
                method: "DELETE",
                body: id,
                credentials: "include",
            })
        }),
        status:builder.mutation({
            query: (id) => ({
                url: `${ACTION_URL}/${id.id}`,
                method: "PUT",
                body: id,
                credentials: "include",
            })
        }),

        profile:builder.mutation({
            query: (data) => ({
                url: `${ACTION_URL}/profile`,
                method: "PUT",
                body: data,
                credentials: "include",
            })
        }),

        password:builder.mutation({
            query: (sandi) => ({
                url: `${ACTION_URL}/change-password`,
                method: "PUT",
                body: sandi,
                credentials: "include",
            })
        }),

        history:builder.mutation({
            query: (data) => ({
                url: `${ACTION_URL}/logs`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),
        historyDelete:builder.mutation({
            query: (data) => ({
                url: `${ACTION_URL}/delete-logs`,
                method: "DELETE",
                body: data,
                credentials: "include",
            })
        }),
    })
})

export const { useRegisterMutation, useUpdateMutation, useListQuery, useDeleteMutation, useStatusMutation, useProfileMutation , usePasswordMutation, useDropdownQuery, useHistoryMutation, useHistoryDeleteMutation } = actionApiSlice