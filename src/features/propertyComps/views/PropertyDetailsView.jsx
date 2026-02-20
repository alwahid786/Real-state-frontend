import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropertyDetailsCard from "../../../components/propertyComps/PropertyDetailsCard";
import AnalysisLoader from "../../../components/propertyComps/AnalysisLoader";
import AnalysisProgressView from "../../../components/propertyComps/AnalysisProgressView";
import ComparableSelection from "../../../components/propertyComps/ComparableSelection";
import {
  useFindComparablesMutation,
  useAnalyzeSelectedCompsMutation,
  useGetImageAnalysesQuery,
  useFetchPropertyDetailsMutation,
} from "../rtk/propertyCompsApis";
import { setAnalysis, setImageAnalyses, setMAOInputs, setRepairInputs, setComparables, setSelectedCompIds, setSelectedProperty } from "../rtk/propertyCompsSlice";
import { toast } from "react-toastify";
import { saveSelectedProperty, loadSelectedProperty, updatePropertyInSearchResults } from "../../../utils/localStorage";
import { analyzeSelectedCompsStream } from "../../../utils/analysisStream";

const PropertyDetailsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProperty, maoInputs, repairInputs, comparables, selectedCompIds, searchFilters } = useSelector(
    (state) => state.propertyComps
  );
  const token = useSelector(
    (s) => s?.auth?.user?.token || s?.auth?.user?.accessToken
  );
  const [findComparables, { isLoading: isFindingComps }] =
    useFindComparablesMutation();
  const [analyzeSelectedComps, { isLoading: isAnalyzing }] =
    useAnalyzeSelectedCompsMutation();
  const [fetchPropertyDetails, { isLoading: isFetchingDetails }] =
    useFetchPropertyDetailsMutation();
  
  const [analysisStep, setAnalysisStep] = useState(null); // 'finding', 'analyzing', null
  const [showComparables, setShowComparables] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({
    subjectAddress: null,
    steps: [],
    currentStep: null,
    compBeingAnalyzed: null,
    compIndex: null,
    compTotal: null,
    arv: null,
    mao: null,
    estimatedRepairs: null,
    isComplete: false,
  });
  
  // Ref to track if we've already fetched details for this property
  const fetchedPropertyRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Helper function to get property ID (check both _id and zpid)
  const getPropertyId = (property) => {
    if (!property) return null;
    return property._id || property.zpid || property.id || null;
  };

  const propertyId = getPropertyId(selectedProperty);

  // Load selected property from localStorage if not in Redux
  useEffect(() => {
    if (!selectedProperty) {
      const storedProperty = loadSelectedProperty();
      if (storedProperty) {
        dispatch(setSelectedProperty(storedProperty));
        console.log("📦 Restored selected property from localStorage");
      }
    }
  }, []); // Only run on mount

  // Save selected property to localStorage whenever it changes
  useEffect(() => {
    if (selectedProperty) {
      saveSelectedProperty(selectedProperty);
    }
  }, [selectedProperty]);

  // Get image analyses if property has been analyzed
  const { data: imageAnalysesData } = useGetImageAnalysesQuery(
    propertyId,
    {
      skip: !propertyId,
    }
  );

  useEffect(() => {
    if (imageAnalysesData?.data) {
      dispatch(
        setImageAnalyses({
          data: imageAnalysesData.data,
          loading: false,
          error: null,
        })
      );
    }
  }, [imageAnalysesData, dispatch]);

  // Fetch full property details when property is selected
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedProperty) return;

      // Get property identifier to check if we've already fetched this property
      const propId = getPropertyId(selectedProperty);
      const propertyUrl = selectedProperty.propertyUrl || 
                          selectedProperty.property_url ||
                          selectedProperty.url || 
                          selectedProperty.zillowUrl ||
                          selectedProperty.zillow_url ||
                          selectedProperty.listingUrl ||
                          selectedProperty.listing_url ||
                          selectedProperty.sourceUrl ||
                          selectedProperty.source_url ||
                          null;
      const zpid = selectedProperty.zpid || selectedProperty.sourceId;
      
      // Create a unique identifier for this property
      const propertyIdentifier = propId || propertyUrl || zpid || selectedProperty.formattedAddress || selectedProperty.address;
      
      // Check if we've already fetched this exact property
      if (fetchedPropertyRef.current === propertyIdentifier) {
        console.log("✅ Already fetched details for this property, skipping duplicate fetch");
        return;
      }
      
      // Check if we're already fetching
      if (isFetchingRef.current) {
        console.log("⏳ Already fetching property details, skipping duplicate request");
        return;
      }

      // Check if we already have full details with images
      // If property already has a full images array, skip fetching
      const hasFullImages = selectedProperty.images && 
                           Array.isArray(selectedProperty.images) && 
                           selectedProperty.images.length > 0;
      
      // Skip fetch only if we have full details and we're not using user-uploaded images (user uploads => we still fetch to get beds/baths/sqft etc., then show user's images)
      const hasUserUploadedImages = selectedProperty.uploadedImages?.length > 0;
      if (
        !hasUserUploadedImages &&
        hasFullImages &&
        selectedProperty.squareFootage &&
        selectedProperty.lotSize
      ) {
        fetchedPropertyRef.current = propertyIdentifier;
        console.log("✅ Property already has full details, skipping fetch");
        return;
      }

      // Need at least one identifier to fetch
      if (!propId && !propertyUrl && !zpid) {
        console.warn("Cannot fetch property details: missing propertyId, propertyUrl, or zpid");
        return;
      }

      // Mark that we're fetching
      isFetchingRef.current = true;

      // Build request payload - always include URL if available
      const requestPayload = {};
      if (propId) requestPayload.propertyId = propId;
      if (propertyUrl) requestPayload.propertyUrl = propertyUrl;
      if (zpid) requestPayload.zpid = zpid;

      // Log what we're sending for debugging
      console.log("📤 Fetching property details with payload:", {
        propertyId: requestPayload.propertyId || 'not provided',
        propertyUrl: requestPayload.propertyUrl || 'not provided',
        zpid: requestPayload.zpid || 'not provided',
      });

      try {
        const response = await fetchPropertyDetails(requestPayload).unwrap();

        if (response.success && response.property) {
          // Show user-uploaded images instead of detail-actor images; keep all other data from the actor
          const userImages = selectedProperty.uploadedImages;
          const displayImages =
            userImages && userImages.length > 0
              ? userImages
              : (response.images || response.property.images || []);

          const updatedProperty = {
            ...selectedProperty,
            ...response.property,
            images: displayImages,
            uploadedImages: userImages && userImages.length > 0 ? userImages : undefined,
          };

          fetchedPropertyRef.current = propertyIdentifier;

          dispatch(setSelectedProperty(updatedProperty));
          updatePropertyInSearchResults(updatedProperty);

          toast.success(
            userImages?.length
              ? `Property details loaded. Showing your ${userImages.length} uploaded photo(s).`
              : response.message || `Fetched property details with ${response.imageCount || response.images?.length || 0} images`
          );
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        // Don't show error toast - property might still be usable with existing data
        // Only log for debugging
        if (error.status === 404) {
          console.warn("Property details not found, using existing property data");
        }
        // Reset fetch flag on error so we can retry if needed
        fetchedPropertyRef.current = null;
      } finally {
        // Reset fetching flag
        isFetchingRef.current = false;
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProperty?._id, selectedProperty?.zpid, selectedProperty?.propertyUrl]);
  
  // Reset fetch tracking when property changes (new property selected)
  useEffect(() => {
    const propId = getPropertyId(selectedProperty);
    const propertyUrl = selectedProperty?.propertyUrl || 
                        selectedProperty?.property_url ||
                        selectedProperty?.url || 
                        selectedProperty?.zillowUrl ||
                        null;
    const zpid = selectedProperty?.zpid || selectedProperty?.sourceId;
    const propertyIdentifier = propId || propertyUrl || zpid || selectedProperty?.formattedAddress || selectedProperty?.address;
    
    // If property identifier changed, reset the fetch tracking
    if (fetchedPropertyRef.current && fetchedPropertyRef.current !== propertyIdentifier) {
      fetchedPropertyRef.current = null;
      isFetchingRef.current = false;
      console.log("🔄 Property changed, resetting fetch tracking");
    }
  }, [selectedProperty?._id, selectedProperty?.zpid, selectedProperty?.propertyUrl]);

  // Step 1: Find comparables (NEW WORKFLOW)
  const handleFindComparables = async () => {
    const propId = getPropertyId(selectedProperty);
    
    // According to backend docs, propertyId can be any string (ZPID, ObjectId, or identifier)
    // If no ID exists, we'll use a generated identifier based on address
    // Prefer _id over zpid for backend API calls, but allow any identifier
    let propertyIdForApi = selectedProperty._id || propId;
    
    // If still no ID, generate one from address (backend will create property if not found)
    if (!propertyIdForApi) {
      const addressForId = selectedProperty.formattedAddress || 
                           selectedProperty.address || 
                           `${selectedProperty.city || ''}-${selectedProperty.state || ''}`.trim();
      if (addressForId) {
        // Create a simple identifier from address (backend accepts any string)
        propertyIdForApi = `property-${addressForId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
        console.warn("⚠️ No property ID found, using generated ID:", propertyIdForApi);
      } else {
        console.error("Property object:", selectedProperty);
        console.error("Available property fields:", Object.keys(selectedProperty || {}));
        toast.error(
          "Property ID is required. The selected property doesn't have a valid ID or address. " +
          "Please ensure the property was returned from the search results."
        );
        return;
      }
    }

    // Helper function to parse address components from formatted address
    const parseAddressComponents = (addressString) => {
      if (!addressString) return { city: null, state: null, postalCode: null };
      
      // Try to parse: "123 Main St, City, State ZIP" or "123 Main St, City, State"
      const parts = addressString.split(',').map(p => p.trim());
      
      if (parts.length >= 3) {
        // Format: "Street, City, State ZIP" or "Street, City, State"
        const stateZip = parts[2].trim();
        // Match state (2 letters, case insensitive) and optional ZIP (5 digits)
        const stateZipMatch = stateZip.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/i);
        
        if (stateZipMatch) {
          return {
            city: parts[1] || null,
            state: (stateZipMatch[1] || '').toUpperCase() || null,
            postalCode: stateZipMatch[2] || null,
          };
        }
        // Try without ZIP: "Street, City, State"
        const stateOnlyMatch = stateZip.match(/^([A-Z]{2})$/i);
        if (stateOnlyMatch) {
          return {
            city: parts[1] || null,
            state: (stateOnlyMatch[1] || '').toUpperCase() || null,
            postalCode: null,
          };
        }
      } else if (parts.length === 2) {
        // Format: "Street, City State ZIP" or "Street, City State" or "Street, City"
        const cityStateZip = parts[1].trim();
        // Match: City name, then State (2 letters), then optional ZIP
        const cityStateZipMatch = cityStateZip.match(/^(.+?)\s+([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/i);
        
        if (cityStateZipMatch) {
          return {
            city: cityStateZipMatch[1]?.trim() || null,
            state: (cityStateZipMatch[2] || '').toUpperCase() || null,
            postalCode: cityStateZipMatch[3] || null,
          };
        }
        // If no match, might be just "Street, City" - can't extract state
      }
      
      // Try to extract state and ZIP from anywhere in the string as fallback
      const stateZipPattern = /\b([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b/i;
      const fallbackMatch = addressString.match(stateZipPattern);
      if (fallbackMatch) {
        return {
          city: null, // Can't extract city from this pattern
          state: (fallbackMatch[1] || '').toUpperCase() || null,
          postalCode: fallbackMatch[2] || null,
        };
      }
      
      return { city: null, state: null, postalCode: null };
    };

    // Extract city, state, and postal code from property or parse from address
    // Try multiple field name variations
    let city = selectedProperty.city || 
               selectedProperty.cityName || 
               selectedProperty.city_name ||
               searchFilters?.city || 
               null;
    
    let state = selectedProperty.state || 
                selectedProperty.stateCode || 
                selectedProperty.state_code ||
                selectedProperty.stateName ||
                searchFilters?.state || 
                null;
    
    let postalCode = selectedProperty.postalCode || 
                     selectedProperty.postal_code || 
                     selectedProperty.zipCode || 
                     selectedProperty.zip_code ||
                     selectedProperty.zip || 
                     selectedProperty.postal ||
                     searchFilters?.postalCode || 
                     null;

    // Get formatted address first (before parsing)
    let formattedAddress = selectedProperty.formattedAddress || 
                          selectedProperty.formatted_address ||
                          selectedProperty.address || 
                          null;

    // If city/state not found, try to parse from formattedAddress
    if ((!city || !state) && formattedAddress) {
      const parsed = parseAddressComponents(formattedAddress);
      city = city || parsed.city;
      state = state || parsed.state;
      postalCode = postalCode || parsed.postalCode;
    }

    // If still no city/state, try parsing from address field
    if ((!city || !state) && selectedProperty.address && selectedProperty.address !== formattedAddress) {
      const parsed = parseAddressComponents(selectedProperty.address);
      city = city || parsed.city;
      state = state || parsed.state;
      postalCode = postalCode || parsed.postalCode;
    }
    
    // If we still don't have a formatted address, build it from components
    if (!formattedAddress) {
      const streetAddress = selectedProperty.address || 
                           selectedProperty.streetAddress || 
                           selectedProperty.street_address ||
                           selectedProperty.street || 
                           '';
      const addressParts = [];
      if (streetAddress) addressParts.push(streetAddress);
      if (city) addressParts.push(city);
      if (state) addressParts.push(state);
      if (postalCode) addressParts.push(postalCode);
      
      formattedAddress = addressParts.join(', ').trim();
    }
    
    // Ensure formattedAddress is not empty - build minimal address if needed
    if (!formattedAddress) {
      const addressParts = [];
      if (selectedProperty.address) addressParts.push(selectedProperty.address);
      if (city) addressParts.push(city);
      if (state) addressParts.push(state);
      if (postalCode) addressParts.push(postalCode);
      formattedAddress = addressParts.join(', ').trim();
    }

    if (!formattedAddress) {
      toast.error("Property address is required. Cannot find comparables without address.");
      return;
    }

    // Final validation - city and state are required
    if (!city || !state) {
      console.error("Property object:", selectedProperty);
      console.error("Search filters:", searchFilters);
      console.error("Extracted city:", city, "state:", state);
      toast.error(
        "Property city and state are required. " +
        "The property data is missing location information. Please select a property from search results."
      );
      return;
    }

    // Check if we have valid coordinates - try multiple field name variations
    const lat = selectedProperty.latitude || 
                selectedProperty.lat || 
                selectedProperty.coordinates?.[0] ||
                selectedProperty.location?.lat ||
                null;
    
    const lng = selectedProperty.longitude || 
                selectedProperty.lng || 
                selectedProperty.lon ||
                selectedProperty.coordinates?.[1] ||
                selectedProperty.location?.lng ||
                null;

    const hasValidCoordinates = 
      lat !== null && 
      lng !== null && 
      lat !== undefined &&
      lng !== undefined &&
      lat !== 0 && 
      lng !== 0 &&
      !isNaN(Number(lat)) &&
      !isNaN(Number(lng)) &&
      Number(lat) >= -90 &&
      Number(lat) <= 90 &&
      Number(lng) >= -180 &&
      Number(lng) <= 180;

    // Warn if no valid coordinates (backend will try to geocode)
    if (!hasValidCoordinates) {
      console.warn("⚠️ No valid coordinates provided. Backend will attempt to geocode address.");
      console.warn("⚠️ Address must be complete (street, city, state) for geocoding to work.");
      console.warn("⚠️ Current address:", formattedAddress);
      console.warn("⚠️ City:", city, "State:", state);
    }

    try {
      setAnalysisStep("finding");
      dispatch(
        setComparables({
          data: [],
          loading: true,
          error: null,
          count: 0,
        })
      );
      dispatch(setSelectedCompIds([]));

      // Prepare propertyData - CRITICAL: Always include address, city, state, latitude, and longitude
      // These are the required fields for finding comparables
      const propertyData = {
        // ✅ Address (REQUIRED)
        formattedAddress: formattedAddress,
        address: selectedProperty.address || 
                 selectedProperty.streetAddress || 
                 selectedProperty.street_address ||
                 selectedProperty.street || 
                 formattedAddress.split(',')[0]?.trim() || 
                 '',
        
        // ✅ City (REQUIRED)
        city: city,
        
        // ✅ State (REQUIRED)
        state: state,
        
        // ✅ Latitude and Longitude (REQUIRED if available)
        // Always include coordinates if they exist (backend will validate if they're valid)
        ...(lat !== null && lat !== undefined && !isNaN(Number(lat)) && {
          latitude: Number(lat)
        }),
        ...(lng !== null && lng !== undefined && !isNaN(Number(lng)) && {
          longitude: Number(lng)
        }),
        
        // Optional fields
        ...(postalCode && { postalCode: postalCode }),
        
        // Property identifiers - try multiple field name variations
        ...(selectedProperty.zpid && { zpid: selectedProperty.zpid }),
        ...(selectedProperty.sourceId && { sourceId: selectedProperty.sourceId }),
        ...(selectedProperty.source_id && { sourceId: selectedProperty.source_id }),
        ...(selectedProperty.id && !selectedProperty.zpid && { sourceId: selectedProperty.id }),
        
        // Property details (helpful but not required for scraping)
        // Handle multiple field name variations
        ...((selectedProperty.beds || selectedProperty.bedrooms || selectedProperty.bed) && {
          beds: Number(selectedProperty.beds || selectedProperty.bedrooms || selectedProperty.bed)
        }),
        ...((selectedProperty.baths || selectedProperty.bathrooms || selectedProperty.bath) && {
          baths: Number(selectedProperty.baths || selectedProperty.bathrooms || selectedProperty.bath)
        }),
        ...((selectedProperty.squareFootage || selectedProperty.square_footage || selectedProperty.sqft || selectedProperty.sq_ft || selectedProperty.area || selectedProperty.livingArea) && {
          squareFootage: Number(selectedProperty.squareFootage || selectedProperty.square_footage || selectedProperty.sqft || selectedProperty.sq_ft || selectedProperty.area || selectedProperty.livingArea)
        }),
        ...((selectedProperty.lotSize || selectedProperty.lot_size || selectedProperty.lotSqft || selectedProperty.lot_sqft) && {
          lotSize: Number(selectedProperty.lotSize || selectedProperty.lot_size || selectedProperty.lotSqft || selectedProperty.lot_sqft)
        }),
        ...((selectedProperty.yearBuilt || selectedProperty.year_built || selectedProperty.builtYear || selectedProperty.built_year) && {
          yearBuilt: Number(selectedProperty.yearBuilt || selectedProperty.year_built || selectedProperty.builtYear || selectedProperty.built_year)
        }),
        ...((selectedProperty.price || selectedProperty.listPrice || selectedProperty.listingPrice || selectedProperty.askingPrice) && {
          price: Number(selectedProperty.price || selectedProperty.listPrice || selectedProperty.listingPrice || selectedProperty.askingPrice)
        }),
        ...((selectedProperty.estimatedValue || selectedProperty.zestimate) != null && {
          estimatedValue: Number(selectedProperty.estimatedValue ?? selectedProperty.zestimate),
          zestimate: Number(selectedProperty.zestimate ?? selectedProperty.estimatedValue)
        }),
        ...((selectedProperty.propertyType || selectedProperty.property_type || selectedProperty.type) && {
          propertyType: selectedProperty.propertyType || selectedProperty.property_type || selectedProperty.type
        }),
        // Images - prefer user-uploaded subject photos (SOP: compare comps to subject using subject photos)
        ...((selectedProperty.uploadedImages || selectedProperty.images || selectedProperty.imageUrls || selectedProperty.photos || selectedProperty.photoUrls) && {
          images: Array.isArray(selectedProperty.uploadedImages) && selectedProperty.uploadedImages.length > 0 ? selectedProperty.uploadedImages :
                 Array.isArray(selectedProperty.images) ? selectedProperty.images :
                 Array.isArray(selectedProperty.imageUrls) ? selectedProperty.imageUrls :
                 Array.isArray(selectedProperty.photos) ? selectedProperty.photos :
                 Array.isArray(selectedProperty.photoUrls) ? selectedProperty.photoUrls :
                 []
        }),
      };

      // Log for debugging - show what we're sending
      console.log("📤 Sending propertyData for comparables search:", {
        address: propertyData.address,
        formattedAddress: propertyData.formattedAddress,
        city: propertyData.city,
        state: propertyData.state,
        latitude: propertyData.latitude !== undefined ? propertyData.latitude : 'NOT PROVIDED',
        longitude: propertyData.longitude !== undefined ? propertyData.longitude : 'NOT PROVIDED',
        postalCode: propertyData.postalCode || 'not provided',
        hasValidCoordinates: hasValidCoordinates,
        propertyId: propertyIdForApi,
        fullPropertyData: JSON.stringify(propertyData, null, 2),
        originalProperty: {
          hasLat: selectedProperty.latitude !== undefined,
          hasLng: selectedProperty.longitude !== undefined,
          hasCity: selectedProperty.city !== undefined,
          hasState: selectedProperty.state !== undefined,
          formattedAddress: selectedProperty.formattedAddress,
          address: selectedProperty.address,
        }
      });

      // Final validation before sending - must have either coordinates OR complete address
      const hasCompleteAddress = propertyData.formattedAddress && propertyData.city && propertyData.state;
      
      if (!hasValidCoordinates && !hasCompleteAddress) {
        console.error("Invalid propertyData - missing required location data:", propertyData);
        toast.error(
          "Property location data is incomplete. " +
          "The property must have either valid coordinates (latitude/longitude) or a complete address (street, city, state). " +
          "Please select a different property or ensure the property has location data."
        );
        setAnalysisStep(null);
        dispatch(
          setComparables({
            data: [],
            loading: false,
            error: "Invalid property location data",
            count: 0,
          })
        );
        return;
      }

      const response = await findComparables({
        propertyId: propertyIdForApi,
        timeWindowMonths: 12,
        maxResults: 1000,
        propertyData: propertyData,
      }).unwrap();

      // Update selectedProperty with database _id if property was created or if we only had zpid
      if (response.propertyId && (!selectedProperty._id || response.propertyId !== selectedProperty._id)) {
        dispatch(
          setSelectedProperty({
            ...selectedProperty,
            _id: response.propertyId, // Use database _id for analyze-selected
          })
        );
      }

      // Handle response - "no results" is NOT an error, just means no sales in area
      if (response.success) {
        const count = response.count || (response.data ? response.data.length : 0);
        
        if (count > 0 && response.data && response.data.length > 0) {
          // ✅ Success - found comparables
          dispatch(
            setComparables({
              data: response.data,
              loading: false,
              error: null,
              count: count,
            })
          );
          setShowComparables(true);
          setAnalysisStep(null);
          toast.success(`Found ${count} sold comparable properties`);
        } else {
          // ⚠️ No results - not an error, just no sales in area
          dispatch(
            setComparables({
              data: [],
              loading: false,
              error: null, // Not an error
              count: 0,
            })
          );
          setShowComparables(false);
          setAnalysisStep(null);
          toast.info(
            "No comparable properties found. This area may not have recent sales. " +
            "Try selecting a property in a different area or check if the area has recent sales."
          );
        }
      } else {
        // ❌ Actual error
        dispatch(
          setComparables({
            data: [],
            loading: false,
            error: response.error || response.message || "Failed to find comparables",
            count: 0,
          })
        );
        setAnalysisStep(null);
        toast.error(response.error || response.message || "Failed to find comparables");
      }
    } catch (error) {
      console.error("Find comparables error:", error);
      setAnalysisStep(null);
      
      const errorMessage = error.data?.message || error.data?.error || error.message || "Failed to find comparables";
      
      dispatch(
        setComparables({
          data: [],
          loading: false,
          error: errorMessage,
          count: 0,
        })
      );

      // Handle specific error types with helpful messages
      if (error.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else if (error.status === 404) {
        toast.error("Property not found. Please try a different property.");
      } else if (error.status === 400) {
        // 400 errors often indicate missing required fields
        if (errorMessage.includes("coordinates") || errorMessage.includes("address")) {
          toast.error(
            `${errorMessage}. ` +
            "Please ensure the property has coordinates (latitude/longitude) or a complete address (street, city, state)."
          );
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(
          errorMessage + " Please check that the property has valid location data and try again."
        );
      }
    }
  };

  // Step 2: Toggle comp selection
  const handleToggleComp = (compId, isSelected) => {
    const currentIds = selectedCompIds || [];
    if (isSelected) {
      if (currentIds.length >= 5) {
        toast.warning("Maximum 5 comparables allowed");
        return;
      }
      dispatch(setSelectedCompIds([...currentIds, compId]));
    } else {
      dispatch(setSelectedCompIds(currentIds.filter((id) => id !== compId)));
    }
  };

  // Step 3: Run analysis with selected comps (streaming progress)
  const handleAnalyzeSelected = async () => {
    const propId = getPropertyId(selectedProperty);
    
    if (!propId) {
      toast.error("Property ID is required");
      return;
    }

    const propertyIdForApi = selectedProperty._id || propId;

    if (!selectedCompIds || selectedCompIds.length < 1 || selectedCompIds.length > 5) {
      toast.error("Please select at least 1 comparable (3-5 recommended for accurate results)");
      return;
    }
    
    if (selectedCompIds.length < 3) {
      toast.warning(`Only ${selectedCompIds.length} comparable${selectedCompIds.length === 1 ? '' : 's'} selected. Analysis requires at least 3 comparables for accurate results.`);
    }

    const subjectAddress = selectedProperty?.formattedAddress || selectedProperty?.address || selectedProperty?.rawAddress || "";

    setAnalysisStep("analyzing");
    setAnalysisProgress({
      subjectAddress,
      steps: [],
      currentStep: "subject_prep",
      compBeingAnalyzed: null,
      compIndex: null,
      compTotal: selectedCompIds.length,
      arv: null,
      mao: null,
      estimatedRepairs: null,
      isComplete: false,
    });

    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api";
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("accessToken");

    const maoInputsPayload = {
      estimatedRepairs: maoInputs.estimatedRepairs || 0,
      holdingCost: maoInputs.holdingCost || 0,
      closingCost: maoInputs.closingCost || 0,
      wholesaleFee: maoInputs.wholesaleFee || 0,
      maoRule: maoInputs.maoRule || "sop",
    };

    const body = {
      propertyId: propertyIdForApi,
      selectedCompIds,
      maoInputs: maoInputsPayload,
      subjectImages: selectedProperty?.uploadedImages?.length ? selectedProperty.uploadedImages : (selectedProperty?.images || []),
    };

    try {
      const result = await analyzeSelectedCompsStream(baseUrl, authToken, body, (ev) => {
        if (ev.type === "step") {
          setAnalysisProgress((prev) => ({
            ...prev,
            steps: [...prev.steps, ev],
            currentStep: ev.step,
            compBeingAnalyzed: ev.address || (ev.step === "comp" ? ev.address : null),
            compIndex: ev.index ?? prev.compIndex,
            compTotal: ev.total ?? prev.compTotal,
            arv: ev.arv ?? prev.arv,
            mao: ev.mao ?? prev.mao,
            estimatedRepairs: ev.estimatedRepairs ?? prev.estimatedRepairs,
          }));
        }
      });

      if (result && result.type === "complete" && result.data) {
        setAnalysisProgress((prev) => ({ ...prev, isComplete: true, currentStep: "complete" }));
        dispatch(setAnalysis({ loading: false, error: null, data: result.data }));
        toast.success("Property analysis completed successfully!");
      } else if (result && result.type === "complete") {
        const data = result.data || result;
        setAnalysisProgress((prev) => ({ ...prev, isComplete: true, currentStep: "complete" }));
        dispatch(setAnalysis({ loading: false, error: null, data: data?.data || data }));
        toast.success("Property analysis completed successfully!");
      } else {
        setAnalysisStep(null);
        setAnalysisProgress((prev) => ({ ...prev, isComplete: false }));
        toast.error("Analysis did not return results.");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisStep(null);
      setAnalysisProgress((prev) => ({ ...prev, isComplete: false }));
      
      if (error.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else if (error.status === 404) {
        toast.error("Property not found. Please try a different property.");
      } else if (error.status === 400) {
        toast.error(error.data?.message || error.data?.error || "Invalid comp selection. Please select 3-5 comparables.");
      } else {
        toast.error(
          error.data?.message || error.data?.error || "Failed to analyze property. Please try again."
        );
      }
      
      dispatch(
        setAnalysis({
          loading: false,
          error: error.data?.message || error.data?.error || "Analysis failed",
          data: null,
        })
      );
    }
  };

  const handleViewAnalysisResults = () => {
    setAnalysisStep(null);
    setAnalysisProgress({
      subjectAddress: null,
      steps: [],
      currentStep: null,
      compBeingAnalyzed: null,
      compIndex: null,
      compTotal: null,
      arv: null,
      mao: null,
      estimatedRepairs: null,
      isComplete: false,
    });
    navigate("/analysis-results");
  };

  const handleMaoInputChange = (updates) => {
    dispatch(setMAOInputs(updates));
  };

  const handleRepairInputChange = (updates) => {
    dispatch(setRepairInputs(updates));
  };

  if (!selectedProperty) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No property selected</p>
        <button
          onClick={() => navigate("/property-search")}
          className="text-primary underline"
        >
          Go to Property Search
        </button>
      </div>
    );
  }

  // Show loading state while fetching property details
  if (isFetchingDetails) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-primary">Loading property details and images...</p>
        <p className="text-sm text-gray-500 mt-2">
          Fetching complete property information from Zillow
        </p>
      </div>
    );
  }

  // Show loading state while finding comparables
  if (isFindingComps) {
    return (
      <AnalysisLoader message="Searching for sold comparables... This may take 30-60 seconds." />
    );
  }

  // Show step-by-step progress while analyzing (streaming)
  if (analysisStep === "analyzing") {
    return (
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => {
              setAnalysisStep(null);
              setAnalysisProgress({
                subjectAddress: null,
                steps: [],
                currentStep: null,
                compBeingAnalyzed: null,
                compIndex: null,
                compTotal: null,
                arv: null,
                mao: null,
                estimatedRepairs: null,
                isComplete: false,
              });
            }}
            className="text-primary underline mb-4"
          >
            ← Cancel
          </button>
        </div>
        <AnalysisProgressView
          subjectAddress={analysisProgress.subjectAddress}
          steps={analysisProgress.steps}
          currentStep={analysisProgress.currentStep}
          compBeingAnalyzed={analysisProgress.compBeingAnalyzed}
          compIndex={analysisProgress.compIndex}
          compTotal={analysisProgress.compTotal}
          arv={analysisProgress.arv}
          mao={analysisProgress.mao}
          estimatedRepairs={analysisProgress.estimatedRepairs}
          isComplete={analysisProgress.isComplete}
          onViewResults={handleViewAnalysisResults}
        />
      </div>
    );
  }

  // Show comparables selection if found
  if (showComparables && comparables?.data && comparables.data.length > 0) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => {
              setShowComparables(false);
              dispatch(setSelectedCompIds([]));
            }}
            className="text-primary underline mb-4"
          >
            ← Back to Property Details
          </button>
        </div>
        <ComparableSelection
          comparables={comparables.data}
          selectedCompIds={selectedCompIds || []}
          onToggleComp={handleToggleComp}
          onAnalyze={handleAnalyzeSelected}
          isAnalyzing={isAnalyzing}
          maoInputs={maoInputs}
          onMaoInputChange={handleMaoInputChange}
          selectedProperty={selectedProperty}
          repairInputs={repairInputs}
          onRepairInputChange={handleRepairInputChange}
        />
      </div>
    );
  }

  // Show property details with "Find Comparables" button
  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/property-search")}
          className="text-primary underline mb-4"
        >
          ← Back to Search
        </button>
        <PropertyDetailsCard
          property={selectedProperty}
          onAnalyze={handleFindComparables}
          isAnalyzing={isFindingComps}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsView;
