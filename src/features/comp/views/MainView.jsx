import { useState } from "react";
import Input from "../../../components/shared/Input";
import CheckBox from "../../../assets/SVG/Checkbox";
import Location from "../../../components/shared/Location";
import UploadMedia from "../../../components/shared/UploadMedia";

const amenitiesList = [
  "Car Porch",
  "Oven",
  "Refrigerator",
  "Parking",
  "Gym",
  "Microwave",
];

const MainView = () => {
  const [formData, setFormData] = useState({
    propertyName: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    portions: "",
    area: "",
    street: "",
    city: "",
    state: "",
    postCode: "",
    price: "",
    amenities: [],
    media: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <div className=" mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Comp</h2>

      <div className="border p-6 border-gray-200 rounded-lg ">
        <div>
          <h3 className="font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="">Property Name</label>
              <Input
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                placeholder="Property Name"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">Type</label>
              <Input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">No. of Bedrooms</label>
              <Input
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="4"
                type="number"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">No. of Bathrooms</label>
              <Input
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="5"
                type="number"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">No. of Portions</label>
              <Input
                name="portions"
                value={formData.portions}
                onChange={handleChange}
                placeholder="1"
                type="number"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">Total Area (Sq. Ft)</label>
              <Input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="4000"
                type="number"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">Street Address</label>
              <Input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">City</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">State</label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="">Post Code</label>
              <Input
                name="postCode"
                value={formData.postCode}
                onChange={handleChange}
                placeholder="i.e: 99761"
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>
        {/* Map */}
        <div className="mt-12  relative z-0">
          <Location />
        </div>

        <div className="w-full sm:w-1/2">
          <h3 className="font-semibold mt-4">Property Price</h3>
          <Input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="$200,000"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mt-4">Amenities</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {amenitiesList.map((amenity) => {
              const isChecked = formData.amenities.includes(amenity);

              return (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm whitespace-nowrap transition ${
                    isChecked
                      ? "bg-gold-500 text-white border-gold-500"
                      : "border-gray-300 hover:border-gold-500"
                  }`}
                >
                  <CheckBox
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span className="truncate">{amenity}</span>
                </label>
              );
            })}
          </div>
        </div>

        <UploadMedia />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-6 py-2 rounded-lg mt-4 hover:opacity-90 cursor-pointer"
          >
            Start Automation
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainView;
