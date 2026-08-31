
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCompetition, getMyCompany } from "../services/admin/adminServices";
import { getMyCollege } from "../services/collegeServices";
import FormLayout from "../layout/FormLayout";
import { useOrganizerDisplayName } from "../utils/organizer";
import { useTitle } from "../context/AdminTitle";
import { useMain } from "../context/MainContext";

const competitionFormConfig = [
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
      { name: "eventEndDate", label: "Event End Date", type: "date", required: false },
      { name: "eventEndTime", label: "Event End Time", type: "time", required: false },
      { name: "registrationType", label: "Registration Type", type: "radio", options: ["Free", "Paid"] },
      { name: "registrationStartDate", label: "Registration Start Date", type: "date" },
      { name: "registrationEndDate", label: "Registration End Date", type: "date" },
      { name: "totalSeats", label: "Total Seats", type: "number", required: false },
      { name: "coverImage", label: "Cover Image", type: "file" },
    ],
  },
  {
    title: "Round Details",
    type: "dynamic",
    key: "rounds",
    payloadKey: "rounds",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "round", label: "Round", type: "text", placeholder: "e.g. Idea Submission" }],
  },
  {
    title: "Event Schedule",
    type: "dynamic",
    key: "schedule",
    dynamicStyle: "row-action",
    initialRows: 1,
    onlyFirstRowRequired: true,
    itemLabel: "Schedule Item",
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "e.g. Keynote / Pitching Session" },
      { name: "startTime", label: "Start Time", type: "time" },
      { name: "endTime", label: "End Time", type: "time" },
    ],
  },

  {
    title: "Opportunity",
    type: "static",
    fields: [
      {
        name: "internshipOpportunity",
        label: "Internship Opportunity",
        type: "radio",
        options: ["Yes", "No"],
        conditionalInput: {
          showWhen: "Yes",
          name: "internshipOpportunityDetails",
          label: "Internship Details",
          placeholder: "e.g. 3-Month Paid Internship for Winners",
          type: "text",
        },
      },
      {
        name: "placementOpportunity",
        label: "Placement Opportunity",
        type: "radio",
        options: ["Yes", "No"],
        conditionalInput: {
          showWhen: "Yes",
          name: "placementOpportunityDetails",
          label: "Placement Details",
          placeholder: "e.g. Direct Interview Opportunity with Partner Companies",
          type: "text",
        },
      },
      {
        name: "industryExposure",
        label: "Industry Exposure",
        type: "radio",
        options: ["Yes", "No"],
        conditionalInput: {
          showWhen: "Yes",
          name: "industryExposureDetails",
          label: "Industry Exposure Details",
          placeholder: "e.g. Mentorship from Senior Tech Leads",
          type: "text",
        },
      },
      {
        name: "industryPartners",
        label: "Industry Partners",
        type: "radio",
        options: ["Yes", "No"],
        conditionalInput: {
          showWhen: "Yes",
          name: "industryPartnersDetails",
          label: "Industry Partner Details",
          placeholder: "e.g. Google, Microsoft, AWS",
          type: "text",
        },
      },
    ],
  },
  {
    title: "Prizes & Recognition",
    type: "static",
    fields: [
      { name: "prizesAvailable", label: "Prizes Available", type: "radio", options: ["Yes", "No"], defaultValue: "No", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "firstPrize", label: "1st Prize", type: "text", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "secondPrize", label: "2nd Prize", type: "text", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "thirdPrize", label: "3rd Prize", type: "text", required: false },
      { showWhen: { field: "prizesAvailable", value: "Yes" }, name: "participationPrize", label: "Participation Prize", type: "text", required: false },
    ],
  },
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
    initialRows: 1,
    fields: [
      { name: "type", label: "Type", type: "select", options: ["Organizer", "Volunteer", "Staff"] },
      { name: "name", label: "Name", type: "text" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "mailId", label: "Mail Id", type: "text" },
    ],
  },
  {
    title: "Eligibility & Team Details",
    type: "static",
    fields: [
      { name: "eligibilityDetails", label: "Eligibility Details", type: "text" },
      { name: "allowedDepartments", label: "Allowed Departments", type: "multiselect", options: ["All", "CS", "IT", "ECE", "EEE"], required: false },
      { name: "teamOrIndividualEvent", label: "Team Or Individual Event", type: "radio", options: ["Team", "Individual", "Both"] },
      {
        name: "teamSizeMinimum",
        label: "Team Size Minimum",
        type: "number",
        showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }  // ← array of values
      },
      {
        name: "teamSizeMaximum",
        label: "Team Size Maximum",
        type: "number",
        showWhen: { field: "teamOrIndividualEvent", value: ["Team", "Both"] }  // ← array of values
      },
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
    title: "Rules",
    type: "static",
    fields: [
      { name: "ruleBook", label: "Rule Book", type: "file", required: false },
      { name: "additionalRules", label: "Additional Rules", type: "text", required: false },
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
      { name: "certificateContentBody", label: "Certificate Body Text", type: "textarea", span: 2, placeholder: "e.g. Has successfully participated and achieved distinction in...", required: false },
    ],
  },
];
const CompetitionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();
  const { user } = useMain();
  const [profileCertConfig, setProfileCertConfig] = useState(null);

  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle("Competition Form");
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
      const res = await createCompetition(formData);
      console.log(res);

      // Check API response
      if (res?.success) {
        toast.success("Competition saved successfully");
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save competition");
      }
    } catch (error) {
      console.error("Error:", error);

      toast.error(
        error?.response?.data?.message || "Server error. Please try again"
      );
    }
  };

  return (
    <FormLayout
      config={competitionFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      staticOverrides={{ organizer: organizerName }}
      dateFields={["eventDate", "eventEndDate", "registrationStartDate", "registrationEndDate"]}
      onFieldChange={handleFieldChange}
    />
  );
};

export default CompetitionForm;