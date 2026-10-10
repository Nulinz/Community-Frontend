import React, { useEffect } from "react";
import { Loader2, X, Trash2 } from "lucide-react";

/**
 * Reusable modal dialog for confirming entity deletion across all community modules.
 * Standardizes the destructive confirmation experience, provides visual safeguards
 * against accidental data loss, and manages async execution feedback via loading spinners.
 */
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  itemName = "",
  description = "Are you sure you want to delete this? This action cannot be undone and will permanently remove this record.",
  isSubmitting = false,
}) => {
  // Lock body scroll and handle Escape key dismissal when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed font-source inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Dismiss Icon */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50 p-1 rounded-full hover:bg-gray-100"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Header Row: Trash Icon Badge + Title & Item Name */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-full bg-white border border-black/30 text-[#000000] flex items-center justify-center shrink-0 mt-0.5">
            <Trash2 size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <h2
              id="delete-dialog-title"
              className="text-[19px] md:text-[20px] text-left font-bold text-gray-900 leading-snug"
            >
              {title}
            </h2>

            {itemName && (
              <p
                className="mt-1 text-left font-semibold text-[#101828] text-[14px] md:text-[15px] truncate"
                title={itemName}
              >
                {itemName}
              </p>
            )}
          </div>
        </div>

        {/* Informative Warning Description */}
        <p className="mt-3 text-[14px] text-left text-gray-500 leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2.5 flex-1 rounded-xl border border-gray-300 text-gray-700 font-semibold text-[14px] hover:bg-gray-50 active:scale-98 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-4 py-2.5 flex-1 rounded-xl text-white font-semibold text-[14px] bg-[#000000] hover:bg-[#000000] active:scale-98 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
