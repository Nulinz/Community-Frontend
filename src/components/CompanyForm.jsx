import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCompany } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";
import { useTitle } from "../context/AdminTitle";
import { useEffect } from "react";


const companyFormConfig = [
  {
    title: "Company Details",
    type: "static",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", sanitize: "noSpecialChars" },
      {
        name: "companyType",
        label: "Company Type",
        type: "select",
        options: ["Startup", "MNC", "Agency", "Product Company"],
      },
      {
        name: "industry",
        label: "Industry / Sector",
        type: "select",
        options: [
          "Information Technology",
          "Healthcare",
          "Finance",
          "EdTech",
          "Manufacturing",
          "Construction",
          "Biotechnology",
          "Consulting",
          "Media & Entertainment",
          "E-commerce",
        ],
      },
      { name: "companyTagLine", label: "Company Tagline", type: "text", required: false },
      {
        name: "companyCultureTags",
        label: "Company Culture Tags",
        type: "multiselect",
        options: ["Remote Friendly", "Fast Paced", "Inclusive", "Learning Focused"],
        required: false,
      },
      { name: "yearFounded", label: "Year Founded", type: "year", required: false },
      {
        name: "employees",
        label: "Employee Size",
        type: "select",
        options: ["1-10", "11-50", "51-100", "101-500", "500+"],
        required: false,
      },
    ],
  },
  {
    title: "Online Presence",
    type: "static",
    fields: [
      {
        name: "websiteLink",
        label: "Website",
        type: "text",
        placeholder: "https://www.example.com",
        required: false,
      },
      {
        name: "linkedinUrl",
        label: "LinkedIn Company Page",
        type: "text",
        placeholder: "https://linkedin.com/company/companyname",
        required: false,
      },
      {
        name: "companyLogo",
        label: "Company Logo",
        type: "file",
        dimensions: { width: 512, height: 512 },
        hint: "Required dimensions: 512 × 512 px (Square format).",
      },
      { name: "coverImage", label: "Cover Image", type: "file", required: false },
    ],
  },
  {
    title: "Company Overview",
    type: "static",
    fields: [
      { name: "aboutUs", label: "About the Company", type: "textarea", span: 2 },
    ],
  },
  {
    title: "Core Services / Area",
    itemLabel: "Core Area",
    type: "dynamic",
    key: "what_we_do",
    payloadKey: "whatWeDo",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "whatWeDo", label: "Core Area", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Technologies / Tools",
    itemLabel: "Technology",
    type: "dynamic",
    key: "technologies",
    payloadKey: "technologies",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "technology", label: "Technology", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Contact Information",
    type: "static",
    fields: [
      { name: "contactPersonName", label: "Contact Person Name", type: "text" },
      { name: "mailId", label: "Official Contact Email", type: "text", sanitize: "validMail" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "address", label: "Company Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "pincode", label: "Pincode", type: "text", sanitize: "noExtraNum" },
    ],
  },
  {
    title: "Verification",
    type: "static",
    fields: [
      {
        name: "verificationStatus",
        label: "Verification Status",
        type: "select",
        options: ["Pending", "Verified", "Unverified", "Rejected"],
        required: false,
      },
    ],
  },
  {
    title: "Payment & Payout",
    type: "static",
    fields: [
      {
        name: "accountHolderName",
        label: "Account Holder Name",
        type: "text",
        required: false,
      },
      {
        name: "bankName",
        label: "Bank Name",
        type: "text",
        required: false,
      },
      {
        name: "accountNumber",
        label: "Account Number",
        type: "text",
        sanitize: "noAlphabets",
        required: false,
      },
      {
        name: "ifscCode",
        label: "IFSC",
        type: "text",
        sanitize: "ifsc",
        required: false,
      },
    ],
  },
  {
    title: "Certificate Settings",
    type: "static",
    fields: [
      { name: "certificateAvailability", label: "Certificate Availability", type: "text", required: false, placeholder: "e.g. Provided upon program completion" },
      { name: "signatoryName", label: "Authorized Signatory Name", type: "text", required: false },
      { name: "signatoryDesignation", label: "Authorized Signatory Designation", type: "text", required: false },
      { name: "signatureUrl", label: "Authorized Signature Image", type: "file", span: 1, required: false },
      { name: "certificateContentBody", label: "Custom Certificate Body Text", type: "textarea", span: 2, placeholder: "e.g., has successfully completed the internship program in...", required: false },
    ],
  },
];

const CompanyForm = ({ module }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const {setTitle}=useTitle()
  useEffect(()=>{
setTitle("Company Form")
  },[])
  // ✅ Remap email/phone aliases from editData before passing to FormLayout
  const normalizedEditData = editData
    ? {
        ...editData,
        mailId: editData.mailId || editData.email || "",
        phoneNumber: editData.phoneNumber || editData.phone || "",
      }
    : undefined;

const handleSubmit = async (formData) => {
  try {
    const res = await createCompany(formData);

    // Check API success flag
    if (res?.success) {
      toast.success(res.message || "Company updated successfully");

      if (window.history.length > 2 && document.referrer.includes(window.location.host)) {
        navigate(-1);
      } else {
        navigate(module === "company" ? "/company/dashboard" : "/admin/company");
      }
    } else {
      // API responded but failed
      toast.error(res?.message || "Something went wrong");
    }
  } catch (error) {
    // Network / server error
    console.error("Error:", error);

    toast.error(
      error?.response?.data?.message || "Server error. Please try again"
    );
  }
};

  return (
    <FormLayout
      config={companyFormConfig}
      editData={normalizedEditData}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyForm;