import ValuationMetricsCard from "./ValuationMetricsCard";
import MAOBreakdownCard from "./MAOBreakdownCard";
import DealScoreCard from "./DealScoreCard";
import RecommendationCard from "./RecommendationCard";
import ComparablesTable from "./ComparablesTable";
import ImageAnalysisGrid from "./ImageAnalysisGrid";
import MAOInputEditor from "./MAOInputEditor";
import { formatCurrency, formatDate } from "../../utils/formatters";

const ResultsDashboard = ({
  analysisData,
  imageAnalyses = [],
  onRecalculateMAO,
  isRecalculating,
  analysisId,
}) => {
  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analysis data available</p>
      </div>
    );
  }

  const { property, analysis, comps, dealScore, mao, recommendation } =
    analysisData;

  return (
    <div className="space-y-6">
      {/* Property Summary */}
      <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          {property?.formattedAddress || property?.address}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {property?.propertyCategory && (
            <div>
              <span className="text-gray-600">Category: </span>
              <span className="font-medium">{property.propertyCategory}</span>
            </div>
          )}
          {analysis?.conditionCategory && (
            <div>
              <span className="text-gray-600">Condition: </span>
              <span className="font-medium">{analysis.conditionCategory}</span>
            </div>
          )}
          {property?.beds && (
            <div>
              <span className="text-gray-600">Beds: </span>
              <span className="font-medium">{property.beds}</span>
            </div>
          )}
          {property?.baths && (
            <div>
              <span className="text-gray-600">Baths: </span>
              <span className="font-medium">{property.baths}</span>
            </div>
          )}
          {property?.squareFootage && (
            <div>
              <span className="text-gray-600">SqFt: </span>
              <span className="font-medium">
                {property.squareFootage.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Valuation Metrics */}
      <ValuationMetricsCard analysis={analysis} />

      {/* Recommendation */}
      <RecommendationCard recommendation={recommendation} />

      {/* Deal Score */}
      <DealScoreCard dealScore={dealScore} />

      {/* MAO Breakdown */}
      <div className="flex justify-end mb-4">
        <MAOInputEditor
          currentInputs={mao?.breakdown}
          onRecalculate={(inputs) => {
            if (onRecalculateMAO && analysisId) {
              onRecalculateMAO({ analysisId, ...inputs });
            }
          }}
          isLoading={isRecalculating}
        />
      </div>
      <MAOBreakdownCard mao={mao} />

      {/* Comparables Table */}
      <ComparablesTable comps={comps} />

      {/* Image Analysis */}
      {imageAnalyses && imageAnalyses.length > 0 && (
        <ImageAnalysisGrid imageAnalyses={imageAnalyses} />
      )}

      {/* Condition Scores Summary */}
      {analysis && (
        <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
          <h3 className="text-xl font-semibold text-primary mb-4">
            Condition Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analysis.interiorScore !== undefined && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Interior Score</p>
                <p className="text-2xl font-bold text-primary">
                  {analysis.interiorScore}/5
                </p>
              </div>
            )}
            {analysis.exteriorScore !== undefined && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Exterior Score</p>
                <p className="text-2xl font-bold text-primary">
                  {analysis.exteriorScore}/5
                </p>
              </div>
            )}
            {analysis.overallConditionScore !== undefined && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Condition</p>
                <p className="text-2xl font-bold text-primary">
                  {analysis.overallConditionScore}/10
                </p>
              </div>
            )}
            {analysis.renovationScore !== undefined && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Renovation Score</p>
                <p className="text-2xl font-bold text-primary">
                  {analysis.renovationScore}/100
                </p>
              </div>
            )}
            {analysis.damageRiskScore !== undefined && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Damage Risk</p>
                <p className="text-2xl font-bold text-primary">
                  {analysis.damageRiskScore}/100
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;
