import { useState, useEffect, useCallback } from "react";
import { useMain } from "../context/MainContext";
import { getMyCollege } from "../services/collegeServices";
import { getMyCompany } from "../services/admin/adminServices";

/**
 * usePayoutValidation
 * 
 * Custom hook that consolidates organizer profile retrieval, certificate configuration
 * caching, and bank payout credential validation across all event forms
 * (EventForm, SeminarForm, ConferenceForm, CompetitionForm).
 * 
 * Intercepts real-time selection of "Paid" registration when bank details are missing,
 * reverting the selection to "Free" and prompting the organizer with an explanatory modal.
 */
export const usePayoutValidation = () => {
  const { user } = useMain();
  const [organizerProfile, setOrganizerProfile] = useState(null);
  const [profileCertConfig, setProfileCertConfig] = useState(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [isCheckingPayout, setIsCheckingPayout] = useState(true);

  // Fetch organizer profile configuration
  useEffect(() => {
    let isMounted = true;

    const fetchOrganizerProfile = async () => {
      if (!user?.role || user.role === "admin") {
        if (isMounted) setIsCheckingPayout(false);
        return;
      }

      try {
        let res = null;
        if (user.role === "college") {
          res = await getMyCollege();
        } else if (user.role === "company") {
          res = await getMyCompany();
        }

        const profile = res?.data?.college || res?.data?.company || null;
        if (isMounted && profile) {
          setOrganizerProfile(profile);
          setProfileCertConfig({
            signatoryName: profile.signatoryName || "",
            signatoryDesignation: profile.signatoryDesignation || "",
            signatureUrl: profile.signatureUrl || "",
            certificateContentBody: profile.certificateContentBody || "",
          });
        }
      } catch (err) {
        console.error("Could not fetch organizer profile for payout verification:", err);
      } finally {
        if (isMounted) setIsCheckingPayout(false);
      }
    };

    fetchOrganizerProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  /**
   * Evaluates whether the organizer has completed payout banking details.
   */
  const hasPayoutDetails = useCallback(() => {
    // Admins bypass organizer payout prerequisites
    if (!user?.role || user.role === "admin") return true;

    return Boolean(
      organizerProfile?.accountHolderName?.trim() &&
      organizerProfile?.accountNumber?.trim() &&
      organizerProfile?.ifscCode?.trim()
    );
  }, [user?.role, organizerProfile]);

  /**
   * Validates registration type selection in real-time.
   * If Paid is selected without payout details, reverts to Free and triggers modal.
   */
  const validateRegistrationType = useCallback(
    (value) => {
      if (value === "Paid" && !hasPayoutDetails()) {
        setShowPayoutModal(true);
        return { registrationType: "Free" };
      }
      return null;
    },
    [hasPayoutDetails]
  );

  /**
   * Secondary check on form submission to prevent bypass.
   */
  const validatePayoutOnSubmit = useCallback(
    (payload) => {
      if (payload?.registrationType === "Paid" && !hasPayoutDetails()) {
        setShowPayoutModal(true);
        return false;
      }
      return true;
    },
    [hasPayoutDetails]
  );

  return {
    organizerProfile,
    profileCertConfig,
    showPayoutModal,
    setShowPayoutModal,
    hasPayoutDetails,
    validateRegistrationType,
    validatePayoutOnSubmit,
    isCheckingPayout,
    userRole: user?.role,
  };
};
