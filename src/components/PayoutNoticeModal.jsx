import React from "react";
import { AlertCircle, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * PayoutNoticeModal
 * 
 * Prompted whenever an organizer tries to set the registration type of an
 * event, seminar, conference, or competition to "Paid" without having
 * registered their bank/payout details.
 * 
 * Allows the user to either revert to "Free" or seamlessly navigate to
 * their profile edit form to complete their payout credentials.
 */
const PayoutNoticeModal = ({
  isOpen,
  onClose,
  organizerProfile,
  userRole,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigateToPayout = () => {
    onClose();

    // Determine appropriate profile edit destination based on user role
    const normalizedRole = String(userRole || "").toLowerCase();
    if (normalizedRole === "college") {
      navigate("/college/college-form", { state: { editData: organizerProfile } });
    } else if (normalizedRole === "company") {
      navigate("/company/company-form", { state: { editData: organizerProfile } });
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
              <AlertCircle size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 id="payout-modal-title" className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Payout Details Required
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Bank account needed for paid events
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3.5 bg-gray-50/50">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-100/90 shadow-xs space-y-3">
            <p className="text-gray-800 text-sm leading-relaxed">
              To collect registration fees from participants, your organization must have valid bank and payout details on file so payouts can be disbursed.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pt-3 border-t border-gray-100">
              You can publish this event as <span className="font-semibold text-gray-800">Free</span>, or fill in your bank details to enable paid registrations.
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-full px-4 py-3.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-center"
          >
            Keep as Free Event
          </button>
          <button
            type="button"
            onClick={handleNavigateToPayout}
            className="w-full sm:w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#171717] hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <span>Add Payout Details</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutNoticeModal;
