
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createInternship, updateInternship, getCompanyNames } from "../services/admin/adminServices";
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
 * Generates the Internship form field configuration based on user privileges.
 * When an admin creates or edits an internship:
 *   - Provides a searchable dropdown of registered companies + an "Other" option.
 *   - Automatically inherits the chosen company's name and existing logo.
 *   - If "Other" is chosen, reveals dedicated company name and 512x512 logo upload
 *     fields backed by the interactive ImageCropperModal.
 * When a company user creates an internship:
 *   - Maintains standard single-company behavior with prefilled organizer info.
 */
const getInternshipFormConfig = ({ isAdmin, companyOptions }) => [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "internshipType", label: "Internship Type", type: "radio", options: ["Stipend", "Unpaid", "Paid"] },
      { name: "jobTitle", label: "Internship Title", type: "text" },
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
        label: "Stipend per month",
        type: "number",
        placeholder: "e.g. 15000",
        showWhen: { field: "internshipType", value: "Stipend" },
      },
      {
        name: "paymentAmount",
        label: "Payment amount",
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
  },
  {
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

  const { user } = useMain();
  const isAdmin = user?.role === "admin";
  const organizerName = useOrganizerDisplayName();

  const [loading, setLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [companyOptions, setCompanyOptions] = useState(["Other"]);
  const navigate = useNavigate();
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Internship Form");
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
    return getInternshipFormConfig({ isAdmin, companyOptions });
  }, [isAdmin, companyOptions]);

  const handleFieldChange = (fieldName, value, currentData) => {
    return validateOpportunityFieldChange(fieldName, value, currentData, !!editData?._id, {
      startDateField: "internStartDate",
      startLabel: "Internship start date",
      deadlineLabel: "Application deadline",
    });
  };

  const handleSubmit = async (_, payload) => {
    try {
      // Secondary defensive validation before submitting
      if (!validateOpportunitySubmission(payload, !!editData?._id, {
        startDateField: "internStartDate",
        startLabel: "Internship start date",
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

      if (cleanPayload.internshipType === "Unpaid") {
        cleanPayload.salary = 0;
        cleanPayload.paymentAmount = 0;
      } else if (cleanPayload.internshipType === "Paid") {
        cleanPayload.salary = 0;
      } else if (cleanPayload.internshipType === "Stipend") {
        cleanPayload.paymentAmount = 0;
      }
      if (cleanPayload.mode === "Remote" && !cleanPayload.location) {
        cleanPayload.location = "Remote";
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
        ? await updateInternship(editData._id, dataToSend)
        : await createInternship(dataToSend);

      if (res?.success) {
        toast.success(`Internship ${editData?._id ? "updated" : "created"} successfully`);
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
      config={formConfig}
      editData={resolvedEditData}
      onSubmit={handleSubmit}
      staticOverrides={isAdmin ? undefined : { companyName: organizerName, organizer: organizerName }}
      dateFields={["internStartDate", "applicationDeadline"]}
      onFieldChange={handleFieldChange}
    />
  );
};

export default InternshipForm;