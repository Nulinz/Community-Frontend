import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCompany } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";


const companyFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "companyName", label: "Company Name", type: "text" },
      {
        name: "companyType",
        label: "Company Type",
        type: "select",
        options: ["Startup", "MNC", "Agency", "Product Company"],
      },
      { name: "companyTagLine", label: "Company Tag Line", type: "text" },
      {
        name: "companyCultureTags",
        label: "Company Culture Tags (Multi Select)",
        type: "select",
        options: ["Remote Friendly", "Fast Paced", "Inclusive", "Learning Focused"],
      },
      { name: "yearFounded", label: "Year Founded", type: "date", required: false },
      { name: "websiteLink", label: "Website Link", type: "text", required: false },
      { name: "companyLogo", label: "Company Logo", type: "file" },
      { name: "coverImage", label: "Cover Image", type: "file" },
    ],
  },
  {
    title: "Contact Information",
    type: "static",
    fields: [
      { name: "contactPersonName", label: "Contact Person Name", type: "text" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "mailId", label: "Mail Id", type: "email" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
    ],
  },
  {
    title: "Technologies We Use",
    type: "dynamic",
    key: "technologies",
    payloadKey: "technologies",
    dynamicStyle: "grid-6",
    initialRows: 6,
    fields: [{ name: "technology", label: "Technology", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "What We Do",
    type: "dynamic",
    key: "what_we_do",
    payloadKey: "whatWeDo",
    dynamicStyle: "grid-6",
    initialRows: 6,
    fields: [{ name: "whatWeDo", label: "What We Do", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Learning Benefits",
    type: "dynamic",
    key: "learning_benefits",
    payloadKey: "learningBenefits",
    dynamicStyle: "grid-6",
    initialRows: 6,
    fields: [{ name: "learningBenefit", label: "Learning Benefit", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Learning Outcomes",
    type: "dynamic",
    key: "learning_outcomes",
    payloadKey: "learningOutcomes",
    dynamicStyle: "grid-6",
    initialRows: 6,
    fields: [{ name: "learningOutcome", label: "Learning Outcome", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "About Us & Certificate Availability",
    type: "static",
    fields: [
      { name: "aboutUs", label: "About Us", type: "textarea", span: 2 },
      { name: "certificateAvailability", label: "Certificate Availability", type: "textarea", span: 2 },
    ],
  },
];

const CompanyForm = ({ module }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

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

      navigate(-1);
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