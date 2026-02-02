import { useState } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Modal from "../shared/Modal";

const MAOInputEditor = ({ currentInputs, onRecalculate, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    estimatedRepairs: currentInputs?.estimatedRepairs || 0,
    holdingCost: currentInputs?.holdingCost || 0,
    closingCost: currentInputs?.closingCost || 0,
    wholesaleFee: currentInputs?.wholesaleFee || 0,
    maoRule: currentInputs?.maoRule || "70%",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "maoRule" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = () => {
    if (onRecalculate) {
      onRecalculate(inputs);
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        text="Adjust MAO Inputs"
        onClick={() => setIsOpen(true)}
        cn="max-w-xs"
        bg="bg-gray-200"
        color="text-gray-800"
      />

      {isOpen && (
        <Modal
          title="Adjust MAO Inputs"
          onClose={() => setIsOpen(false)}
          width="w-full md:w-[500px]"
        >
          <div className="space-y-4">
            <Input
              label="Estimated Repairs"
              name="estimatedRepairs"
              type="number"
              value={inputs.estimatedRepairs}
              onChange={handleChange}
              min={0}
              step={100}
            />

            <Input
              label="Holding Cost"
              name="holdingCost"
              type="number"
              value={inputs.holdingCost}
              onChange={handleChange}
              min={0}
              step={100}
            />

            <Input
              label="Closing Cost"
              name="closingCost"
              type="number"
              value={inputs.closingCost}
              onChange={handleChange}
              min={0}
              step={100}
            />

            <Input
              label="Wholesale Fee"
              name="wholesaleFee"
              type="number"
              value={inputs.wholesaleFee}
              onChange={handleChange}
              min={0}
              step={100}
            />

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                MAO Rule
              </label>
              <select
                name="maoRule"
                value={inputs.maoRule}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-[#E4E4E7] rounded-md outline-none text-sm"
              >
                <option value="65%">65% Rule</option>
                <option value="70%">70% Rule (Standard)</option>
                <option value="75%">75% Rule</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                text="Cancel"
                onClick={() => setIsOpen(false)}
                bg="bg-gray-200"
                color="text-gray-800"
                cn="flex-1"
              />
              <Button
                text={isLoading ? "Recalculating..." : "Recalculate MAO"}
                onClick={handleSubmit}
                disabled={isLoading}
                cn={`flex-1 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MAOInputEditor;
