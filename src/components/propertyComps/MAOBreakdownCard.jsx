import { formatCurrency } from "../../utils/formatters";

const MAOBreakdownCard = ({ mao }) => {
  if (!mao || !mao.breakdown) return null;

  const breakdown = mao.breakdown;

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-6">
        MAO Breakdown
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">ARV</span>
          <span className="font-semibold text-primary">
            {formatCurrency(breakdown.arv)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">
            Base MAO ({Math.round(breakdown.rulePercent * 100)}% Rule)
          </span>
          <span className="font-semibold text-primary">
            {formatCurrency(breakdown.baseMAO)}
          </span>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between items-center py-2 text-red-600">
          <span>Estimated Repairs</span>
          <span className="font-semibold">
            -{formatCurrency(breakdown.estimatedRepairs)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 text-red-600">
          <span>Holding Cost</span>
          <span className="font-semibold">
            -{formatCurrency(breakdown.holdingCost)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 text-red-600">
          <span>Closing Cost</span>
          <span className="font-semibold">
            -{formatCurrency(breakdown.closingCost)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 text-red-600">
          <span>Wholesale Fee</span>
          <span className="font-semibold">
            -{formatCurrency(breakdown.wholesaleFee)}
          </span>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between items-center py-2 text-red-600">
          <span className="font-medium">Total Fees</span>
          <span className="font-semibold">
            -{formatCurrency(breakdown.totalFees)}
          </span>
        </div>

        <div className="border-t-2 border-primary my-3"></div>

        <div className="flex justify-between items-center py-2">
          <span className="text-lg font-semibold text-primary">Final MAO</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(mao.mao)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MAOBreakdownCard;
