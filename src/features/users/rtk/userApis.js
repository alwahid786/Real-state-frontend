import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl =
  import.meta.env.VITE_BASE_URL || "https://ai-scrapper-72jb.onrender.com/api";
const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        url: "/auth/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    getAllUsers: builder.query({
      query: () => "/auth/all",
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/single/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    editUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/auth/single/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} = userApis;
export default userApis;
