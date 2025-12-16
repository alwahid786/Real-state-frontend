import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl =
  import.meta.env.VITE_BASE_URL || "https://ai-scrapper-72jb.onrender.com/api";
const authApis = createApi({
  reducerPath: "authApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BaseUrl}/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    getMyProfile: builder.mutation({
      query: () => ({
        url: "/myProfile",
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMyProfileMutation, useLogoutMutation } =
  authApis;
export default authApis;
