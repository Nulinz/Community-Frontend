
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createInternship, updateInternship  } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";
import FormLayout from "../layout/FormLayout";
import { useState } from "react";
import { useEffect } from "react";
import { useTitle } from "../context/AdminTitle";


const internshipFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "internshipType", label: "Internship Type", type: "radio", options: ["Paid", "Unpaid"] },
      { name: "jobTitle", label: "Internship Title", type: "text" },
      { name: "domain", label: "Domain", type: "text", placeholder: "e.g. Software Development, Marketing, Finance" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["On-site", "Hybrid", "Remote"] },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "e.g. Bangalore, Chennai",
        showWhen: { field: "mode", value: ["On-site", "Hybrid"] },
      },
      { name: "totalOpenings", label: "Total Openings", type: "number" },
      {
        name: "duration",
        label: "Duration",
        type: "select",
        options: ["No Fixed Duration", "1 Month", "3 Months", "6 Months"],
      },
      { name: "internStartDate", label: "Internship Start Date", type: "date", required: false },
      { name: "applicationDeadline", label: "Application Deadline", type: "date" },
      {
        name: "salary",
        label: "Stipend",
        type: "number",
        placeholder: "e.g. 15000",
        showWhen: { field: "internshipType", value: "Paid" },
      },
    ],
  },
  {
    title: "Responsibilities",
    type: "dynamic",
    key: "responsibilities",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "responsibilities", label: "Responsibility", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Eligibility Criteria",
    type: "dynamic",
    key: "eligibility",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "eligibility", label: "Eligibility Criteria", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Required skill set",
    type: "dynamic",
    key: "skill_set",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "skill_set", label: "Required skill set", type: "text", colSpan: "md:col-span-11" }],
  },{
    title: "Learning Benefits",
    type: "dynamic",
    key: "benefits",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "benefits", label: "Learning Benefits", type: "text", colSpan: "md:col-span-11", required: false }],
  },
  {
    title: "Learning outcomes",
    type: "dynamic",
    key: "learning_outcomes",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "learning_outcomes", label: "Learning outcomes", type: "text", colSpan: "md:col-span-11", required: false }],
  },
  {
    title: "Skill Development Benefits",
    type: "dynamic",
    key: "development_benefits",
    dynamicStyle: "grid-6",
    initialRows: 3,
    showWhen: { field: "internshipType", value: "Unpaid" },
    fields: [{ name: "development_benefits", label: "Skill Development Benefits", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Supported Development resources",
    type: "dynamic",
    key: "development_resources",
    dynamicStyle: "grid-6",
    initialRows: 3,
    showWhen: { field: "internshipType", value: "Unpaid" },
    fields: [{ name: "development_resources", label: "Supported Development resources", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Internship Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
      {
        name: "certificateAvailability",
        label: "Certificate Provided",
        type: "radio",
        options: ["Yes", "No"],
        defaultValue: "No",
      },
    ],
  },
];
const InternshipForm = () => {
  const location = useLocation();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();
const [loading, setLoading] = useState(false);
const navigate=useNavigate()
  const {setTitle}=useTitle()
  useEffect(()=>{
setTitle("Internship Form")
  },[])


const handleSubmit = async (_, payload) => {
  try {
    setLoading(true);
    const cleanPayload = { ...payload };
    if (cleanPayload.internshipType === "Unpaid") {
      cleanPayload.salary = 0;
    }
    if (cleanPayload.mode === "Remote" && !cleanPayload.location) {
      cleanPayload.location = "Remote";
    }
    const res = editData?._id
      ? await updateInternship(editData._id, cleanPayload)
      : await createInternship(cleanPayload);
    if (res?.success) {
      toast.success(`Internship ${editData?._id ? 'updated' : 'created'} successfully`);
      navigate(-1);
    } else {
      toast.error(res?.message || "Failed to save internship");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Server error. Please try again");
  } finally {
    setLoading(false);
  }
};


  return (
    <FormLayout
      config={internshipFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      staticOverrides={{ companyName: organizerName, organizer: organizerName }}
      dateFields={["internStartDate", "applicationDeadline"]}
    />
  );
};

export default InternshipForm;