import { useState } from "react";
import ImageAnalysisGrid from "./ImageAnalysisGrid";

const AggregatedSummary = ({ aggregated, label }) => {
  if (!aggregated) return null;
  return (
    <div className="rounded-lg bg-slate-50 p-4 text-sm">
      <p className="font-medium text-slate-700 mb-2">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {aggregated.conditionCategory && (
          <div>
            <span className="text-slate-500">Category</span>
            <p className="font-medium capitalize">
              {(aggregated.conditionCategory || "").replace(/-repairs?/, " repairs")}
            </p>
          </div>
        )}
        {aggregated.interiorScore != null && (
          <div>
            <span className="text-slate-500">Interior</span>
            <p className="font-medium">{aggregated.interiorScore}/5</p>
          </div>
        )}
        {aggregated.exteriorScore != null && (
          <div>
            <span className="text-slate-500">Exterior</span>
            <p className="font-medium">{aggregated.exteriorScore}/5</p>
          </div>
        )}
        {aggregated.overallConditionScore != null && (
          <div>
            <span className="text-slate-500">Overall</span>
            <p className="font-medium">{aggregated.overallConditionScore}/10</p>
          </div>
        )}
        {aggregated.damageRiskScore != null && (
          <div>
            <span className="text-slate-500">Damage risk</span>
            <p className="font-medium">{aggregated.damageRiskScore}/100</p>
          </div>
        )}
        {aggregated.renovationScore != null && (
          <div>
            <span className="text-slate-500">Renovation</span>
            <p className="font-medium">{aggregated.renovationScore}/100</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GeminiImageAnalysisSection = ({ subjectImageAnalysis, comps }) => {
  const hasSubject = subjectImageAnalysis?.imageAnalyses?.length > 0;
  const compsWithAnalyses = (comps?.selected || []).filter(
    (c) => c.imageAnalyses && c.imageAnalyses.length > 0
  );
  if (!hasSubject && compsWithAnalyses.length === 0) return null;

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-2">
        Image analysis (Gemini)
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        What the AI determined from the property photos. This drives condition
        category, repair estimates, and ARV adjustments when comparing subject
        to comps.
      </p>

      {/* Subject property */}
      {hasSubject && (
        <div className="mb-8">
          <h4 className="text-lg font-medium text-primary mb-3">
            Subject property
          </h4>
          <AggregatedSummary
            aggregated={subjectImageAnalysis.aggregated}
            label="Aggregated condition (from all subject images)"
          />
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Per-image analysis</p>
            <ImageAnalysisGrid
              imageAnalyses={subjectImageAnalysis.imageAnalyses}
              embedded
            />
          </div>
        </div>
      )}

      {/* Comp properties */}
      {compsWithAnalyses.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-primary mb-3">
            Comparable properties
          </h4>
          <div className="space-y-6">
            {compsWithAnalyses.map((comp) => (
              <CompAnalysisBlock key={comp._id} comp={comp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CompAnalysisBlock = ({ comp }) => {
  const [expanded, setExpanded] = useState(false);
  const hasAggregated = comp.aggregatedImageScores && Object.keys(comp.aggregatedImageScores).length > 0;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 text-left"
      >
        <span className="font-medium text-slate-800">
          {comp.address || comp.formattedAddress || "Comp"}
        </span>
        <span className="text-slate-500 text-sm">
          {comp.imageAnalyses?.length || 0} image(s) analyzed
          {comp.conditionAdjustmentPercent != null &&
            comp.conditionAdjustmentPercent !== 0 && (
              <span className="ml-2 text-primary">
                · ARV adj. {(comp.conditionAdjustmentPercent * 100).toFixed(1)}%
              </span>
            )}
        </span>
        <span className="text-slate-400">{expanded ? "▼" : "▶"}</span>
      </button>
      {expanded && (
        <div className="p-4 border-t border-slate-200 space-y-4">
          {hasAggregated && (
            <AggregatedSummary
              aggregated={comp.aggregatedImageScores}
              label="Aggregated condition (from comp images)"
            />
          )}
          {comp.conditionAdjustmentPercent != null &&
            comp.conditionAdjustmentPercent !== 0 && (
              <p className="text-sm text-gray-600">
                This comp’s value was adjusted by{" "}
                {(comp.conditionAdjustmentPercent * 100).toFixed(1)}% when
                calculating ARV (subject vs comp condition comparison).
              </p>
            )}
          {/* Room-by-room subject vs comp (SOP: align room types, compare condition) */}
          {comp.roomTypeComparisons?.length > 0 && (
            <div className="rounded bg-slate-100 p-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Subject vs this comp by room</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {comp.roomTypeComparisons.map((r, i) => (
                  <li key={i}>
                    <span className="capitalize">{r.roomType?.replace(/-/g, " ")}</span>: subject {r.subjectCondition}/5 → comp {r.compCondition}/5
                    {r.conditionDifference !== 0 && (
                      <span className="text-primary ml-1">
                        ({((r.adjustmentPercent ?? 0) * 100).toFixed(1)}% ARV adj.)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 mb-2">Per-image analysis</p>
            <ImageAnalysisGrid
              imageAnalyses={comp.imageAnalyses}
              embedded
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiImageAnalysisSection;
