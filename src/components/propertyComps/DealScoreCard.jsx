import {
  getDealScoreColor,
  getDealScoreBgColor,
} from "../../utils/formatters";

const DealScoreCard = ({ dealScore }) => {
  if (!dealScore) return null;

  const score = dealScore.overall || 0;
  const color = getDealScoreColor(score);
  const bgColor = getDealScoreBgColor(score);

  // Calculate percentage for circular progress
  const percentage = score;

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-6">Deal Score</h3>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Circular Score */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg
              className="transform -rotate-90 w-48 h-48"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="88"
                stroke="#E4E4E7"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 88} ${2 * Math.PI * 88}`}
                className={color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-5xl font-bold ${color}`}>{score.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Deal Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-4">
          <ScoreItem
            label="Spread Score (40%)"
            value={dealScore.spreadScore}
            color={color}
          />
          <ScoreItem
            label="Repair Score (20%)"
            value={dealScore.repairScore}
            color={color}
          />
          <ScoreItem
            label="Market Score (20%)"
            value={dealScore.marketScore}
            color={color}
          />
          <ScoreItem
            label="Area Score (10%)"
            value={dealScore.areaScore}
            color={color}
          />
          <ScoreItem
            label="Comp Strength (10%)"
            value={dealScore.compStrengthScore}
            color={color}
          />
        </div>
      </div>
    </div>
  );
};

const ScoreItem = ({ label, value, color }) => {
  const percentage = value || 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${color}`}>{value.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            percentage >= 80
              ? "bg-green-600"
              : percentage >= 60
              ? "bg-yellow-600"
              : percentage >= 40
              ? "bg-orange-600"
              : "bg-red-600"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DealScoreCard;
