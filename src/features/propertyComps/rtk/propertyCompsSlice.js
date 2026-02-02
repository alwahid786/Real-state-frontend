import { createSlice } from "@reduxjs/toolkit";

const propertyCompsSlice = createSlice({
  name: "propertyComps",
  initialState: {
    // Search filters
    searchFilters: {
      areaName: "",
      city: "",
      state: "",
      postalCode: "",
      beds: "",
      baths: "",
      sqft: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
    },
    // Search results
    searchResults: {
      properties: [],
      loading: false,
      error: null,
      noResults: false,
      count: 0,
    },
    // Selected property
    selectedProperty: null,
    // Analysis
    analysis: {
      loading: false,
      error: null,
      data: null,
    },
    // Image analyses
    imageAnalyses: {
      data: [],
      loading: false,
      error: null,
    },
    // Comparables (found sold properties for selection)
    comparables: {
      data: [],
      loading: false,
      error: null,
      count: 0,
    },
    // Selected comparable IDs (3-5 comps selected by user)
    selectedCompIds: [],
    // MAO inputs
    maoInputs: {
      estimatedRepairs: 0,
      holdingCost: 0,
      closingCost: 0,
      wholesaleFee: 0,
      maoRule: "70%",
    },
  },
  reducers: {
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    setSearchResults: (state, action) => {
      state.searchResults = {
        ...state.searchResults,
        ...action.payload,
      };
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    setAnalysis: (state, action) => {
      state.analysis = {
        ...state.analysis,
        ...action.payload,
      };
    },
    setImageAnalyses: (state, action) => {
      state.imageAnalyses = {
        ...state.imageAnalyses,
        ...action.payload,
      };
    },
    setMAOInputs: (state, action) => {
      state.maoInputs = { ...state.maoInputs, ...action.payload };
    },
    setComparables: (state, action) => {
      state.comparables = {
        ...state.comparables,
        ...action.payload,
      };
    },
    setSelectedCompIds: (state, action) => {
      state.selectedCompIds = action.payload;
    },
    resetPropertyComps: (state) => {
      state.searchFilters = {
        areaName: "",
        city: "",
        state: "",
        postalCode: "",
        beds: "",
        baths: "",
        sqft: "",
        minPrice: "",
        maxPrice: "",
        propertyType: "",
      };
      state.searchResults = {
        properties: [],
        loading: false,
        error: null,
        noResults: false,
        count: 0,
      };
      state.selectedProperty = null;
      state.analysis = {
        loading: false,
        error: null,
        data: null,
      };
      state.imageAnalyses = {
        data: [],
        loading: false,
        error: null,
      };
      state.comparables = {
        data: [],
        loading: false,
        error: null,
        count: 0,
      };
      state.selectedCompIds = [];
    },
  },
});

export const {
  setSearchFilters,
  setSearchResults,
  setSelectedProperty,
  setAnalysis,
  setImageAnalyses,
  setComparables,
  setSelectedCompIds,
  setMAOInputs,
  resetPropertyComps,
} = propertyCompsSlice.actions;

export default propertyCompsSlice;
