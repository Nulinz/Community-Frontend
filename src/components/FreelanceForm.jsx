import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createFreelance } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";
import FormLayout from "../layout/FormLayout";
import { useEffect } from "react";
import { useTitle } from "../context/AdminTitle";

/**
 * Freelance / Project form configuration.
 * Defines the static metadata and dynamic specification sections for creating
 * or editing freelance project listings.
 */
const PROJECT_TYPE_MIN_BUDGET = {
  "Small Project": 1000,
  "Standard Project": 2500,
  "Medium Project": 5000,
  "Advanced Project": 10000,
};

const freelanceFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "jobTitle", label: "Project Title", type: "text" },
      { name: "domain", label: "Domain", type: "text", placeholder: "e.g. Web Development, UI/UX Design, Content Writing" },
      {
        name: "companyName",
        label: "Organizer",
        type: "text",
      },
      {
        name: "projectType",
        label: "Project Type",
        type: "select",
        options: [
          "Small Project",
          "Standard Project",
          "Medium Project",
          "Advanced Project",
        ],
      },
      {
        name: "duration",
        label: "Duration",
        type: "select",
        options: [
          "No Fixed Duration",
          "1 Day",
          "3 Days",
          "5 Days",
          "1 Week",
          "2 Weeks",
          "3 Weeks",
          "4 Weeks",
        ],
      },
      { name: "applicationDeadline", label: "Application Deadline", type: "date" },
      { name: "jobStartDate", label: "Expected Timeline", type: "date" },
      { name: "jobEndDate", label: "Deadline", type: "date", required: false },
    ],
  },
  {
    title: "Payment / Milestones",
    type: "static",
    fields: [
      {
        name: "budget",
        label: "Budget (INR)",
        type: "number",
        placeholder: "Enter budget in INR",
      },
    ],
  },
  {
    title: "Project Requirements",
    type: "dynamic",
    key: "project_needs",
    payloadKey: "projectNeeds",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "projectNeed", label: "Project Requirements", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Who Can Apply / Eligibility",
    type: "dynamic",
    key: "eligibility",
    payloadKey: "eligibility",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "eligibilityCriteria", label: "Eligibility ", type: "text", colSpan: "md:col-span-11" }],
  },

  {
    title: "Security",
    type: "dynamic",
    key: "security",
    payloadKey: "security",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "securityInfo", label: "Security", type: "text", colSpan: "md:col-span-11", required:false }],
  }, {
    title: "Required Skills", 
    type: "dynamic",
    key: "skill_set",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "skill_set", label: "Required Skills", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Reference Links",
    type: "dynamic",
    key: "reference_website",
    payloadKey: "referenceWebsite",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "reference", label: "Reference Links", type: "text", colSpan: "md:col-span-11", required: false }],
  },
  {
    title: "Project Attachments",
    type: "dynamic",
    key: "supporting_files",
    payloadKey: "supporting_files",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "supporting_files", label: "Project Attachments", type: "text", colSpan: "md:col-span-11", required: false }],
  },
  // {
  //   title: "Payment / Milestones",
  //   type: "dynamic",
  //   key: "payment_structure",
  //   payloadKey: "payment_structure",
  //   dynamicStyle: "grid-6",
  //   initialRows: 1,
  //   fields: [{ name: "payment_structure", label: "Payment / Milestones", type: "text", colSpan: "md:col-span-11", required: false }],
  // },
  {
    title: "Project Rules / Terms",
    type: "dynamic",
    key: "rules",
    payloadKey: "rules",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "rules", label: "Project Rules / Terms", type: "text", colSpan: "md:col-span-11", required: false }],
  },
  
  {
    title: " Project Details",
    type: "static",
    dynamicStyle: "grid-6",
    fields: [
      // { name: "learning", label: "Learning", type: "textarea",span:2 },
      // { name: "certificateAvailability", label: "Certificate Availability", type: "textarea" ,span:2},
      { name: "description", label: "Description", type: "textarea",span:2 },
    ],
  },
];

const FreelanceForm = () => {
  const location = useLocation();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();
  const navigate =useNavigate()
  const {setTitle}=useTitle()
  useEffect(()=>{
    setTitle("Projects Form")
  },[])

const handleSubmit = async (_, payload, staticData) => {
  try {
    const selectedType = payload?.projectType || staticData?.projectType;
    const rawBudget = payload?.budget || staticData?.budget || "";
    const numericBudget = parseFloat(String(rawBudget).replace(/[^0-9.]/g, ""));

    const minAllowed = PROJECT_TYPE_MIN_BUDGET[selectedType];
    if (minAllowed && (!numericBudget || numericBudget < minAllowed)) {
      toast.error(
        `Minimum budget for ${selectedType} must be at least ₹${minAllowed.toLocaleString("en-IN")}`
      );
      return;
    }

    const res = await createFreelance(payload); // JSON payload
    
    if (res?.success) {
      toast.success("Freelance saved successfully");
      navigate(-1)
    } else {
      toast.error(res?.message || "Failed to save freelance");
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
      config={freelanceFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      staticOverrides={{ companyName: organizerName }}
      dateFields={["jobStartDate", "jobEndDate", "applicationDeadline"]}
    />
  );
};

export default FreelanceForm;