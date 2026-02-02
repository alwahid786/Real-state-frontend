import { formatCurrency } from "../../utils/formatters";

const ValuationMetricsCard = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Valuation Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">After Repair Value (ARV)</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(analysis.arv)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Estimated value after repairs
          </p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            Max Allowable Offer (MAO)
          </p>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(analysis.mao)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Maximum recommended offer
          </p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Suggested Offer</p>
          <p className="text-3xl font-bold text-purple-700">
            {formatCurrency(analysis.suggestedOffer)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Recommended starting offer (5% below MAO)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValuationMetricsCard;
