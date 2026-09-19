/**
 * Admin Notification Hub Modal
 *
 * Modal interface enabling administrators to trigger bulk push and in-app
 * notifications across the 3 global categories:
 * 1. Event Reminders (upcoming Events, Seminars, Conferences, Competitions)
 * 2. Subscription Nudge (unsubscribed/expired active users)
 * 3. Saved Opportunities Reminder (unapplied saved Jobs, Internships, Freelance)
 *
 * Styled strictly to adhere to the Nulinz admin design system (neutral palette,
 * rounded-full buttons, rounded-2xl panels, Lucide outline vector icons).
 */

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
  Calendar,
  Sparkles,
  Briefcase,
  X,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  apiGetNotificationAudienceCounts,
  apiDispatchAdminNotification,
} from "../services/admin/adminNotificationServices";

const AdminNotificationHubModal = ({ isOpen, onClose }) => {
  const [counts, setCounts] = useState({ events: 0, subscriptions: 0, jobs: 0 });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [dispatchingType, setDispatchingType] = useState(null);
  const [pendingConfirmType, setPendingConfirmType] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  /**
   * Fetch real-time audience size estimations when modal opens.
   */
  const fetchCounts = useCallback(async () => {
    try {
      setLoadingCounts(true);
      const res = await apiGetNotificationAudienceCounts();
      if (res.success && res.data) {
        setCounts(res.data);
      }
    } catch (err) {
      console.warn("Could not load audience counts:", err);
    } finally {
      setLoadingCounts(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLastResult(null);
      setPendingConfirmType(null);
      fetchCounts();
    }
  }, [isOpen, fetchCounts]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !dispatchingType) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatchingType, onClose]);

  if (!isOpen) return null;

  /**
   * Dispatches the confirmed notification type and surfaces execution stats.
   */
  const handleConfirmDispatch = async () => {
    if (!pendingConfirmType) return;
    const type = pendingConfirmType;
    setPendingConfirmType(null);
    setDispatchingType(type);

    try {
      const res = await apiDispatchAdminNotification(type);
      if (res.success) {
        const { sentCount, totalEligible } = res.data;
        setLastResult({
          type,
          sentCount,
          totalEligible,
        });

        toast.success(
          `Dispatched successfully to ${sentCount} user${sentCount === 1 ? "" : "s"}`
        );
        fetchCounts();
      } else {
        toast.error(res.message || "Failed to dispatch notifications");
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred during dispatch");
    } finally {
      setDispatchingType(null);
    }
  };

  /**
   * Category metadata and styling configuration matching web theme.
   */
  const categories = [
    {
      type: "events",
      title: "Event Reminders",
      icon: <Calendar size={20} className="text-primary" />,
      description:
        "Remind registered participants for upcoming Events, Seminars, Conferences, and Competitions scheduled in the next 48+ hours.",
      messagePreview:
        '"Your registered event, [Event Name], is scheduled for [date]. Make sure you are ready to attend."',
      audienceCount: counts.events,
    },
    {
      type: "subscriptions",
      title: "Subscription Opportunity",
      icon: <Sparkles size={20} className="text-primary" />,
      description:
        "Dispatch a high-value freelance opportunity notification to all active users without an active subscription plan.",
      messagePreview:
        '"A new Envy project with a Worth of ₹30,000 is currently available and matches the skills or interests you have shown on GradEnvy. View the project to see the requirements and application details."',
      audienceCount: counts.subscriptions,
    },
    {
      type: "jobs",
      title: "Saved Opportunities",
      icon: <Briefcase size={20} className="text-primary" />,
      description:
        "Notify candidates who saved Jobs, Internships, or Freelance projects but have not yet applied. Consolidated into 1 alert per user.",
      messagePreview:
        '"You have [N] saved opportunities waiting on Gradenvy. Don\'t miss out, complete your application today!"',
      audienceCount: counts.jobs,
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#EAECF0] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-[#EAECF0] rounded-t-2xl">
          <div>
            <h2 className="text-[20px] font-bold text-primary leading-tight">
              Notification Dispatch Hub
            </h2>
            <p className="text-[13px] text-[#667085] mt-0.5">
              Send targeted push notifications and reminders to users
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(dispatchingType)}
            className="p-1.5 text-[#667085] hover:text-primary rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Execution Feedback Banner */}
        {lastResult && (
          <div className="px-6 pt-4">
            <div className="p-4 bg-[#ECFDF3] border border-[#A6F4C5] rounded-xl text-[13px] text-[#027A48] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#12B76A] shrink-0" />
                <div>
                  <span className="font-semibold">Dispatch Complete ({lastResult.type}):</span>{" "}
                  Sent to <span className="font-bold">{lastResult.sentCount}</span> users.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLastResult(null)}
                className="text-[#027A48] hover:text-[#05603A] font-semibold text-xs ml-3 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Notification Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const isBusy = dispatchingType === cat.type;
            const isAnyBusy = Boolean(dispatchingType);

            return (
              <div
                key={cat.type}
                className="flex flex-col justify-between p-5 bg-white border border-[#EAECF0] rounded-2xl hover:border-gray-300 transition-all"
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-[12px] bg-[#F2F4F7] inline-flex items-center justify-center shrink-0">
                      {cat.icon}
                    </span>
                    <span className="text-[12px] font-medium px-3 py-1 rounded-full bg-[#F2F4F7] text-[#344054] border border-[#EAECF0]">
                      {loadingCounts ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        `${cat.audienceCount} eligible`
                      )}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-semibold text-primary mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-[13px] text-[#667085] leading-relaxed mb-3">
                    {cat.description}
                  </p>

                  <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#EAECF0] mb-4">
                    <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider block mb-1">
                      Message
                    </span>
                    <p className="text-[12px] text-[#344054] leading-relaxed line-clamp-3">
                      {cat.messagePreview}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <button
                  type="button"
                  onClick={() => setPendingConfirmType(cat.type)}
                  disabled={isAnyBusy || loadingCounts || cat.audienceCount === 0}
                  className="w-full py-2.5 px-4 rounded-full text-[13px] font-medium text-white bg-[#171717] hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  {isBusy ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Dispatching...</span>
                    </>
                  ) : cat.audienceCount === 0 ? (
                    "No Recipients"
                  ) : (
                    `Send to ${cat.audienceCount} Users`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Confirmation Modal Sub-Overlay */}
        {pendingConfirmType && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs rounded-2xl animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-[#EAECF0] animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-[12px] bg-[#FEE4E2] inline-flex items-center justify-center text-[#D92D20] shrink-0">
                  <AlertCircle size={20} />
                </span>
                <div>
                  <h4 className="text-[16px] font-bold text-primary leading-tight">
                    Confirm Notification Dispatch
                  </h4>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Trigger push and in-app alerts
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-[#667085] mb-5 leading-relaxed">
                You are about to send notifications for{" "}
                <span className="font-semibold text-primary capitalize">
                  {pendingConfirmType}
                </span>
                . All eligible users will receive the notification immediately.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingConfirmType(null)}
                  className="px-5 py-2 rounded-full text-[13px] font-medium text-[#344054] bg-white border border-[#D0D5DD] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDispatch}
                  className="px-5 py-2 rounded-full text-[13px] font-medium text-white bg-[#171717] hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#F9FAFB] border-t border-[#EAECF0] rounded-b-2xl">
          <button
            type="button"
            onClick={fetchCounts}
            disabled={loadingCounts || Boolean(dispatchingType)}
            className="text-[13px] font-medium text-primary hover:text-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCw size={14} className={loadingCounts ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminNotificationHubModal;
