import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { setSearchFilters } from "../../features/propertyComps/rtk/propertyCompsSlice";

const MAX_IMAGES = 60;

const PropertySearchForm = ({ onSubmit, isLoading }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    address: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - imageFiles.length;
    const toAdd = files.slice(0, remaining).filter((f) => f.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...toAdd]);
    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.address || formData.address.trim().length === 0) {
      setErrors({ address: "Address is required" });
      return;
    }

    setErrors({});
    dispatch(setSearchFilters(formData));

    if (onSubmit) {
      onSubmit({ ...formData, imageFiles });
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

        {/* Upload photos of the subject property (shown instead of listing photos after search) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload photos of this property (optional)
          </label>
          <p className="text-gray-500 text-xs mb-2">
            These will be used for the subject property instead of listing photos. You can add photos before or after searching.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddImages}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition cursor-pointer"
          >
            <FiUpload className="mx-auto text-gray-400 mb-2" size={28} />
            <p className="text-sm text-gray-600">
              Click or drag to add photos (up to {MAX_IMAGES})
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {imageFiles.length} photo(s) selected
            </p>
          </div>
          {imageFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group rounded overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                    aria-label="Remove"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
