import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createJob, updateJob } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";
import FormLayout from "../layout/FormLayout";
import { useState, useEffect } from "react";
import { useTitle } from "../context/AdminTitle";

const jobFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "jobType", label: "Job Type", type: "radio", options: ["Full Time", "Part Time", "Contract"] },
      { name: "jobTitle", label: "Job Title", type: "text" },
      { name: "jobCategory", label: "Job Category / Department", type: "text", placeholder: "e.g. Software Engineering, Marketing, Finance", },
      { name: "organizer", label: "Organizer", type: "text", },
      { name: "mode", label: "Mode", type: "select", options: ["On-site", "Hybrid", "Remote"] },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "e.g. Bangalore, Chennai",
        showWhen: { field: "mode", value: ["On-site", "Hybrid"] },
      },
      {
        name: "duration",
        label: "Duration",
        type: "select",
        options: ["No Fixed Duration", "1 Year", "2 Years", "Permanent"],
        showWhen: { field: "jobType", value: "Contract" },
      },
      { name: "totalOpenings", label: "Total Openings", type: "number" },
      { name: "jobStartDate", label: "Job Start Date", type: "date", required: false },
      { name: "applicationDeadline", label: "Application Deadline", type: "date" },
      {
        name: "salaryType",
        label: "Salary",
        type: "select",
        options: ["Fixed amount", "Range", "Negotiable", "Not disclosed"],
        defaultValue: "Fixed amount",
        required: false
      },
      {
        name: "salary",
        label: "Fixed Salary (₹)",
        type: "number",
        placeholder: "e.g. 600000",
        required: false,
        showWhen: { field: "salaryType", value: "Fixed amount" },
      },
      {
        name: "salaryMin",
        label: "Minimum Salary (₹)",
        type: "number",
        placeholder: "e.g. 400000",
        required: false,
        showWhen: { field: "salaryType", value: "Range" },
      },
      {
        name: "salaryMax",
        label: "Maximum Salary (₹)",
        type: "number",
        placeholder: "e.g. 800000",
        required: false,
        showWhen: { field: "salaryType", value: "Range" },
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
  },
  // {
  //   title: "Learning Benefits",
  //   type: "dynamic",
  //   key: "benefits",
  //   dynamicStyle: "grid-6",
  //   initialRows: 3,
  //   fields: [{ name: "benefits", label: "Learning Benefits", type: "text", colSpan: "md:col-span-11" }],
  // },
  // {
  //   title: "Learning outcomes",
  //   type: "dynamic",
  //   key: "learning_outcomes",
  //   dynamicStyle: "grid-6",
  //   initialRows: 3,
  //   fields: [{ name: "learning_outcomes", label: "Learning outcomes", type: "text", colSpan: "md:col-span-11" }],
  // },
  // {
  //   title: "Skill Development Benefits",
  //   type: "dynamic",
  //   key: "development_benefits",
  //   dynamicStyle: "grid-6",
  //   initialRows: 3,
  //   fields: [{ name: "development_benefits", label: "Skill Development Benefits", type: "text", colSpan: "md:col-span-11" }],
  // },
  // {
  //   title: "Supported Development resources",
  //   type: "dynamic",
  //   key: "development_resources",
  //   dynamicStyle: "grid-6",
  //   initialRows: 3,
  //   fields: [{ name: "development_resources", label: "Supported Development resources", type: "text", colSpan: "md:col-span-11" }],
  // },
  {
    title: "Job Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
      // { name: "certificateAvailability", label: "Certificate Availability", type: "textarea", span: 2 },
    ],
  },
];

const JobForm = () => {
  const location = useLocation();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Job Form");
  }, [setTitle]);

  const handleSubmit = async (_, payload) => {
    try {
      setLoading(true);
      const cleanPayload = { ...payload };
      if ((cleanPayload.mode === "Remote" || cleanPayload.mode === "Online") && !cleanPayload.location) {
        cleanPayload.location = "Remote";
      }
      if (cleanPayload.jobType !== "Contract") {
        cleanPayload.duration = "";
      }
      if (cleanPayload.salaryType === "Fixed amount") {
        cleanPayload.salaryMin = 0;
        cleanPayload.salaryMax = 0;
      } else if (cleanPayload.salaryType === "Range") {
        cleanPayload.salary = Number(cleanPayload.salaryMin) || 0;
      } else {
        cleanPayload.salary = 0;
        cleanPayload.salaryMin = 0;
        cleanPayload.salaryMax = 0;
      }
      const res = editData?._id
        ? await updateJob(editData._id, cleanPayload)
        : await createJob(cleanPayload);
      if (res?.status || res?.success) {
        toast.success(`Job ${editData?._id ? 'updated' : 'created'} successfully`);
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save job");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      config={jobFormConfig}
      editData={editData}
      onSubmit={handleSubmit}
      staticOverrides={{ companyName: organizerName, organizer: organizerName }}
      dateFields={["jobStartDate", "applicationDeadline"]}
    />
  );
};

export default JobForm;
