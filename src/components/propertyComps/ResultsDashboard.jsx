import ValuationMetricsCard from "./ValuationMetricsCard";
import MAOBreakdownCard from "./MAOBreakdownCard";
import DealScoreCard from "./DealScoreCard";
import RecommendationCard from "./RecommendationCard";
import ComparablesTable from "./ComparablesTable";
import ImageAnalysisGrid from "./ImageAnalysisGrid";
import GeminiImageAnalysisSection from "./GeminiImageAnalysisSection";
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

  const { property, analysis, comps, dealScore, mao, recommendation, comparisonSummary } =
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
          {(analysis?.conditionCategory || analysis?.repairExtent) && (
            <div>
              <span className="text-gray-600">Condition: </span>
              <span className="font-medium">
                {analysis.repairExtent || (analysis.conditionCategory === "light-repairs" ? "Light repairs" : analysis.conditionCategory === "heavy-repairs" ? "Heavy repairs" : "Medium repairs")}
              </span>
            </div>
          )}
          {(analysis?.estimatedRepairs !== undefined && analysis?.estimatedRepairs !== null) && (
            <div>
              <span className="text-gray-600">Repairs (used for MAO): </span>
              <span className="font-medium">{formatCurrency(analysis.estimatedRepairs)}</span>
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

      {/* Repair estimate breakdown: user vs AI (Gemini) */}
      {(analysis?.userEstimatedRepairs != null || analysis?.aiEstimatedRepairs != null) && (
        <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
          <h3 className="text-xl font-semibold text-primary mb-4">
            Repair Estimate Breakdown
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Your repair input is combined with AI-detected repairs from subject property photos and comparison with comps. The higher value is used for MAO.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.userEstimatedRepairs != null && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Your repair estimate</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(analysis.userEstimatedRepairs)}
                </p>
                <p className="text-xs text-gray-500 mt-1">From form (per sqft, roof, AC, other)</p>
              </div>
            )}
            {analysis.aiEstimatedRepairs != null && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">AI-detected (Gemini)</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(analysis.aiEstimatedRepairs)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analysis.aiRepairCostPerSqft != null
                    ? `SOP: $${analysis.aiRepairCostPerSqft}/sqft (${analysis.conditionCategory?.replace("-repairs", "") ?? "medium"})`
                    : "From subject photos + comp comparison"}
                </p>
                {analysis.aiRepairBreakdown && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Base {formatCurrency(analysis.aiRepairBreakdown.baseRehab)}
                    {analysis.aiRepairBreakdown.roofCost > 0 && ` + roof ${formatCurrency(analysis.aiRepairBreakdown.roofCost)}`}
                    {analysis.aiRepairBreakdown.hvacCost > 0 && ` + HVAC ${formatCurrency(analysis.aiRepairBreakdown.hvacCost)}`}
                    {analysis.aiRepairBreakdown.bufferPercent > 0 && ` + ${analysis.aiRepairBreakdown.bufferPercent}% buffer`}
                  </p>
                )}
              </div>
            )}
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Repairs used for MAO</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(analysis.estimatedRepairs)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Max of your estimate and AI estimate</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Subject vs comp summary (SOP: what comps have that subject is missing) */}
      {comparisonSummary?.subjectVsCompSummary && (
        <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Subject vs comps (photo comparison)</h3>
          <p className="text-sm text-amber-900">{comparisonSummary.subjectVsCompSummary}</p>
        </div>
      )}

      {/* Gemini image analysis: subject + comps (from analyze-selected response) */}
      {(analysisData.subjectImageAnalysis || (comps?.selected?.some((c) => c.imageAnalyses?.length > 0))) && (
        <GeminiImageAnalysisSection
          subjectImageAnalysis={analysisData.subjectImageAnalysis}
          comps={comps}
        />
      )}

      {/* Legacy: Image Analysis from separate API (when no Gemini data in response) */}
      {imageAnalyses && imageAnalyses.length > 0 && !analysisData.subjectImageAnalysis && (
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
