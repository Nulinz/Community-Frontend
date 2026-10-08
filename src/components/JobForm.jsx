import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createJob, updateJob, getCompanyNames } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";
import FormLayout from "../layout/FormLayout";
import { useState, useEffect, useMemo } from "react";
import { useTitle } from "../context/AdminTitle";
import { useMain } from "../context/MainContext";
import { domainOptions } from "./CompanyForm";
import {
  validateOpportunityFieldChange,
  validateOpportunitySubmission,
} from "../utils/dateTimeValidation";

/**
 * Generates the Job form field configuration based on user privileges.
 * When an admin creates or edits a job:
 *   - Provides a searchable dropdown of registered companies + an "Other" option.
 *   - Automatically inherits the chosen company's name and existing logo.
 *   - If "Other" is chosen, reveals dedicated company name and 512x512 logo upload
 *     fields backed by the interactive ImageCropperModal.
 * When a company user creates a job:
 *   - Maintains standard single-company behavior with prefilled organizer info.
 */
const getJobFormConfig = ({ isAdmin, companyOptions }) => [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "jobType", label: "Job Type", type: "radio", options: ["Full Time", "Part Time", "Contract"] },
      { name: "jobTitle", label: "Job Title", type: "text" },
      {
        name: "domains",
        label: "Domains",
        type: "multiselect",
        searchable: true,
        options: domainOptions,
        placeholder: "Select domains",
      },
      ...(isAdmin
        ? [
            {
              name: "selectedCompany",
              label: "Company",
              type: "select",
              searchable: true,
              options: companyOptions,
              defaultValue: "",
              placeholder: "Select Company or Other",
              required: true,
            },
            {
              name: "companyName",
              label: "Company Name",
              type: "text",
              placeholder: "Enter company name",
              required: true,
              showWhen: { field: "selectedCompany", value: "Other" },
            },
            {
              name: "companyLogo",
              label: "Company Logo",
              type: "file",
              dimensions: { width: 512, height: 512 },
              crop: true,
              required: true,
              showWhen: { field: "selectedCompany", value: "Other" },
            },
          ]
        : [
            { name: "organizer", label: "Organizer", type: "text" },
          ]),
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
        required: false,
      },
      {
        name: "salary",
        label: "Fixed Salary (₹) LPA",
        type: "number",
        placeholder: "e.g. 600000",
        required: false,
        showWhen: { field: "salaryType", value: "Fixed amount" },
      },
      {
        name: "salaryMin",
        label: "Minimum Salary (₹) LPA",
        type: "number",
        placeholder: "e.g. 4",
        required: false,
        showWhen: { field: "salaryType", value: "Range" },
      },
      {
        name: "salaryMax",
        label: "Maximum Salary (₹) LPA",
        type: "number",
        placeholder: "e.g. 8",
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
  {
    title: "Job Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
    ],
  },
];

const JobForm = () => {
  const location = useLocation();
  const rawEditData = location.state?.editData;
  const editData = useMemo(() => {
    if (!rawEditData) return undefined;
    return {
      ...rawEditData,
      ...(rawEditData.salaryType === "Range" && String(rawEditData.salary).includes("-")
        ? {
            salaryMin: rawEditData.salaryMin ?? rawEditData.salary.split("-")[0],
            salaryMax: rawEditData.salaryMax ?? rawEditData.salary.split("-")[1],
          }
        : {}),
    };
  }, [rawEditData]);

  const { user } = useMain();
  const isAdmin = user?.role === "admin";
  const organizerName = useOrganizerDisplayName();

  const [loading, setLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [companyOptions, setCompanyOptions] = useState(["Other"]);
  const navigate = useNavigate();
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Job Form");
  }, [setTitle]);

  // Fetch registered companies when creator is an admin
  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;
    const fetchCompanies = async () => {
      try {
        const res = await getCompanyNames();
        if (isMounted && res?.success) {
          const names = Array.isArray(res.data) ? res.data : [];
          setCompanyOptions([...names, "Other"]);
          if (Array.isArray(res.companies)) {
            setCompanyList(res.companies);
          }
        }
      } catch (err) {
        console.error("Failed to load company names:", err);
      }
    };
    fetchCompanies();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  // Resolve initial data for edit mode, matching registered company or defaulting to Other
  const resolvedEditData = useMemo(() => {
    if (!editData) return undefined;
    if (!isAdmin) return editData;

    const currentCompany = editData.companyName || editData.organizer || "";
    const isKnown = companyOptions.length > 1 && companyOptions.includes(currentCompany) && currentCompany !== "Other";
    const selectedCompany = isKnown ? currentCompany : (currentCompany ? "Other" : "");

    return {
      ...editData,
      selectedCompany: selectedCompany || "Other",
      companyName: currentCompany,
      companyLogo: editData.companyLogo || "",
    };
  }, [editData, isAdmin, companyOptions]);

  const formConfig = useMemo(() => {
    return getJobFormConfig({ isAdmin, companyOptions });
  }, [isAdmin, companyOptions]);

  const handleFieldChange = (fieldName, value, currentData) => {
    return validateOpportunityFieldChange(fieldName, value, currentData, !!editData?._id, {
      startDateField: "jobStartDate",
      startLabel: "Job start date",
      deadlineLabel: "Application deadline",
    });
  };

  const handleSubmit = async (_, payload) => {
    try {
      // Secondary defensive validation before submitting
      if (!validateOpportunitySubmission(payload, !!editData?._id, {
        startDateField: "jobStartDate",
        startLabel: "Job start date",
        deadlineLabel: "Application deadline",
      })) {
        return;
      }

      setLoading(true);
      const cleanPayload = { ...payload };

      if (isAdmin) {
        if (cleanPayload.selectedCompany && cleanPayload.selectedCompany !== "Other") {
          cleanPayload.companyName = cleanPayload.selectedCompany;
          cleanPayload.organizer = cleanPayload.selectedCompany;

          // Propagate registered company's logo if found
          const matched = companyList.find(
            (c) => c.companyName?.toLowerCase() === cleanPayload.selectedCompany.toLowerCase()
          );
          if (matched?.companyLogo) {
            cleanPayload.companyLogo = matched.companyLogo;
          }
        } else if (cleanPayload.selectedCompany === "Other") {
          cleanPayload.organizer = cleanPayload.companyName;
        }
        delete cleanPayload.selectedCompany;
      } else {
        cleanPayload.companyName = organizerName;
        cleanPayload.organizer = organizerName;
      }

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

      // Build multipart FormData whenever a custom logo File is provided
      const hasFileUpload = cleanPayload.companyLogo instanceof File;
      let dataToSend;
      if (hasFileUpload) {
        dataToSend = new FormData();
        Object.entries(cleanPayload).forEach(([key, val]) => {
          if (val == null) return;
          if (val instanceof File) {
            dataToSend.append(key, val);
            return;
          }
          if (Array.isArray(val)) {
            dataToSend.append(key, JSON.stringify(val));
            return;
          }
          dataToSend.append(key, String(val));
        });
      } else {
        dataToSend = cleanPayload;
      }

      const res = editData?._id
        ? await updateJob(editData._id, dataToSend)
        : await createJob(dataToSend);

      if (res?.status || res?.success) {
        toast.success(`Job ${editData?._id ? "updated" : "created"} successfully`);
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
      config={formConfig}
      editData={resolvedEditData}
      onSubmit={handleSubmit}
      staticOverrides={isAdmin ? undefined : { companyName: organizerName, organizer: organizerName }}
      dateFields={["jobStartDate", "applicationDeadline"]}
      onFieldChange={handleFieldChange}
    />
  );
};

export default JobForm;
