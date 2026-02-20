import { formatCurrency } from "../../utils/formatters";

const STEP_ORDER = [
  "subject_prep",
  "subject_images",
  "subject_done",
  "comp",
  "repairs",
  "repairs_done",
  "arv",
  "arv_done",
  "mao",
  "mao_done",
  "deal_score",
  "complete",
];

const STEP_LABELS = {
  subject_prep: "Preparing subject property",
  subject_images: "Analyzing subject property images (AI)",
  subject_done: "Subject property ready",
  comp: "Analyzing comparables",
  repairs: "Calculating repair estimates",
  repairs_done: "Repair estimates calculated",
  arv: "Calculating After Repair Value (ARV)",
  arv_done: "ARV calculated",
  mao: "Calculating Max Allowable Offer (MAO)",
  mao_done: "MAO calculated",
  deal_score: "Calculating deal score & recommendation",
  complete: "Analysis complete",
};

const AnalysisProgressView = ({
  subjectAddress,
  steps,
  currentStep,
  compBeingAnalyzed,
  compIndex,
  compTotal,
  arv,
  mao,
  estimatedRepairs,
  isComplete,
  onViewResults,
}) => {
  const getStepStatus = (stepId) => {
    const stepOrder = STEP_ORDER.indexOf(stepId);
    const currentOrder = STEP_ORDER.indexOf(currentStep);
    if (stepOrder < currentOrder) return "done";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      {/* Subject property */}
      <div className="border border-primary/30 rounded-xl p-5 bg-primary/5">
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          Analysis running on
        </h3>
        <p className="text-lg font-semibold text-primary break-words">
          {subjectAddress || "—"}
        </p>
      </div>

      {/* Current activity (comp being analyzed, or current step message) */}
      {(compBeingAnalyzed || currentStep) && !isComplete && (
        <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
          <p className="text-sm font-medium text-amber-800 mb-1">
            Current step
          </p>
          {currentStep === "comp" && compBeingAnalyzed ? (
            <p className="text-amber-900">
              Analyzing comparable {compIndex} of {compTotal}:{" "}
              <span className="font-medium">{compBeingAnalyzed}</span>
            </p>
          ) : (
            <p className="text-amber-900">
              {STEP_LABELS[currentStep] || currentStep}
              {currentStep === "arv_done" && arv != null && (
                <span className="ml-2 font-semibold">
                  {formatCurrency(arv)}
                </span>
              )}
              {currentStep === "mao_done" && mao != null && (
                <span className="ml-2 font-semibold">
                  {formatCurrency(mao)}
                </span>
              )}
              {currentStep === "repairs_done" && estimatedRepairs != null && (
                <span className="ml-2 font-semibold">
                  {formatCurrency(estimatedRepairs)}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Steps list */}
      <div className="border border-[#E4E4E7] rounded-xl p-6 bg-white">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Analysis steps
        </h3>
        <ul className="space-y-3">
          {STEP_ORDER.filter((s) => s !== "comp" || steps.some((e) => e.step === "comp")).map((stepId) => {
            const status = stepId === "comp" && steps.some((e) => e.step === "comp")
              ? getStepStatus("comp")
              : getStepStatus(stepId);
            const label = stepId === "comp" && compIndex != null && compTotal != null
              ? `Analyzing comparables (${compIndex} of ${compTotal})`
              : STEP_LABELS[stepId] || stepId;
            return (
              <li
                key={stepId}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                  status === "active"
                    ? "bg-primary/10 border border-primary/30"
                    : status === "done"
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    status === "done"
                      ? "bg-green-500 text-white"
                      : status === "active"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {status === "done" ? "✓" : STEP_ORDER.indexOf(stepId) + 1}
                </span>
                <span
                  className={
                    status === "active"
                      ? "font-medium text-primary"
                      : status === "done"
                      ? "text-green-800"
                      : "text-gray-600"
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Complete state */}
      {isComplete && (
        <div className="border-2 border-green-300 rounded-xl p-8 bg-green-50 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Analysis complete
          </h3>
          <p className="text-green-700 mb-6">
            ARV, MAO, deal score, and recommendation are ready.
          </p>
          <button
            type="button"
            onClick={onViewResults}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            View full results
          </button>
        </div>
      )}

      {!isComplete && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
};

export default AnalysisProgressView;
