import { useState } from "react";
import { Loader2 } from "lucide-react";

const ConfirmActionButton = ({
  isActive,
  isSubmitting,
  onConfirm,
  activateText = "Activate",
  deactivateText = "Deactivate",
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <>
      {/* Action Button */}
      <button
        disabled={isSubmitting}
        onClick={() => setOpen(true)}
        className={`px-[16px] py-2.5 rounded-full text-white text-[15px] font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
          isActive
            ? "bg-[#F04438] hover:bg-[#D92D20]"
            : "bg-[#12B76A] hover:bg-[#0E9355]"
        }`}
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin inline" />
        ) : isActive ? (
          deactivateText
        ) : (
          activateText
        )}
      </button>

      {/* Confirm Modal */}
      {open && (
        <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Title */}
            <h2 className="text-[20px] font-semibold text-gray-900">
              {isActive ? "Deactivate Item" : "Activate Item"}
            </h2>

            {/* Description */}
            <p className="mt-2 text-[14px] text-gray-500 leading-6">
              Are you sure you want to{" "}
              {isActive ? "deactivate" : "activate"} this item?
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-xl text-white font-medium transition ${
                  isActive
                    ? "bg-[#F04438] hover:bg-[#D92D20]"
                    : "bg-[#12B76A] hover:bg-[#0E9355]"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isActive ? (
                  deactivateText
                ) : (
                  activateText
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmActionButton;