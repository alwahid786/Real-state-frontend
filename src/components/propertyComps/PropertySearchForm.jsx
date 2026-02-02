import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { setSearchFilters } from "../../features/propertyComps/rtk/propertyCompsSlice";

const PropertySearchForm = ({ onSubmit, isLoading }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    address: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate address
    if (!formData.address || formData.address.trim().length === 0) {
      setErrors({ address: "Address is required" });
      return;
    }

    // Clear errors
    setErrors({});

    // Save to Redux
    dispatch(setSearchFilters(formData));
    
    // Call parent onSubmit
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Address Field */}
        <div>
          <Input
            label="Property Address *"
            name="address"
            placeholder="e.g., 2659 Central Park Ct, Owensboro, KY 42303"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Enter the full property address including street, city, state, and zip code
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          text={isLoading ? "Searching..." : "Search Property"}
          disabled={isLoading}
          cn={`max-w-xs ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        />
      </div>
    </form>
  );
};

export default PropertySearchForm;
