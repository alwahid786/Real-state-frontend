import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ResultsDashboard from "../../../components/propertyComps/ResultsDashboard";
import {
  useRecalculateMAOMutation,
  useGetImageAnalysesQuery,
} from "../rtk/propertyCompsApis";
import { setAnalysis, setImageAnalyses } from "../rtk/propertyCompsSlice";
import { toast } from "react-toastify";

const AnalysisResultsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { analysis, selectedProperty } = useSelector(
    (state) => state.propertyComps
  );
  const [recalculateMAO, { isLoading: isRecalculating }] =
    useRecalculateMAOMutation();

  // Get image analyses
  const { data: imageAnalysesData, isLoading: isLoadingImages } =
    useGetImageAnalysesQuery(selectedProperty?._id, {
      skip: !selectedProperty?._id,
    });

  useEffect(() => {
    if (imageAnalysesData?.data) {
      dispatch(
        setImageAnalyses({
          data: imageAnalysesData.data,
          loading: false,
          error: null,
        })
      );
    }
  }, [imageAnalysesData, dispatch]);

  const handleRecalculateMAO = async (inputs) => {
    if (!analysis?.data?.analysis?._id) {
      toast.error("Analysis ID not found");
      return;
    }

    try {
      const response = await recalculateMAO({
        analysisId: analysis.data.analysis._id,
        ...inputs,
      }).unwrap();

      if (response.success && response.data) {
        // Update analysis with new MAO values
        dispatch(
          setAnalysis({
            ...analysis,
            data: {
              ...analysis.data,
              analysis: response.data.analysis,
              mao: response.data.mao,
            },
          })
        );
        toast.success("MAO recalculated successfully!");
      } else {
        toast.error(response.message || "Failed to recalculate MAO");
      }
    } catch (error) {
      console.error("Recalculate error:", error);
      
      // Handle different error statuses
      if (error.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else if (error.status === 404) {
        toast.error("Analysis not found.");
      } else if (error.status === 400) {
        toast.error(error.data?.message || error.data?.error || "Invalid MAO inputs.");
      } else {
        toast.error(
          error.data?.message || error.data?.error || "Failed to recalculate MAO. Please try again."
        );
      }
    }
  };

  if (!analysis?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No analysis data available</p>
        <button
          onClick={() => navigate("/property-search")}
          className="text-primary underline"
        >
          Start New Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/property-details")}
          className="text-primary underline mb-4"
        >
          ← Back to Property Details
        </button>
        <ResultsDashboard
          analysisData={analysis.data}
          imageAnalyses={
            imageAnalysesData?.data || analysis.imageAnalyses?.data || []
          }
          onRecalculateMAO={handleRecalculateMAO}
          isRecalculating={isRecalculating}
          analysisId={analysis.data.analysis._id}
        />
      </div>
    </div>
  );
};

export default AnalysisResultsView;
