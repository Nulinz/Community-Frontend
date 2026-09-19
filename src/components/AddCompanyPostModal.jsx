import React, { useRef, useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { addCompanyPost, getMyCompany } from '../services/admin/adminServices';

/**
 * AddCompanyPostModal Component
 *
 * Reusable modal for uploading poster images for the company.
 * Can be triggered from the company sidebar navigation or profile views.
 * Dispatches a 'companyPostAdded' event on successful upload so active profile
 * tabs automatically refresh their displayed post listings.
 */
const AddCompanyPostModal = ({ isOpen, onClose, companyId, onSuccess }) => {
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!validFiles.length) {
      toast.error('Please upload image files only');
      return;
    }

    const newPosts = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      src: URL.createObjectURL(file),
      file,
    }));

    setUploadedPosts((prev) => [...prev, ...newPosts]);
    setPostFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleUploadChange = (event) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const removePostImage = (id) => {
    setUploadedPosts((prev) => {
      const targetIndex = prev.findIndex((item) => item.id === id);
      if (targetIndex !== -1) {
        setPostFiles((files) => files.filter((_, idx) => idx !== targetIndex));
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClose = () => {
    setUploadedPosts([]);
    setPostFiles([]);
    onClose();
  };

  const handleConfirmPosts = async () => {
    if (postFiles.length === 0) {
      toast.error('Please select images first');
      return;
    }

    try {
      setIsSubmitting(true);

      let targetCompanyId = companyId;
      if (!targetCompanyId) {
        const myCompRes = await getMyCompany();
        targetCompanyId = myCompRes?.data?.company?._id || myCompRes?.data?.company?.id;
      }

      if (!targetCompanyId) {
        toast.error('Company details not found');
        return;
      }

      const formData = new FormData();
      postFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await addCompanyPost(targetCompanyId, formData);
      if (response.success) {
        toast.success(response.message || 'Posts uploaded successfully');
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
        window.dispatchEvent(new CustomEvent('companyPostAdded'));
      } else {
        toast.error(response.message || 'Failed to upload posts');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload posts');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-[560px] bg-white rounded-[20px] border border-[#EAECF0] shadow-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[20px] font-bold text-primary">Add Post</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#98A2B3] hover:text-[#667085] p-1 rounded-lg transition"
          >
            <X size={22} />
          </button>
        </div>
        <p className="text-[14px] text-secondary mb-4">Upload poster or image for your company.</p>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-[#D0D5DD] rounded-[14px] h-[150px] flex flex-col items-center justify-center gap-2 text-center bg-[#F9FAFB] hover:bg-gray-50 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center pointer-events-none">
            <Upload size={20} className="text-[#667085]" />
          </div>
          <p className="text-[14px] text-[#667085] pointer-events-none">
            <span className="text-[#171717] font-semibold">Click to upload</span> or drag and drop
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadChange}
            className="hidden"
          />
        </div>

        {uploadedPosts.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 max-h-[160px] overflow-y-auto p-1">
            {uploadedPosts.map((item) => (
              <div
                key={item.id}
                className="relative rounded-[12px] overflow-hidden border border-[#EAECF0] bg-[#F9FAFB] aspect-square"
              >
                <img src={item.src} alt="Post preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePostImage(item.id);
                  }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-[#D92D20] border border-[#F4C7C3] flex items-center justify-center shadow-xs hover:bg-red-50 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="h-11 rounded-[10px] border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || postFiles.length === 0}
            onClick={handleConfirmPosts}
            className="h-11 rounded-[10px] bg-[#171717] text-white text-[15px] font-bold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#262626] transition active:scale-95"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyPostModal;
