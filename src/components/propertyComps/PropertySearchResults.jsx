import { useState } from "react";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import { 
  formatCurrency, 
  formatDate, 
  getPropertyImages,
  getPropertyPrice,
  getPropertySalePrice 
} from "../../utils/formatters";
import { useSearchPropertiesMutation } from "../../features/propertyComps/rtk/propertyCompsApis";
import { toast } from "react-toastify";
import ImageSlider from "./ImageSlider";

const PropertySearchResults = ({
  properties = [],
  loading,
  onSelectProperty,
  originalFilters,
  onAdjustedSearch,
}) => {
  const [showFilterAdjustment, setShowFilterAdjustment] = useState(false);
  const [adjustedFilters, setAdjustedFilters] = useState(null);
  const [searchWithAdjusted, { isLoading: isAdjusting }] =
    useSearchPropertiesMutation();

  // Calculate adjusted filters
  const calculateAdjustedFilters = () => {
    if (!originalFilters) return null;

    const sqft = parseInt(originalFilters.sqft) || 1500;
    const beds = parseInt(originalFilters.beds) || 3;
    const baths = parseFloat(originalFilters.baths) || 2;
    const minPrice = originalFilters.minPrice
      ? parseFloat(originalFilters.minPrice)
      : null;
    const maxPrice = originalFilters.maxPrice
      ? parseFloat(originalFilters.maxPrice)
      : null;

    const adjusted = {
      ...originalFilters,
      minSqft: Math.floor(sqft * 0.8),
      maxSqft: Math.ceil(sqft * 1.2),
      minBeds: Math.max(1, beds - 1),
      maxBeds: beds + 1,
      minBaths: Math.max(1, Math.floor((baths - 1) * 2) / 2),
      maxBaths: Math.ceil((baths + 1) * 2) / 2,
    };

    if (minPrice) {
      adjusted.minPrice = Math.floor(minPrice * 0.9);
    }
    if (maxPrice) {
      adjusted.maxPrice = Math.ceil(maxPrice * 1.1);
    }

    return adjusted;
  };

  const handleAdjustFilters = () => {
    const adjusted = calculateAdjustedFilters();
    setAdjustedFilters(adjusted);
    setShowFilterAdjustment(true);
  };

  const handleSearchWithAdjusted = async () => {
    try {
      // Build search parameters - use address components if available
      const searchParams = {};
      
      if (adjustedFilters.city && adjustedFilters.state) {
        if (adjustedFilters.areaName) searchParams.areaName = adjustedFilters.areaName;
        searchParams.city = adjustedFilters.city;
        searchParams.state = adjustedFilters.state;
        if (adjustedFilters.postalCode) searchParams.postalCode = adjustedFilters.postalCode;
      } else {
        // Fall back to full address string
        const addressParts = [];
        if (adjustedFilters.areaName) addressParts.push(adjustedFilters.areaName);
        if (adjustedFilters.city) addressParts.push(adjustedFilters.city);
        if (adjustedFilters.state) addressParts.push(adjustedFilters.state);
        if (adjustedFilters.postalCode) addressParts.push(adjustedFilters.postalCode);
        if (addressParts.length > 0) {
          searchParams.address = addressParts.join(", ");
        }
      }

      // Apply adjusted filters
      if (adjustedFilters.minSqft) searchParams.minSqft = adjustedFilters.minSqft;
      if (adjustedFilters.maxSqft) searchParams.maxSqft = adjustedFilters.maxSqft;
      if (adjustedFilters.minPrice) searchParams.minPrice = adjustedFilters.minPrice;
      if (adjustedFilters.maxPrice) searchParams.maxPrice = adjustedFilters.maxPrice;
      if (adjustedFilters.propertyType) searchParams.propertyType = adjustedFilters.propertyType;
      
      // Search for active/for-sale properties
      searchParams.isSold = false;

      const response = await searchWithAdjusted(searchParams).unwrap();

      if (response.properties && response.properties.length > 0) {
        if (onAdjustedSearch) {
          onAdjustedSearch(response.properties);
        }
        setShowFilterAdjustment(false);
        toast.success(
          `Found ${response.count} properties with adjusted filters`
        );
      } else {
        toast.info("No properties found even with adjusted filters");
      }
    } catch (error) {
      toast.error(
        error.data?.message || "Failed to search with adjusted filters"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Searching properties...</p>
          <p className="text-sm text-gray-500 mt-2">
            Checking Zillow, Redfin, and Realtor.com...
          </p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-red-600">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-lg font-semibold mb-2">No Properties Found</p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            No active/unsold properties found matching your criteria. Try adjusting your filters or expanding the search area.
          </p>
        </div>
        
        <Button
          text="Adjust Filters & Search Again"
          onClick={handleAdjustFilters}
          cn="max-w-xs mx-auto"
        />

        {showFilterAdjustment && adjustedFilters && (
          <Modal
            title="Filter Adjustment"
            onClose={() => setShowFilterAdjustment(false)}
            width="w-full md:w-[600px]"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Expanding search to nearby properties with adjusted filters:
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">SqFt Range:</span>
                  <span>
                    {adjustedFilters.minSqft} - {adjustedFilters.maxSqft} (±20%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Beds Range:</span>
                  <span>
                    {adjustedFilters.minBeds} - {adjustedFilters.maxBeds} (±1)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Baths Range:</span>
                  <span>
                    {adjustedFilters.minBaths} - {adjustedFilters.maxBaths} (±1)
                  </span>
                </div>
                {adjustedFilters.minPrice && (
                  <div className="flex justify-between">
                    <span className="font-medium">Price Range:</span>
                    <span>
                      {formatCurrency(adjustedFilters.minPrice)} -{" "}
                      {formatCurrency(adjustedFilters.maxPrice)} (±10%)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  text="Cancel"
                  onClick={() => setShowFilterAdjustment(false)}
                  bg="bg-gray-200"
                  color="text-gray-800"
                  cn="flex-1"
                />
                <Button
                  text={isAdjusting ? "Searching..." : "Search with Adjusted Filters"}
                  onClick={handleSearchWithAdjusted}
                  disabled={isAdjusting}
                  cn={`flex-1 ${isAdjusting ? "opacity-50 pointer-events-none" : ""}`}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">
          Found {properties.length} Properties
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => {
          // Extract images and prices using utility functions
          const images = getPropertyImages(property);
          const listingPrice = getPropertyPrice(property);
          const salePrice = getPropertySalePrice(property);
          const isSold = property.status === "sold" || property.listingStatus === "sold";

          return (
            <div
              key={property.zpid || property._id}
              className="border border-[#E4E4E7] rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              {/* Property Image Slider */}
              <ImageSlider
                images={images}
                alt={property.address || property.formattedAddress || "Property"}
              />

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-primary text-sm">
                    {property.address || property.formattedAddress}
                  </h4>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  {listingPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(listingPrice)}
                      </span>
                      {!isSold && (
                        <span className="text-xs text-gray-500">Listed Price</span>
                      )}
                    </div>
                  ) : null}
                  
                  {isSold && salePrice && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-green-600">
                        Sold: {formatCurrency(salePrice)}
                      </span>
                    </div>
                  )}
                  
                  {!listingPrice && !salePrice && (
                    <div className="text-sm text-gray-500">Price not available</div>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-gray-600">
                  {property.beds && (
                    <span>
                      <strong>{property.beds}</strong> Beds
                    </span>
                  )}
                  {property.baths && (
                    <span>
                      <strong>{property.baths}</strong> Baths
                    </span>
                  )}
                  {property.sqft && (
                    <span>
                      <strong>{property.sqft.toLocaleString()}</strong> SqFt
                    </span>
                  )}
                </div>

                {property.status && (
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        property.status === "sold"
                          ? "bg-green-100 text-green-800"
                          : property.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                )}

                <Button
                  text="Select"
                  onClick={() => onSelectProperty(property)}
                  cn="w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertySearchResults;
