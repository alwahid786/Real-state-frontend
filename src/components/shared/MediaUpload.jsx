import React, { useRef, useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { TbReplace } from "react-icons/tb";
import Button from "../../components/shared/Button";

function MediaUpload({ propertyData, updatePropertyData }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const imageRef = useRef();

  const files = propertyData?.images || [];

  const handleAddFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    updatePropertyData({ images: [...files, ...newFiles] });
  };

  const handleReplace = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = files.map((item, i) =>
      i === index ? { file, preview: URL.createObjectURL(file) } : item
    );
    updatePropertyData({ images: updated });
    e.target.value = null;
  };

  const handleDelete = (index) => {
    const updated = files.filter((_, i) => i !== index);
    updatePropertyData({ images: updated });
    setDeleteModal(false);
  };

  const handleManualAdd = (e) => {
    handleAddFiles(e.target.files);
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) handleAddFiles(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold text-primary">Upload Media</h3>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="py-10 hover:border-primary border border-dashed flex flex-col gap-4 items-center justify-center text-secondary rounded cursor-pointer transition"
          onClick={() => imageRef.current.click()}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            ref={imageRef}
            className="hidden"
            onChange={handleManualAdd}
          />
          <FiUpload size={24} />
          <p className="text-secondary text-xl font-medium">
            Drag & Drop or Click to Upload Media
          </p>
          <Button
            onClick={() => imageRef.current.click()}
            text={"Upload"}
            cn={"text-sm !py-2.5 hover:!bg-bgPrimary"}
          />
        </div>

        {files.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              {files.length} image(s) selected
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((fileObj, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="relative h-[150px] group rounded overflow-hidden">
                    <img
                      src={fileObj.preview}
                      alt={`preview-${index}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                      <button
                        onClick={() => {
                          setDeleteIndex(index);
                          setDeleteModal(true);
                        }}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <label className="p-2 bg-primary text-white rounded hover:bg-[#3EAD92] cursor-pointer">
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
            </div>
          </div>
        )}
      </div>

      {deleteModal && (
        <Modal
          onClose={() => setDeleteModal(false)}
          handleAccept={() => handleDelete(deleteIndex)}
          width={"w-full md:w-[702px]"}
          title={"Delete Image?"}
          btnText1={"Cancel"}
          btnText2={"Yes, Delete"}
          classBtn2={"bg-[#FF3B30] hover:bg-red-600"}
        >
          <div className="flex flex-col gap-3">
            <p className="text-base font-medium text-secondary">
              Are you sure you want to delete this image?
            </p>
            <img
              className="w-full h-[410px] object-cover"
              src={files[deleteIndex]?.preview}
              alt="delete-preview"
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export default MediaUpload;
