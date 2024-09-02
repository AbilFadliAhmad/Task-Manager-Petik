import { apiSlice } from "./apiSlice";
const NOTIF_URL = "/user"

export const NotificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotif:builder.query({
            query: () => ({
                url: `${NOTIF_URL}/notifications`,
                method: "GET",
                credentials: "include",
            })
        }),
        markNotif:builder.mutation({
            query: (data) => ({
                url: `${NOTIF_URL}/read-noti`,
                method: "PUT",
                body: data,
                credentials: "include",
            })
        }),
        sendNotification:builder.mutation({
            query: (data) => ({
                url: `${NOTIF_URL}/pemberitahuan`,
                method: "POST",
                body: data,
                credentials: "include",
            })
        }),
    })
})
export const {useGetNotifQuery, useMarkNotifMutation, useSendNotificationMutation } = NotificationApiSlice