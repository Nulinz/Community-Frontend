
import { createSeminar } from "../services/admin/adminServices";



import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import FormLayout from "../layout/FormLayout";


const seminarFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "eventType", label: "Event Type", type: "radio", options: ["Technical", "Non Technical"] },
      { name: "eventName", label: "Event Name", type: "text" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["Online", "Offline"] },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "registrationType", label: "Registration Type", type: "radio", options: ["Free", "Paid"] },
      { name: "registrationStartDate", label: "Registration Start Date", type: "date" },
      { name: "registrationEndDate", label: "Registration End Date", type: "date" },
      { name: "totalSeats", label: "Total Seats", type: "number" },
      { name: "coverImage", label: "Cover Image", type: "file", span: 2 },
    ],
  },

  {
    title: "Round Details",
    type: "dynamic",
    key: "rounds",
    fields: [
      { name: "roundNumber", label: "Round Number", type: "text", colSpan: "md:col-span-3" },
      { name: "roundName", label: "Round Name", type: "text", colSpan: "md:col-span-4" },
      { name: "roundDescription", label: "Round Description", type: "text", colSpan: "md:col-span-4" },
    ],
  },
  {
    title: "Event Schedule",
    type: "dynamic",
    key: "schedule",
    fields: [
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-4" },
      { name: "startTime", label: "Start Time", type: "time", colSpan: "md:col-span-3" },
      { name: "endTime", label: "End Time", type: "time", colSpan: "md:col-span-4" },
    ],
  },
  {
    title: "Fees Details",
    type: "static",
    fields: [
      { name: "individualFees", label: "Individual Fees", type: "number" },
      { name: "teamFees", label: "Team Fees", type: "number" },
      { name: "lateFees", label: "Late Fees", type: "number" },
    ],
  },
  {
    title: "Prize Details",
    type: "static",
    fields: [
      { name: "firstPrize", label: "1st Prize", type: "text" },
      { name: "secondPrize", label: "2nd Prize", type: "text" },
      { name: "thirdPrize", label: "3rd Prize", type: "text" },
      { name: "participationPrize", label: "Participation Prize", type: "text", required: false },
    ],
  },
  {
    title: "Opportunity",
    type: "static",
    fields: [
      { name: "internshipOpportunity", label: "Internship Opportunity", type: "radio", options: ["Yes", "No"] },
      { name: "placementOpportunity", label: "Placement Opportunity", type: "radio", options: ["Yes", "No"] },
      { name: "industryExposure", label: "Industry Exposure", type: "radio", options: ["Yes", "No"] },
      { name: "industryPartners", label: "Industry Partners", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Venue Details",
    type: "static",
    fields: [
      { name: "venueName", label: "Venue Name", type: "text" },
      { name: "venueAddress", label: "Venue Address", type: "text" },
      { name: "geoLocation", label: "Geo location", type: "text", required: false },
    ],
  },
  {
    title: "Food Details",
    type: "static",
    fields: [
      { name: "foodProvide", label: "Food Provide", type: "radio", options: ["Yes", "No"] },
      { name: "vegNonVeg", label: "Veg / Non-Veg", type: "radio", options: ["Veg", "Non-veg", "Both"] },
      { name: "midnightSnacks", label: "Midnight Snacks", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Accommodation",
    type: "static",
    fields: [
      { name: "accommodationProvide", label: "Accommodation Provide", type: "radio", options: ["Yes", "No"] },
      { name: "separatedForBoysGirls", label: "Separated for boys & girls", type: "radio", options: ["Yes", "No"] },
      { name: "onlyForOutstationParticipants", label: "Only For Outstation Participants", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Event Incharge Details",
    type: "dynamic",
    key: "incharges",
    fields: [
      { name: "type", label: "Type", type: "select", options: ["Organizer", "Volunteer", "Staff"], colSpan: "md:col-span-3" },
      { name: "name", label: "Name", type: "text", colSpan: "md:col-span-3" },
      { name: "phoneNumber", label: "Phone Number", type: "tel", colSpan: "md:col-span-2" },
      { name: "mailId", label: "Mail Id", type: "text", colSpan: "md:col-span-3" },
    ],
  },
  {
    title: "Eligibility & Team Details",
    type: "static",
    fields: [
      { name: "eligibilityDetails", label: "Eligibility Details", type: "text" },
      { name: "allowedDepartments", label: "Allowed Departments",  type: "multiselect", options: [ "CS", "IT", "ECE", "EEE"] },
      { name: "teamOrIndividualEvent", label: "Team Or Individual Event", type: "radio", options: ["Team", "Individual", "Both"] },
      { name: "teamSizeMinimum", label: "Team Size Minimum", type: "number" },
      { name: "teamSizeMaximum", label: "Team Size Maximum", type: "number" },
    ],
  },
    {
    title: "Event Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
         { name: "certificateAvailability", label: "Certificate Availability", type: "textarea", span: 2  },
    ],
  },
];

const SeminarForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

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

  return (
    <FormLayout
      config={seminarFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      dateFields={["eventDate", "registrationStartDate", "registrationEndDate"]}
    />
  );
};

export default SeminarForm;