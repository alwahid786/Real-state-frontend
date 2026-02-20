import { formatCurrency, formatDate } from "../../utils/formatters";

const ComparablesTable = ({ comps }) => {
  // Handle both old structure (topComps) and new structure (selected)
  const compsList = comps?.selected || comps?.topComps || [];
  const total = comps?.total || compsList.length;

  if (!comps || compsList.length === 0) {
    return (
      <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Comparables
        </h3>
        <p className="text-gray-600">No comparables found</p>
      </div>
    );
  }

  return (
    <div className="border border-[#E4E4E7] rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Selected Comparables ({total})
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Sale Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Sale Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Adjusted ARV
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Distance
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Comp Score
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {compsList.map((comp, index) => (
              <tr
                key={comp._id || index}
                className="border-b border-gray-100"
              >
                <td className="px-4 py-3 text-sm">
                  {comp.address || comp.formattedAddress}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(comp.saleDate)}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {formatCurrency(comp.salePrice)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">
                  {formatCurrency(comp.adjustedPrice)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {comp.distanceMiles?.toFixed(2) || "—"} mi
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      comp.compScore >= 80
                        ? "bg-green-100 text-green-800"
                        : comp.compScore >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {comp.compScore?.toFixed(1) || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {comp.dataSource || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compsList.length > 0 && (
        <p className="text-xs text-gray-500 mt-4">
          {compsList.length} {compsList.length === 1 ? 'comparable' : 'comparables'} used in ARV calculation
        </p>
      )}
    </div>
  );
};

export default ComparablesTable;
