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
    // User-uploaded images for the subject property (URLs from /property/upload-images). Shown instead of detail-actor images.
    subjectUploadedImages: [],
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
      maoRule: "sop",
    },
    // Repair estimate inputs (user-driven; total feeds maoInputs.estimatedRepairs)
    repairInputs: {
      rehabPerSqft: 25,
      needsRoof: false,
      roofCost: 19000,
      needsAC: false,
      acCost: 7500,
      otherRepair: 0,
      addBuffer: true,
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
    setSubjectUploadedImages: (state, action) => {
      state.subjectUploadedImages = Array.isArray(action.payload) ? action.payload : [];
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
    setRepairInputs: (state, action) => {
      state.repairInputs = { ...state.repairInputs, ...action.payload };
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
      state.subjectUploadedImages = [];
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
      state.maoInputs = {
        estimatedRepairs: 0,
        holdingCost: 0,
        closingCost: 0,
        wholesaleFee: 0,
        maoRule: "sop",
      };
      state.repairInputs = {
        rehabPerSqft: 25,
        needsRoof: false,
        roofCost: 19000,
        needsAC: false,
        acCost: 7500,
        otherRepair: 0,
        addBuffer: true,
      };
    },
  },
});

export const {
  setSearchFilters,
  setSearchResults,
  setSelectedProperty,
  setSubjectUploadedImages,
  setAnalysis,
  setImageAnalyses,
  setComparables,
  setSelectedCompIds,
  setMAOInputs,
  setRepairInputs,
  resetPropertyComps,
} = propertyCompsSlice.actions;

export default propertyCompsSlice;
