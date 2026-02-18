const ImageAnalysisGrid = ({ imageAnalyses, title = "Image Analysis Results", embedded = false }) => {
  if (!imageAnalyses || imageAnalyses.length === 0) {
    return null;
  }

  const grid = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {imageAnalyses.map((analysis, index) => (
        <div
          key={analysis._id ?? analysis.imageUrl ?? `img-${index}`}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={analysis.imageUrl}
                alt={analysis.imageType}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                  {analysis.imageType}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Condition Score</span>
                <span className="text-sm font-semibold">
                  {analysis.conditionScore}/5
                  {analysis.confidence != null && (
                    <span className="text-gray-500 font-normal ml-1">
                      ({analysis.confidence}% conf.)
                    </span>
                  )}
                </span>
              </div>

              {analysis.conditionDetails && Object.values(analysis.conditionDetails).some(Boolean) && (
                <div className="text-xs text-gray-600 space-y-0.5">
                  {[
                    analysis.conditionDetails.flooringType || analysis.conditionDetails.flooringCondition,
                    analysis.conditionDetails.wallCondition,
                    analysis.conditionDetails.paintQuality,
                    analysis.conditionDetails.cabinetryMaterials,
                    analysis.conditionDetails.countertopType,
                    analysis.conditionDetails.appliances,
                    analysis.conditionDetails.bathroomFixtures,
                    analysis.conditionDetails.roofWear,
                    analysis.conditionDetails.landscapingCondition,
                  ].filter(Boolean).slice(0, 4).map((val, i) => (
                    <p key={i}>{val}</p>
                  ))}
                </div>
              )}

              {analysis.renovationIndicators &&
                analysis.renovationIndicators.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Renovations:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.renovationIndicators.map((indicator, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {analysis.damageFlags && analysis.damageFlags.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Damage Flags:</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.damageFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  if (embedded) return grid;
  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      {title && (
        <h3 className="text-xl font-semibold text-primary mb-6">{title}</h3>
      )}
      {grid}
    </div>
  );
};

export default ImageAnalysisGrid;
