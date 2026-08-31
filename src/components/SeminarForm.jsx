
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createSeminar, getMyCompany } from "../services/admin/adminServices";
import { getMyCollege } from "../services/collegeServices";
import FormLayout from "../layout/FormLayout";
import { useOrganizerDisplayName } from "../utils/organizer";
import { useTitle } from "../context/AdminTitle";
import { useMain } from "../context/MainContext";


const seminarFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "eventType", label: "Event Type", type: "radio", options: ["Technical", "Non Technical"] },
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
      { name: "coverImage", label: "Cover Image", type: "file", span: 2 },
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
    title: "Session / Topic Name",
    type: "dynamic",
    key: "schedule",
    dynamicStyle: "row-action",
    fields: [
      { name: "name", label: "Session / Topic Name", type: "text", colSpan: "md:col-span-4" },
      { name: "startTime", label: "Start Time", type: "time", colSpan: "md:col-span-3" },
      { name: "endTime", label: "End Time", type: "time", colSpan: "md:col-span-4" },
    ],
  },
  // {
  //   title: "Fees Details",
  //   type: "static",
  //    showWhen: { field: "registrationType", value: "Paid" },
  //   fields: [
  //     { name: "individualFees", label: "Individual Fees", type: "number" },
  //     { name: "teamFees", label: "Team Fees", type: "number" },
  //     { name: "lateFees", label: "Late Fees", type: "number" },
  //   ],
  // },
  // {
  //   title: "Prize Details",
  //   type: "static",
  //   fields: [
  //     { name: "firstPrize", label: "1st Prize", type: "text" },
  //     { name: "secondPrize", label: "2nd Prize", type: "text" },
  //     { name: "thirdPrize", label: "3rd Prize", type: "text" },
  //     { name: "participationPrize", label: "Participation Prize", type: "text", required: false },
  //   ],
  // },
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
      { showWhen: { field: "foodProvide", value: "Yes" }, name: "midnightSnacks", label: "Midnight Snacks", type: "radio", options: ["Yes", "No"] },
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
      // { name: "type", label: "Type", type: "select", options: ["Organizer", "Volunteer", "Staff"], colSpan: "md:col-span-3" },
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-3" },
      { name: "phoneNumber", label: "Phone Number", type: "tel", colSpan: "md:col-span-2" },
      { name: "mailId", label: "Mail Id", type: "text", colSpan: "md:col-span-3" },
    ],
  },
  {
    title: "Audience & Eligibility",
    type: "static",
    fields: [
      { name: "eligibilityDetails", label: "Target Audience / Eligibility", type: "text", required: false },
      { name: "allowedDepartments", label: "Allowed Departments", type: "multiselect", options: ["CS", "IT", "ECE", "EEE"], required: false },
      // { name: "teamOrIndividualEvent", label: "Team Or Individual Event", type: "radio", options: ["Team", "Individual", "Both"] },
      // {
      //   name: "teamSizeMinimum",
      //   label: "Team Size Minimum",
      //   type: "number",
      //   showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }  // ← array of values
      // },
      // {
      //   name: "teamSizeMaximum",
      //   label: "Team Size Maximum",
      //   type: "number",
      //   showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }  // ← array of values
      // },
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
      { name: "certificateContentBody", label: "Certificate Body Text", type: "textarea", span: 2, placeholder: "e.g. Has successfully participated in the seminar on...", required: false },
    ],
  },
];

const SeminarForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const { user } = useMain();
  const [profileCertConfig, setProfileCertConfig] = useState(null);

  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle("Seminar Form");
  }, []);

  // Fetch organizer profile certificate configuration
  useEffect(() => {
    const fetchProfileConfig = async () => {
      try {
        let res;
        if (user?.role === "college") {
          res = await getMyCollege();
          const col = res?.data?.college;
          if (col) {
            setProfileCertConfig({
              signatoryName: col.signatoryName || "",
              signatoryDesignation: col.signatoryDesignation || "",
              signatureUrl: col.signatureUrl || "",
              certificateContentBody: col.certificateContentBody || "",
            });
          }
        } else {
          res = await getMyCompany();
          const comp = res?.data?.company;
          if (comp) {
            setProfileCertConfig({
              signatoryName: comp.signatoryName || "",
              signatoryDesignation: comp.signatoryDesignation || "",
              signatureUrl: comp.signatureUrl || "",
              certificateContentBody: comp.certificateContentBody || "",
            });
          }
        }
      } catch (err) {
        console.log("Could not fetch organizer certificate configuration:", err);
      }
    };

    if (user?.role) {
      fetchProfileConfig();
    }
  }, [user?.role]);

  const handleFieldChange = (fieldName, value, currentData) => {
    if (fieldName === "certificateAvailability" && value === "Yes" && profileCertConfig) {
      return {
        signatoryName: currentData.signatoryName || profileCertConfig.signatoryName || "",
        signatoryDesignation: currentData.signatoryDesignation || profileCertConfig.signatoryDesignation || "",
        signatureUrl: currentData.signatureUrl || profileCertConfig.signatureUrl || "",
        certificateContentBody: currentData.certificateContentBody || profileCertConfig.certificateContentBody || "",
      };
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const res = await createSeminar(formData);

      // Validate API response
      if (res?.success) {
        toast.success(
          editData
            ? "Seminar updated successfully"
            : "Seminar saved successfully"
        );

        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save seminar");
      }
    } catch (error) {
      console.error("Error:", error);

      toast.error(
        error?.response?.data?.message || "Server error. Please try again"
      );
    }
  };

  const organizerName = useOrganizerDisplayName();

  return (
    <FormLayout
      config={seminarFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      staticOverrides={{ organizer: organizerName }}
      dateFields={["eventDate", "registrationStartDate", "registrationEndDate"]}
      onFieldChange={handleFieldChange}
    />
  );
};

export default SeminarForm;