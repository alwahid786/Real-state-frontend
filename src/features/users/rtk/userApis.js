import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl =
  import.meta.env.VITE_BASE_URL || "https://ai-scrapper-72jb.onrender.com/api";
const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        url: "/auth/create",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateUserMutation } = userApis;
export default userApis;
