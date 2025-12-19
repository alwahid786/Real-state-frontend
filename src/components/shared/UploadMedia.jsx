import React, { useRef, useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { TbReplace } from "react-icons/tb";
import Button from "../../components/shared/Button";

const UploadMedia = () => {
  const imageRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleManualAdd = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReplace = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...files];
    updated[index] = {
      file,
      preview: URL.createObjectURL(file),
    };

    setFiles(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-primary">Upload Media</h3>

      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Uploaded Images */}
          {files.map((item, index) => (
            <div
              key={index}
              className="relative h-37.5 group rounded overflow-hidden"
            >
              <img
                src={item.preview}
                alt={`preview-${index}`}
                className="object-cover w-full h-full"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <label className="p-2 bg-primary text-white rounded cursor-pointer hover:bg-[#3EAD92]">
                    <TbReplace size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleReplace(e, index)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}

          {/* Upload Media Tile */}
          <div
            onClick={() => imageRef.current.click()}
            className="h-37.5 flex flex-col items-center justify-center gap-2 rounded cursor-pointer bg-[#D5D5D54D] hover:bg-[#D5D5D580] transition"
          >
            <FiUpload size={22} />
            <p className="font-medium text-sm">+ Upload</p>

            <input
              type="file"
              multiple
              accept="image/*"
              ref={imageRef}
              hidden
              onChange={handleManualAdd}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;
