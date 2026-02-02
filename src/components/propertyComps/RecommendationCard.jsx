import {
  getRecommendationLabel,
  getRecommendationVariant,
} from "../../utils/formatters";

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const variant = getRecommendationVariant(recommendation.recommendation);
  const label = getRecommendationLabel(recommendation.recommendation);

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Recommendation
      </h3>
      <div className={`p-4 rounded-lg ${variant}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">{label}</span>
        </div>
        <p className="mt-3 text-sm">{recommendation.recommendationReason}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
