import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api";
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
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/forgetpassword",
        method: "POST",
        body: data,
      }),
    }),
    resetpassword: builder.mutation({
      query: (data) => ({
        url: "/resetpassword",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMyProfileMutation,
  useLogoutMutation,
  useForgetPasswordMutation,
  useResetpasswordMutation,
} = authApis;
export default authApis;
