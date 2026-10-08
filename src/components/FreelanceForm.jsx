import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createFreelance, updateFreelance, getCompanyNames } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";
import FormLayout from "../layout/FormLayout";
import { useEffect, useState, useMemo } from "react";
import { useTitle } from "../context/AdminTitle";
import { useMain } from "../context/MainContext";
import { domainOptions } from "./CompanyForm";
import {
  validateFreelanceFieldChange,
  validateFreelanceSubmission,
} from "../utils/dateTimeValidation";

/**
 * Minimum budget thresholds enforced per Project Type.
 * Ensures consistent project budgeting across creation and edits.
 */
export const PROJECT_TYPE_MIN_BUDGET = {
  "Small Project": 1000,
  "Standard Project": 2500,
  "Medium Project": 5000,
  "Advanced Project": 10000,
};

/**
 * Validates budget in real-time according to the selected projectType.
 * Evaluates immediately on every keystroke while typing in the budget input,
 * as well as when the user changes the projectType dropdown.
 * Returns a human-friendly error string if invalid, or null if valid.
 */
export const validateFreelanceBudget = (value, projectType) => {
  const selectedType = projectType || "Small Project";
  const minAllowed = PROJECT_TYPE_MIN_BUDGET[selectedType] || 1000;

  // Don't flag empty state before user starts entering data
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numericBudget = parseFloat(String(value).replace(/[^0-9.]/g, ""));

  if (isNaN(numericBudget) || numericBudget <= 0) {
    return "Please enter a valid positive budget amount";
  }

  if (numericBudget < minAllowed) {
    return `Minimum budget for ${selectedType} must be at least ₹${minAllowed.toLocaleString("en-IN")}`;
  }

  return null;
};

/**
 * Generates the Freelance (Envy) form field configuration based on user privileges.
 * When role is admin:
 *   - Searchable company dropdown + "Other" option.
 *   - Automatically inherits registered company's name and existing logo.
 *   - If "Other" chosen, shows company name and 512x512 logo upload.
 * When role is not admin:
 *   - Standard behavior with prefilled organizer info.
 */
const getFreelanceFormConfig = ({ isAdmin, companyOptions }) => [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "jobTitle", label: "Project Title", type: "text" },
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
            {
              name: "companyName",
              label: "Organizer",
              type: "text",
            },
          ]),
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
        min: 0,
        placeholder: (data) => {
          const selectedType = data?.projectType || "Small Project";
          const minAllowed = PROJECT_TYPE_MIN_BUDGET[selectedType] || 1000;
          return `Min ₹${minAllowed.toLocaleString("en-IN")} for ${selectedType}`;
        },
        hint: (data) => {
          const selectedType = data?.projectType || "Small Project";
          const minAllowed = PROJECT_TYPE_MIN_BUDGET[selectedType] || 1000;
          return `Minimum allowed budget for ${selectedType} is ₹${minAllowed.toLocaleString("en-IN")}`;
        },
        validate: (value, data) => {
          return validateFreelanceBudget(value, data?.projectType);
        },
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
    fields: [{ name: "securityInfo", label: "Security", type: "text", colSpan: "md:col-span-11", required: false }],
  },
  {
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
      { name: "description", label: "Description", type: "textarea", span: 2 },
    ],
  },
];

const FreelanceForm = () => {
  const location = useLocation();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { user } = useMain();
  const isAdmin = user?.role === "admin";

  const [companyList, setCompanyList] = useState([]);
  const [companyOptions, setCompanyOptions] = useState(["Other"]);

  useEffect(() => {
    setTitle("Form");
  }, [setTitle]);

  // Fetch registered companies when creator has admin privileges
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
    return getFreelanceFormConfig({ isAdmin, companyOptions });
  }, [isAdmin, companyOptions]);

  const handleFieldChange = (fieldName, value, currentData) => {
    return validateFreelanceFieldChange(fieldName, value, currentData, !!editData?._id);
  };

  const handleSubmit = async (_, payload, staticData) => {
    try {
      // Secondary defensive validation before making the API request
      if (!validateFreelanceSubmission(payload, !!editData?._id)) {
        return;
      }

      const selectedType = payload?.projectType || staticData?.projectType || "Small Project";
      const rawBudget = payload?.budget || staticData?.budget || "";
      const minAllowed = PROJECT_TYPE_MIN_BUDGET[selectedType] || 1000;
      const numericBudget = parseFloat(String(rawBudget).replace(/[^0-9.]/g, ""));

      if (!rawBudget || isNaN(numericBudget) || numericBudget < minAllowed) {
        toast.error(
          `Minimum budget for ${selectedType} must be at least ₹${minAllowed.toLocaleString("en-IN")}`
        );
        return;
      }

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

      // Check if file upload is provided (ImageCropperModal outputs File)
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
        ? await updateFreelance(editData._id, dataToSend)
        : await createFreelance(dataToSend);

      if (res?.success || res?.status) {
        toast.success(
          editData
            ? "Freelance updated successfully"
            : "Freelance saved successfully"
        );
        navigate(-1);
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
      config={formConfig}
      editData={resolvedEditData}
      onSubmit={handleSubmit}
      staticOverrides={!isAdmin ? { companyName: organizerName } : undefined}
      dateFields={["jobStartDate", "jobEndDate", "applicationDeadline"]}
      onFieldChange={handleFieldChange}
    />
  );
};

export default FreelanceForm;