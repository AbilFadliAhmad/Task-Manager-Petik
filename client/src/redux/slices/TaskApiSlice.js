import { apiSlice } from "./apiSlice";
const TASK_URL = "/task";

export const TaskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        create:builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/create`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),

        listTask:builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/list-task`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),
        
        duplicateTask:builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/duplicate`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),
        
        deleteTask:builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/delete-restore/${data.id}?actionType=${data.action}`,
                method: "DELETE",
                body: data,
                credentials: "include",
            })
        }),

        getTask:builder.query({
            query: (data) => ({
                url: `${TASK_URL}/${data.id}`,
                method: "GET",
                credentials: "include",
            })
        }),

        updateTask:builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/update`,
                method: "PUT",
                body: data,
                credentials: "include",
            })
        }),

        postActivity: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/activity`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        })
    })
})

export const { usePostActivityMutation, useCreateMutation, useListTaskMutation, useDuplicateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation, useGetTaskQuery } = TaskApiSlice