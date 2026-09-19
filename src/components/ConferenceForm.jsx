import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createConference } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";
import { useOrganizerDisplayName } from "../utils/organizer";
import { useTitle } from "../context/AdminTitle";
import {
  validateEventFieldChange,
  validateEventSubmission,
} from "../utils/dateTimeValidation";
import { usePayoutValidation } from "../utils/usePayoutValidation";
import PayoutNoticeModal from "./PayoutNoticeModal";

const conferenceFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "eventName", label: "Event Name", type: "text" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["Online", "Offline", "Hybrid"] },
      {
        name: "onlinePlatformLink",
        label: "Online Platform / Meeting Link",
        type: "text",
        placeholder: "e.g. Google Meet, Zoom link, or Platform URL",
        showWhen: { field: "mode", value: ["Online", "Hybrid"] },
      },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "eventStartTime", label: "Event Start Time", type: "time" },
      { name: "eventEndTime", label: "Event End Time", type: "time" },
      { name: "registrationType", label: "Registration Type", type: "radio", options: ["Free", "Paid"] },
      { name: "registrationStartDate", label: "Registration Start Date", type: "date" },
      { name: "registrationEndDate", label: "Registration End Date", type: "date" },
      { name: "totalSeats", label: "Total Seats", type: "number", required: false },
      {
        name: "externalRegistrationLink",
        label: "External Registration Form (If any)",
        type: "text",
        placeholder: "e.g. https://forms.gle/... or external registration URL",
        required: false,
        hint: "If you have an external registration form (e.g. Google Form or external portal), you can provide the link here for participants to register.",
      },
      {
        name: "coverImage",
        label: "Cover Image",
        type: "file",
        dimensions: { width: 350, height: 290 },
        hint: "Required dimensions: 350 × 290 px (W × H).",
      },
    ],
  },
  // {
  //   title: "Round Details",
  //   type: "dynamic",
  //   key: "rounds",
  //   dynamicStyle: "row-action",
  //   fields: [
  //     { name: "roundNumber", label: "Round Number", type: "text", colSpan: "md:col-span-3" },
  //     { name: "roundName", label: "Round Name", type: "text", colSpan: "md:col-span-4" },
  //     { name: "roundDescription", label: "Round Description", type: "text", colSpan: "md:col-span-4" },
  //   ],
  // },
  {
    title: "Event Schedule",
    type: "dynamic",
    key: "schedule",
    dynamicStyle: "row-action",
    initialRows: 1,
    onlyFirstRowRequired: true,
    itemLabel: "Schedule Item",
    fields: [
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-4" },
      { name: "startTime", label: "Start Time", type: "time", colSpan: "md:col-span-3" },
      { name: "endTime", label: "End Time", type: "time", colSpan: "md:col-span-4" },
    ],
  },
  // {
  //   title: "Fees Details",
  //   type: "static",
  //   showWhen: { field: "registrationType", value: "Paid" },
  //   fields: [
  //     { name: "individualFees", label: "Individual Fees", type: "number" },
  //     { name: "teamFees", label: "Team Fees", type: "number" },
  //     { name: "lateFees", label: "Late Fees", type: "number" },
  //   ],
  // },
  {
    title: "Prize Details",
    type: "static",
    fields: [
      { name: "prizesAvailable", label: "Prizes Available", type: "radio", options: ["Yes", "No"], defaultValue: "No", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "firstPrize", label: "1st Prize", type: "text", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "secondPrize", label: "2nd Prize", type: "text", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "thirdPrize", label: "3rd Prize", type: "text", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "participationPrize", label: "Participation Prize", type: "text", required: false },
    ],
  },
  // {
  //   title: "Opportunity",
  //   type: "static",
  //   fields: [
  //     { name: "internshipOpportunity", label: "Internship Opportunity", type: "radio", options: ["Yes", "No"] },
  //     { name: "placementOpportunity", label: "Placement Opportunity", type: "radio", options: ["Yes", "No"] },
  //     { name: "industryExposure", label: "Industry Exposure", type: "radio", options: ["Yes", "No"] },
  //     { name: "industryPartners", label: "Industry Partners", type: "radio", options: ["Yes", "No"] },
  //   ],
  // },
  {
    title: "Venue Details",
    type: "static",
    showWhen: { field: "mode", value: ["Offline", "Hybrid"] },
    fields: [
      { name: "venueName", label: "Venue Name", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
      { name: "geoLocation", label: "Geo location", type: "text", required: false },
    ],
  },
  {
    title: "Food Details",
    type: "static",
    showWhen: { field: "mode", value: ["Offline", "Hybrid"] },
    fields: [
      { name: "foodProvide", label: "Food Provide", type: "radio", options: ["Yes", "No"] },
      { showWhen: { field: "foodProvide", value: "Yes" }, name: "vegNonVeg", label: "Veg / Non-Veg", type: "radio", options: ["Veg", "Non-veg", "Both"] },
      { showWhen: { field: "foodProvide", value: "Yes" }, name: "midnightSnacks", label: "Snacks", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Accommodation",
    type: "static",
    showWhen: { field: "mode", value: ["Offline", "Hybrid"] },
    fields: [
      { name: "accommodationProvide", label: "Accommodation Provide", type: "radio", options: ["Yes", "No"] },
      { showWhen: { field: "accommodationProvide", value: "Yes" }, name: "separatedForBoysGirls", label: "Separated for boys & girls", type: "radio", options: ["Yes", "No"] },
      { showWhen: { field: "accommodationProvide", value: "Yes" }, name: "onlyForOutstationParticipants", label: "Only For Outstation Participants", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Event Incharge Details",
    type: "dynamic",
    key: "incharges",
    dynamicStyle: "row-action",
    fields: [
      { name: "type", label: "Type", type: "select", options: ["Organizer", "Volunteer", "Staff"], colSpan: "md:col-span-3" },
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-3" },
      { name: "phoneNumber", label: "Phone Number", type: "tel", colSpan: "md:col-span-2" },
      { name: "mailId", label: "Mail Id", type: "text", colSpan: "md:col-span-3" },
    ],
  },
  {
    title: "Target Audience / Eligibility ",
    type: "static",
    fields: [
      { name: "allowedDepartments", label: "Allowed Departments", type: "multiselect", options: ["All", "CS", "IT", "ECE", "EEE"], required: false },
    ],
  },
  {
    title: "Fees Details",
    type: "static",
    showWhen: { field: "registrationType", value: "Paid" },
    fields: [
      { name: "individualFees", label: "Individual Fees", type: "number" },
      { showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }, name: "teamFees", label: "Team Fees", type: "number" },
      { name: "lateFees", label: "Late Fees", type: "number" },
    ],
  },
  {
    title: "Event Description & Certificate",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
      {
        name: "certificateAvailability",
        label: "Certificate Available?",
        type: "radio",
        options: ["Yes", "No"],
        defaultValue: "No",
      },
    ],
  },
  {
    title: "Certificate Configuration",
    type: "static",
    showWhen: { field: "certificateAvailability", value: "Yes" },
    fields: [
      { name: "signatoryName", label: "Authorized Signatory Name", type: "text", required: false, placeholder: "e.g. Dr. John Doe" },
      { name: "signatoryDesignation", label: "Authorized Signatory Designation", type: "text", required: false, placeholder: "e.g. Head of Department" },
      { name: "signatureUrl", label: "Authorized Signature Image", type: "file", span: 1, required: false },
      { name: "certificateContentBody", label: "Certificate Body Text", type: "textarea", span: 2, placeholder: "e.g. Has successfully participated and presented at the conference in...", required: false },
    ],
  },
];

const ConferenceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();

  const {
    organizerProfile,
    profileCertConfig,
    showPayoutModal,
    setShowPayoutModal,
    validateRegistrationType,
    validatePayoutOnSubmit,
    userRole,
  } = usePayoutValidation();

  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Conference Form");
  }, []);

  const handleFieldChange = (fieldName, value, currentData) => {
    // ── Restrict Paid Registration if Payout Details Missing ────
    if (fieldName === "registrationType") {
      const payoutOverride = validateRegistrationType(value);
      if (payoutOverride) {
        return payoutOverride;
      }
    }

    // ── Certificate auto-fill when enabled ──────────────────────
    if (fieldName === "certificateAvailability" && value === "Yes" && profileCertConfig) {
      return {
        signatoryName: currentData.signatoryName || profileCertConfig.signatoryName || "",
        signatoryDesignation: currentData.signatoryDesignation || profileCertConfig.signatoryDesignation || "",
        signatureUrl: currentData.signatureUrl || profileCertConfig.signatureUrl || "",
        certificateContentBody: currentData.certificateContentBody || profileCertConfig.certificateContentBody || "",
      };
    }

    // ── Real-time Date and Time Validation ──────────────────────
    const dateValidationOverride = validateEventFieldChange(
      fieldName,
      value,
      currentData,
      !!editData?._id,
      false
    );
    if (dateValidationOverride) {
      return dateValidationOverride;
    }
  };

  const handleSubmit = async (formData, payload) => {
    try {
      // Payout validation check prior to submission
      if (!validatePayoutOnSubmit(payload)) {
        return;
      }

      // Secondary defensive validation before sending API request
      if (!validateEventSubmission(payload, !!editData?._id, false)) {
        return;
      }

      const res = await createConference(formData);

      // Validate response
      if (res?.success) {
        toast.success(
          editData
            ? "Conference updated successfully"
            : "Conference saved successfully"
        );
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save conference");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message || "Server error. Please try again"
      );
    }
  };

  return (
    <>
      <FormLayout
        config={conferenceFormConfig}
        editData={editData}
        onSubmit={handleSubmit}
        staticOverrides={{ organizer: organizerName }}
        dateFields={["eventDate", "registrationStartDate", "registrationEndDate"]}
        onFieldChange={handleFieldChange}
      />
      <PayoutNoticeModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        organizerProfile={organizerProfile}
        userRole={userRole}
      />
    </>
  );
};

export default ConferenceForm;