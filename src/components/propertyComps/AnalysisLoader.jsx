import Spinner from "../shared/Spinner";

const AnalysisLoader = ({ message = "Finding comparable properties and analyzing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Spinner size={60} />
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-primary">{message}</p>
        <p className="text-sm text-gray-600">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
};

export default AnalysisLoader;
