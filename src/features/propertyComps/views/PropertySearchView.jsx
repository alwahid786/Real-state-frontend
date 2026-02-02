import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropertySearchForm from "../../../components/propertyComps/PropertySearchForm";
import PropertySearchResults from "../../../components/propertyComps/PropertySearchResults";
import {
  useSearchPropertyByAddressMutation,
} from "../rtk/propertyCompsApis";
import {
  setSearchResults,
  setSearchFilters,
  setSelectedProperty,
} from "../rtk/propertyCompsSlice";
import { toast } from "react-toastify";
import {
  saveSelectedProperty,
} from "../../../utils/localStorage";

const PropertySearchView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults: reduxSearchResults, searchFilters: reduxSearchFilters } = useSelector(
    (state) => state.propertyComps
  );
  const [searchPropertyByAddress, { isLoading }] = useSearchPropertyByAddressMutation();
  const [searchResults, setLocalResults] = useState([]);
  const [originalFilters, setOriginalFilters] = useState(null);

  // Load properties from Redux state on mount (if navigating back)
  useEffect(() => {
    if (reduxSearchResults?.properties && reduxSearchResults.properties.length > 0) {
      setLocalResults(reduxSearchResults.properties);
      console.log("📋 Using properties from Redux state");
    }
  }, []); // Only run on mount

  const handleSearch = async (filters) => {
    try {
      setOriginalFilters(filters);
      dispatch(
        setSearchResults({
          properties: [],
          loading: true,
          error: null,
          noResults: false,
          count: 0,
        })
      );

      // Validate address
      if (!filters.address || filters.address.trim().length === 0) {
        toast.error("Please enter a property address");
        dispatch(
          setSearchResults({
            properties: [],
            loading: false,
            error: "Address is required",
            noResults: true,
            count: 0,
          })
        );
        return;
      }

      // Search property by address
      const response = await searchPropertyByAddress({ address: filters.address.trim() }).unwrap();

      if (response.success && response.property) {
        // Convert single property to array format for consistency
        const properties = [response.property];
        const count = 1;

        // Save to Redux
        dispatch(
          setSearchResults({
            properties: properties,
            loading: false,
            error: null,
            noResults: false,
            count: count,
          })
        );
        
        // Update local state
        setLocalResults(properties);
        setOriginalFilters(filters);
        
        toast.success("Property found successfully");
      } else {
        dispatch(
          setSearchResults({
            properties: [],
            loading: false,
            error: null,
            noResults: true,
            count: 0,
          })
        );
        setLocalResults([]);
        toast.error("Property not found for the given address");
      }
    } catch (error) {
      console.error("Search error:", error);
      
      // Handle different error statuses
      if (error.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else if (error.status === 400) {
        toast.error(error.data?.message || error.data?.error || "Invalid address.");
      } else if (error.status === 404) {
        toast.error(error.data?.message || error.data?.error || "Property not found for the given address.");
      } else {
        toast.error(
          error.data?.message || error.data?.error || "Failed to search property. Please try again."
        );
      }
      
      dispatch(
        setSearchResults({
          properties: [],
          loading: false,
          error: error.data?.message || error.data?.error || "Search failed",
          noResults: true,
          count: 0,
        })
      );
      setLocalResults([]);
    }
  };

  const handleSelectProperty = (property) => {
    // Save to localStorage
    saveSelectedProperty(property);
    // Save to Redux
    dispatch(setSelectedProperty(property));
    navigate("/property-details");
  };

  const handleAdjustedSearch = (properties) => {
    dispatch(
      setSearchResults({
        properties,
        loading: false,
        error: null,
        noResults: false,
        count: properties.length,
      })
    );
    setLocalResults(properties);
  };

  return (
    <div className="space-y-6">
      <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-semibold text-primary mb-6">
          Property Search
        </h1>
        <PropertySearchForm onSubmit={handleSearch} isLoading={isLoading} />
      </div>

      {searchResults.length > 0 && (
        <PropertySearchResults
          properties={searchResults}
          loading={isLoading}
          onSelectProperty={handleSelectProperty}
          originalFilters={originalFilters}
          onAdjustedSearch={handleAdjustedSearch}
        />
      )}
    </div>
  );
};

export default PropertySearchView;
