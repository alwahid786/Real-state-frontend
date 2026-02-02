const ImageAnalysisGrid = ({ imageAnalyses }) => {
  if (!imageAnalyses || imageAnalyses.length === 0) {
    return null;
  }

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Image Analysis Results
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageAnalyses.map((analysis) => (
          <div
            key={analysis._id}
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
                </span>
              </div>

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
    </div>
  );
};

export default ImageAnalysisGrid;
