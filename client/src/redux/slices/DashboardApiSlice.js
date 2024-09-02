import { apiSlice } from "./apiSlice";
const TASK_URL = "/task";

export const DashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard:builder.query({
            query: () => ({
                url: `${TASK_URL}/dashboard`,
                method: "GET",
                credentials: "include",
            })
        }),

        create:builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/create`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),
    })
})

export const { useGetDashboardQuery } = DashboardApiSlice