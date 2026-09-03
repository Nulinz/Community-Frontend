

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCollege, createEvent } from "../services/admin/adminServices";
import FormLayout from "../layout/FormLayout";
import { useTitle } from "../context/AdminTitle";
import { useEffect } from "react";

const collegeFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "collegeName", label: "College Name", type: "text" },
      {
        name: "collegeType",
        label: "College Type",
        type: "select",
        options: ["Government", "Private", "Autonomous"],
      },
      { name: "establishedYear", label: "Established Year", type: "year" },
      { name: "affiliatedUniversity", label: "Affiliated University", type: "text", required: false },
      {
        name: "aisheCode",
        label: "Institution / AISHE Code",
        type: "text",
        placeholder: "e.g. C-12345 (Optional)",
        required: false,
      },
      {
        name: "accreditation",
        label: "Accreditation / Recognition",
        type: "multiselect",
        options: [
          "NAAC",
          "NBA",
          "AICTE Approved",
          "UGC Recognized",
          "Autonomous",
          "NIRF",
          "Other",
        ],
        required: false,
      },
      {
        name: "officialWebsite",
        label: "Official Website",
        type: "text",
        placeholder: "https://www.examplecollege.edu.in",
        required: true,
      },
      {
        name: "collegeLogo",
        label: "College Logo",
        type: "file",
        dimensions: { width: 512, height: 512 },
        hint: "Required dimensions: 512 × 512 px (Square format).",
      },
    ],
  },
  {
    title: "Contact Information",
    type: "static",
    fields: [
      { name: "contactPersonName", label: "Contact Person Name", type: "text" },
      { name: "designation", label: "Designation", type: "text", placeholder: "e.g. Placement Officer / Principal / Dean" },
      { name: "mailId", label: "Official Email", type: "text", placeholder: "e.g. contact@examplecollege.edu.in" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
    ],
  },
  {
    title: "Departments",
    type: "dynamic",
    key: "departments",
    payloadKey: "departments",
    dynamicStyle: "grid-6",
    initialRows: 1,
    fields: [{ name: "department", label: "Department", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Academic Details",
    type: "static",
    fields: [
      {
        name: "coursesAvailable",
        label: "Courses Available",
        type: "checkbox",
        options: ["UG", "PG", "Diploma"],
      },
      {
        name: "placementAvailable",
        label: "Placement Available",
        type: "radio",
        options: ["Yes", "No"],
      },
      { name: "totalStudents", label: "Total Students", type: "number" },
    ],
  },
  {
    title: "About College",
    type: "static",
    fields: [
      { name: "aboutUs", label: "About Us", type: "textarea", span: 2 },
    ],
  },
  {
    title: "Certificate Settings",
    type: "static",
    fields: [
      { name: "signatoryName", label: "Authorized Signatory", type: "text", required: false },
      { name: "signatoryDesignation", label: "Designation", type: "text", required: false },
      { name: "signatureUrl", label: "Signature", type: "file", span: 2, required: false },
      { name: "certificateContentBody", label: "Certificate Body", type: "textarea", span: 2, placeholder: "e.g., has successfully completed the program in...", required: false },
    ],
  },
  {
    title: "Payment & Payout",
    type: "static",
    fields: [
      {
        name: "accountHolderName",
        label: "Account Holder",
        type: "text",
      },
      {
        name: "bankName",
        label: "Bank",
        type: "text",
      },
      {
        name: "branchName",
        label: "Branch",
        type: "text",
      },
      {
        name: "accountNumber",
        label: "Account Number",
        type: "text",
      },
      {
        name: "ifscCode",
        label: "IFSC",
        type: "text",
      },
    ],
  },
];


const CollegeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  // ✅ Remap email/phone/designation aliases from editData before passing to FormLayout
  const normalizedEditData = editData
    ? {
        ...editData,
        mailId: editData.mailId || editData.email || "",
        phoneNumber: editData.phoneNumber || editData.phone || "",
        designation: editData.designation || editData.contactPersonDesignation || "",
      }
    : undefined;

  const {setTitle}=useTitle()
  useEffect(()=>{
setTitle("College Form")
  },[])
    
const handleSubmit = async (formData) => {
  try {
    const res = await createCollege(formData);

    // Check API response
    if (res?.success) {
      toast.success(
        editData
          ? "College updated successfully"
          : "College saved successfully"
      );
        navigate(-1);
    } else {
      toast.error(res?.message || "Failed to save college");
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
      config={collegeFormConfig}
      editData={normalizedEditData}
      onSubmit={handleSubmit}
      dateFields={["eventDate", "registrationStartDate", "registrationEndDate"]}
    />
  );
};

export default CollegeForm;