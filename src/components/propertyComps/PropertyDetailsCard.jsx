import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../shared/Button";
import { 
  formatCurrency, 
  formatDate, 
  getPropertyImages,
  getPropertyPrice,
  getPropertySalePrice 
} from "../../utils/formatters";
import ImageSlider from "./ImageSlider";

// Fix default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

const PropertyDetailsCard = ({ property, onAnalyze, isAnalyzing }) => {
  if (!property) return null;

  const position = property.latitude && property.longitude
    ? [property.latitude, property.longitude]
    : null;

  const listingPrice = getPropertyPrice(property);
  const salePrice = getPropertySalePrice(property);
  const isSold = property.status === "sold" || property.listingStatus === "sold";
  const images = getPropertyImages(property);

  return (
    <div className="bg-white">
      {/* Images Section - Top */}
      {images.length > 0 && (
        <div className="mb-6">
          <ImageSlider
            images={images}
            alt={property.formattedAddress || property.address || "Property"}
            className="h-[500px] md:h-[600px] w-full rounded-lg overflow-hidden shadow-lg"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
      <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {property.formattedAddress || property.address}
            </h1>
        {property.propertyType && (
              <p className="text-lg text-gray-600">{property.propertyType}</p>
        )}
      </div>

          {/* Price Display */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {listingPrice ? (
            <div>
              <p className="text-sm text-gray-600 mb-1">Listed Price</p>
                  <p className="text-4xl font-bold text-primary">
                {formatCurrency(listingPrice)}
              </p>
                  {property.pricePerSqft && (
                    <p className="text-sm text-gray-500 mt-1">
                      ${property.pricePerSqft.toLocaleString()} per sqft
                    </p>
                  )}
            </div>
          ) : null}
          
          {isSold && salePrice && (
                <div className="md:text-right">
              <p className="text-sm text-gray-600 mb-1">Sale Price</p>
                  <p className="text-3xl font-semibold text-green-600">
                {formatCurrency(salePrice)}
              </p>
            </div>
          )}
          
          {!listingPrice && !salePrice && (
            <p className="text-sm text-gray-500">Price information not available</p>
          )}
            </div>
        </div>
      </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-4">
        {property.beds && (
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Beds</p>
              <p className="text-2xl font-bold text-gray-900">{property.beds}</p>
          </div>
        )}
        {property.baths && (
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Baths</p>
              <p className="text-2xl font-bold text-gray-900">{property.baths}</p>
          </div>
        )}
        {property.squareFootage && (
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">SqFt</p>
              <p className="text-2xl font-bold text-gray-900">
              {property.squareFootage.toLocaleString()}
            </p>
          </div>
        )}
      </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Information Card */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Basic Information
            </h3>
            <div className="space-y-3 text-sm">
        {property.lotSize && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size</span>
                  <span className="font-medium text-gray-900">
                    {typeof property.lotSize === 'number' 
                      ? property.lotSize.toLocaleString() 
                      : property.lotSize}
                    {property.lotAreaUnits && ` ${property.lotAreaUnits}`}
                  </span>
          </div>
        )}
        {property.yearBuilt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                </div>
              )}
              {property.propertyCondition && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium text-gray-900">{property.propertyCondition}</span>
                </div>
              )}
              {property.listingStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize text-gray-900">{property.listingStatus}</span>
          </div>
        )}
              {property.isNewConstruction && (
                <div className="flex justify-between">
                  <span className="text-gray-600">New Construction</span>
                  <span className="font-medium text-green-600">Yes</span>
          </div>
        )}
            </div>
          </div>

          {/* Financial Information Card */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Financial Information
            </h3>
            <div className="space-y-3 text-sm">
              {property.estimatedValue && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Zestimate</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(property.estimatedValue)}
                  </span>
                </div>
              )}
              {property.rentZestimate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rent Zestimate</span>
                  <span className="font-medium text-gray-900">
                    {property.rentZestimateFormatted || formatCurrency(property.rentZestimate)}
                  </span>
          </div>
        )}
        {property.lastSoldPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sold Price</span>
                  <span className="font-medium text-gray-900">
              {formatCurrency(property.lastSoldPrice)}
            </span>
          </div>
        )}
              {property.lastSoldDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sold</span>
                  <span className="font-medium text-gray-900">{formatDate(property.lastSoldDate)}</span>
          </div>
        )}
        {property.daysOnMarket !== undefined && property.daysOnMarket !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Days on Market</span>
                  <span className="font-medium text-gray-900">{property.daysOnMarket}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
              Additional Details
            </h3>
            <div className="space-y-3 text-sm">
              {property.neighborhood && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Neighborhood</span>
                  <span className="font-medium text-gray-900">{property.neighborhood}</span>
                </div>
              )}
              {property.county && (
                <div className="flex justify-between">
                  <span className="text-gray-600">County</span>
                  <span className="font-medium text-gray-900">{property.county}</span>
                </div>
              )}
              {property.stories && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Stories</span>
                  <span className="font-medium text-gray-900">{property.stories}</span>
                </div>
              )}
              {property.architecturalStyle && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Style</span>
                  <span className="font-medium text-gray-900">{property.architecturalStyle}</span>
                </div>
              )}
              {property.roofType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Roof</span>
                  <span className="font-medium text-gray-900">{property.roofType}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Features Section */}
        {(property.hasGarage || property.parkingCapacity || property.hasCooling || 
          property.hasHeating || property.hasFireplace || property.hasPool || 
          property.hasSpa || property.hasAssociation) && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {property.hasGarage && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="font-medium">Garage</span>
                  {property.parkingCapacity && (
                    <span className="text-gray-500 text-xs">({property.parkingCapacity} spaces)</span>
                  )}
                </div>
              )}
              {property.parkingFeatures && property.parkingFeatures.length > 0 && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-gray-600 text-xs">Parking: </span>
                  <span className="font-medium">{property.parkingFeatures.join(', ')}</span>
                </div>
              )}
              {property.hasCooling && property.cooling && property.cooling.length > 0 && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-gray-600 text-xs">Cooling: </span>
                  <span className="font-medium">{property.cooling.join(', ')}</span>
                </div>
              )}
              {property.hasHeating && property.heating && property.heating.length > 0 && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-gray-600 text-xs">Heating: </span>
                  <span className="font-medium">{property.heating.join(', ')}</span>
                </div>
              )}
              {property.hasFireplace && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="font-medium">Fireplace</span>
                  {property.fireplaces && (
                    <span className="text-gray-500 text-xs">({property.fireplaces})</span>
                  )}
                </div>
              )}
              {property.hasPool && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="font-medium">Pool</span>
                </div>
              )}
              {property.hasSpa && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="font-medium">Spa</span>
                </div>
              )}
              {property.hasAssociation && property.hoaFee && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <span className="text-gray-600 text-xs">HOA Fee: </span>
                  <span className="font-medium">{property.hoaFee}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interior & Exterior Features */}
        {((property.interiorFeatures && property.interiorFeatures.length > 0) || 
          (property.exteriorFeatures && property.exteriorFeatures.length > 0) ||
          (property.flooring && property.flooring.length > 0) ||
          (property.appliances && property.appliances.length > 0)) && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interior & Exterior Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {property.interiorFeatures && property.interiorFeatures.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <span className="text-gray-600 font-medium block mb-2">Interior Features</span>
                  <span className="text-gray-700">{property.interiorFeatures.join(', ')}</span>
                </div>
              )}
              {property.exteriorFeatures && property.exteriorFeatures.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <span className="text-gray-600 font-medium block mb-2">Exterior Features</span>
                  <span className="text-gray-700">{property.exteriorFeatures.join(', ')}</span>
                </div>
              )}
              {property.flooring && property.flooring.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <span className="text-gray-600 font-medium block mb-2">Flooring</span>
                  <span className="text-gray-700">{property.flooring.join(', ')}</span>
                </div>
              )}
              {property.appliances && property.appliances.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <span className="text-gray-600 font-medium block mb-2">Appliances</span>
                  <span className="text-gray-700">{property.appliances.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tax & Financial Information */}
        {(property.taxAnnualAmount || property.taxAssessedValue || 
          property.propertyTaxRate || property.hoaFee) && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax & Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {property.taxAnnualAmount && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between">
                  <span className="text-gray-600">Annual Tax</span>
                  <span className="font-medium text-gray-900">{formatCurrency(property.taxAnnualAmount)}</span>
                </div>
              )}
              {property.taxAssessedValue && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between">
                  <span className="text-gray-600">Tax Assessed Value</span>
                  <span className="font-medium text-gray-900">{formatCurrency(property.taxAssessedValue)}</span>
                </div>
              )}
              {property.propertyTaxRate && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between">
                  <span className="text-gray-600">Tax Rate</span>
                  <span className="font-medium text-gray-900">{property.propertyTaxRate}%</span>
                </div>
              )}
              {property.hoaFee && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between">
                  <span className="text-gray-600">HOA Fee</span>
                  <span className="font-medium text-gray-900">{property.hoaFee}</span>
                </div>
              )}
            </div>
      </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
        )}

        {/* Map Section - Bottom */}
      {position && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
            <div className="h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <MapContainer
              center={position}
              zoom={15}
                scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap &copy; CARTO"
              />
              <Marker position={position}>
                <Popup>{property.formattedAddress || property.address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

        {/* Action Button */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <Button
          text={isAnalyzing ? "Finding Comparables..." : "Find Sold Comparables"}
          onClick={onAnalyze}
          disabled={isAnalyzing}
            cn={`w-full py-3 text-lg ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
        />
          <p className="text-sm text-gray-500 mt-3 text-center">
          We'll search for sold properties to use as comparables
        </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsCard;
