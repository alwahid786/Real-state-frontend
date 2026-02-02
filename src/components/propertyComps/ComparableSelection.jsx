import { useState } from "react";
import Button from "../shared/Button";
import ImageSlider from "./ImageSlider";
import { formatCurrency, formatDate, getPropertyImages } from "../../utils/formatters";

const ComparableSelection = ({ comparables, selectedCompIds, onToggleComp, onAnalyze, isAnalyzing, maoInputs, onMaoInputChange }) => {
  const [showMaoInputs, setShowMaoInputs] = useState(false);

  const selectedCount = selectedCompIds.length;
  const canAnalyze = selectedCount >= 1 && selectedCount <= 5;
  const minWarning = selectedCount < 3; // Warn if less than 3, but allow analysis
  const maxWarning = selectedCount > 5;

  const handleToggle = (compId) => {
    if (selectedCompIds.includes(compId)) {
      // Deselect
      onToggleComp(compId, false);
    } else {
      // Select (max 5)
      if (selectedCount >= 5) {
        return; // Already at max
      }
      onToggleComp(compId, true);
    }
  };

  if (!comparables || comparables.length === 0) {
    return (
      <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white text-center">
        <p className="text-gray-600">No comparables found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Header */}
      <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              Select Comparables
            </h2>
            <p className="text-sm text-gray-600">
              {comparables.length >= 3 
                ? "Review the sold properties below and select 3-5 that best match your subject property."
                : `Only ${comparables.length} comparable ${comparables.length === 1 ? 'property' : 'properties'} found. You can select ${comparables.length === 1 ? 'it' : 'them'}, but analysis requires at least 3 comparables for accurate results.`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${
              canAnalyze 
                ? "bg-green-100 text-green-800" 
                : minWarning 
                ? "bg-yellow-100 text-yellow-800" 
                : "bg-red-100 text-red-800"
            }`}>
              <span className="text-sm font-semibold">
                {selectedCount} of 5 selected
              </span>
            </div>
          </div>
        </div>

        {/* Validation Messages */}
        {minWarning && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {comparables.length < 3 
                ? `⚠️ Only ${comparables.length} comparable ${comparables.length === 1 ? 'property' : 'properties'} available. Analysis requires at least 3 comparables for accurate results. Please try expanding the search radius or time window.`
                : `⚠️ Please select at least 3 comparables to proceed with analysis. ${selectedCount > 0 ? `(${selectedCount} selected)` : ''}`}
            </p>
          </div>
        )}
        {maxWarning && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Maximum 5 comparables allowed. Please deselect some comparables.
            </p>
          </div>
        )}
        {canAnalyze && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Ready to analyze! {selectedCount} comparables selected.
            </p>
          </div>
        )}
        {comparables.length < 3 && selectedCount === comparables.length && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ All available comparables are selected ({selectedCount} of {comparables.length}). Analysis will proceed, but results may be less accurate with fewer than 3 comparables.
            </p>
          </div>
        )}
      </div>

      {/* MAO Inputs Section */}
      <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
        <button
          onClick={() => setShowMaoInputs(!showMaoInputs)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-primary">
            MAO Calculation Inputs
          </h3>
          <span className="text-primary">{showMaoInputs ? "−" : "+"}</span>
        </button>

        {showMaoInputs && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Repairs ($)
              </label>
              <input
                type="number"
                value={maoInputs.estimatedRepairs || 0}
                onChange={(e) => onMaoInputChange({ estimatedRepairs: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holding Cost ($)
              </label>
              <input
                type="number"
                value={maoInputs.holdingCost || 0}
                onChange={(e) => onMaoInputChange({ holdingCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Closing Cost ($)
              </label>
              <input
                type="number"
                value={maoInputs.closingCost || 0}
                onChange={(e) => onMaoInputChange({ closingCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wholesale Fee ($)
              </label>
              <input
                type="number"
                value={maoInputs.wholesaleFee || 0}
                onChange={(e) => onMaoInputChange({ wholesaleFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MAO Rule
              </label>
              <select
                value={maoInputs.maoRule || "70%"}
                onChange={(e) => onMaoInputChange({ maoRule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="65%">65%</option>
                <option value="70%">70%</option>
                <option value="75%">75%</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Comparables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparables.map((comp) => {
          const isSelected = selectedCompIds.includes(comp._id);
          const images = getPropertyImages(comp);

          return (
            <div
              key={comp._id}
              className={`border-2 rounded-lg overflow-hidden bg-white transition-all ${
                isSelected
                  ? "border-primary shadow-lg"
                  : "border-[#E4E4E7] hover:border-primary/50"
              }`}
            >
              {/* Selection Checkbox */}
              <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(comp._id)}
                    disabled={!isSelected && selectedCount >= 5}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {isSelected ? "Selected" : "Select"}
                  </span>
                </label>
                {comp.compScore !== undefined && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      comp.compScore >= 80
                        ? "bg-green-100 text-green-800"
                        : comp.compScore >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Score: {comp.compScore.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div className="h-48">
                  <ImageSlider
                    images={images}
                    alt={comp.address || comp.formattedAddress || "Comparable property"}
                    className="h-full"
                  />
                </div>
              )}

              {/* Comp Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-primary text-sm">
                    {comp.address || comp.formattedAddress}
                  </h4>
                </div>

                {/* Sale Price */}
                {comp.salePrice && (
                  <div>
                    <p className="text-xs text-gray-600">Sale Price</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(comp.salePrice)}
                    </p>
                  </div>
                )}

                {/* Sale Date */}
                {comp.saleDate && (
                  <div>
                    <p className="text-xs text-gray-600">Sale Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(comp.saleDate)}
                    </p>
                  </div>
                )}

                {/* Property Details */}
                <div className="flex gap-4 text-sm text-gray-600">
                  {comp.beds && (
                    <span>
                      <strong>{comp.beds}</strong> Beds
                    </span>
                  )}
                  {comp.baths && (
                    <span>
                      <strong>{comp.baths}</strong> Baths
                    </span>
                  )}
                  {comp.squareFootage && (
                    <span>
                      <strong>{comp.squareFootage.toLocaleString()}</strong> SqFt
                    </span>
                  )}
                </div>

                {/* Additional Details */}
                <div className="space-y-1 text-xs text-gray-600">
                  {comp.distanceMiles !== undefined && (
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span className="font-medium">{comp.distanceMiles.toFixed(2)} miles</span>
                    </div>
                  )}
                  {comp.dataSource && (
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="font-medium capitalize">{comp.dataSource}</span>
                    </div>
                  )}
                  {comp.yearBuilt && (
                    <div className="flex justify-between">
                      <span>Year Built:</span>
                      <span className="font-medium">{comp.yearBuilt}</span>
                    </div>
                  )}
                  {comp.propertyType && (
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{comp.propertyType}</span>
                    </div>
                  )}
                </div>

                {/* Condition Indicators */}
                {(comp.conditionRating || comp.renovationIndicators?.length > 0 || comp.damageFlags?.length > 0) && (
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    {comp.conditionRating && (
                      <div className="text-xs">
                        <span className="text-gray-600">Condition: </span>
                        <span className="font-medium">{comp.conditionRating}/5</span>
                      </div>
                    )}
                    {comp.renovationIndicators?.length > 0 && (
                      <div className="text-xs">
                        <span className="text-green-600">
                          ✓ {comp.renovationIndicators.join(", ")}
                        </span>
                      </div>
                    )}
                    {comp.damageFlags?.length > 0 && (
                      <div className="text-xs">
                        <span className="text-red-600">
                          ⚠️ {comp.damageFlags.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analyze Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <Button
          text={isAnalyzing ? "Running Analysis..." : "Run Analysis with Selected Comps"}
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          cn={`${!canAnalyze || isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
        />
        {selectedCount === 0 && (
          <p className="text-sm text-center text-gray-600 mt-2">
            Please select at least 1 comparable to continue
          </p>
        )}
        {selectedCount > 0 && selectedCount < 3 && (
          <p className="text-sm text-center text-yellow-600 mt-2">
            ⚠️ Only {selectedCount} comparable{selectedCount === 1 ? '' : 's'} selected. Analysis requires at least 3 for accurate results.
          </p>
        )}
      </div>
    </div>
  );
};

export default ComparableSelection;
