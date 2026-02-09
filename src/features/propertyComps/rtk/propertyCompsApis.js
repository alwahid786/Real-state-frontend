import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const propertyCompsApis = createApi({
  reducerPath: "propertyCompsApis",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state or localStorage
      const state = getState();
      const token =
        state?.auth?.user?.token ||
        state?.auth?.user?.accessToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Property", "Analysis", "Comparable", "ImageAnalysis"],
  endpoints: (builder) => ({
    // Search for-sale properties
    searchProperties: builder.mutation({
      query: (searchParams) => ({
        url: "/property/searchproperties",
        method: "POST",
        body: searchParams,
      }),
      invalidatesTags: ["Property"],
    }),

    // Search property by address (NEW - uses APIFY_ZILLOW_ACTOR_ID)
    searchPropertyByAddress: builder.mutation({
      query: ({ address }) => ({
        url: "/property/search-by-address",
        method: "POST",
        body: { address },
      }),
      invalidatesTags: ["Property"],
    }),

    // Fetch full property details with all images
    fetchPropertyDetails: builder.mutation({
      query: ({ propertyId, propertyUrl, zpid }) => ({
        url: "/property/fetch-details",
        method: "POST",
        body: { propertyId, propertyUrl, zpid },
      }),
      invalidatesTags: ["Property"],
    }),

    // Find sold comparables for a property (NEW - Step 1 of new workflow)
    findComparables: builder.mutation({
      query: ({ propertyId, timeWindowMonths = 12, maxResults = 1000, propertyData }) => ({
        url: `/comps/find/${propertyId}`,
        method: "POST",
        body: { timeWindowMonths, maxResults, propertyData },
      }),
      invalidatesTags: ["Comparable"],
    }),

    // Analyze selected comps (NEW - Step 2 of new workflow, primary endpoint)
    analyzeSelectedComps: builder.mutation({
      query: ({ propertyId, selectedCompIds, maoInputs }) => ({
        url: "/comps/analyze-selected",
        method: "POST",
        body: { propertyId, selectedCompIds, maoInputs },
      }),
      invalidatesTags: ["Analysis", "Comparable", "ImageAnalysis"],
    }),

    // Analyze property by ID (DEPRECATED - kept for backward compatibility)
    analyzePropertyById: builder.mutation({
      query: ({ propertyId, images, maoInputs }) => ({
        url: `/comps/analyze/${propertyId}`,
        method: "POST",
        body: { images, maoInputs },
      }),
      invalidatesTags: ["Analysis", "Comparable", "ImageAnalysis"],
    }),

    // Analyze property by address (DEPRECATED - kept for backward compatibility)
    analyzeProperty: builder.mutation({
      query: ({ address, images, maoInputs }) => ({
        url: "/comps/analyze",
        method: "POST",
        body: { address, images, maoInputs },
      }),
      invalidatesTags: ["Analysis", "Comparable", "ImageAnalysis"],
    }),

    // Get analysis by property ID
    getAnalysis: builder.query({
      query: (propertyId) => `/comps/analysis/${propertyId}`,
      providesTags: (result, error, propertyId) => [
        { type: "Analysis", id: propertyId },
      ],
    }),

    // Get comparables for property
    getComparables: builder.query({
      query: ({ propertyId, limit = 10, minScore = 0 }) => ({
        url: `/comps/${propertyId}`,
        params: { limit, minScore },
      }),
      providesTags: (result, error, { propertyId }) => [
        { type: "Comparable", id: propertyId },
      ],
    }),

    // Get image analyses for property
    getImageAnalyses: builder.query({
      query: (propertyId) => `/comps/images/${propertyId}`,
      providesTags: (result, error, propertyId) => [
        { type: "ImageAnalysis", id: propertyId },
      ],
    }),

    // Recalculate MAO
    recalculateMAO: builder.mutation({
      query: ({ analysisId, ...maoInputs }) => ({
        url: `/comps/recalculate/${analysisId}`,
        method: "POST",
        body: maoInputs,
      }),
      invalidatesTags: (result, error, { analysisId }) => [
        { type: "Analysis", id: analysisId },
      ],
    }),
  }),
});

export const {
  useSearchPropertiesMutation,
  useSearchPropertyByAddressMutation,
  useFetchPropertyDetailsMutation,
  useFindComparablesMutation,
  useAnalyzeSelectedCompsMutation,
  useAnalyzePropertyByIdMutation,
  useAnalyzePropertyMutation,
  useGetAnalysisQuery,
  useGetComparablesQuery,
  useGetImageAnalysesQuery,
  useRecalculateMAOMutation,
} = propertyCompsApis;

export default propertyCompsApis;
