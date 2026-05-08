

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
        options: ["Select Option", "Government", "Private", "Autonomous"],
      },
      { name: "establishedYear", label: "Established Year", type: "date", required: false },
      { name: "affiliatedUniversity", label: "Affiliated University", type: "text", required: false },
      { name: "totalDepartments", label: "Total Departments", type: "number", required: false },
      { name: "collegeLogo", label: "College Logo", type: "file" },
    ],
  },
  {
    title: "Contact Information",
    type: "static",
    fields: [
      { name: "contactPersonName", label: "Contact Person Name", type: "text" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "mailId", label: "Mail Id", type: "text" },
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
    initialRows: 3,
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
        required: false,
      },
      { name: "totalStudents", label: "Total Students", type: "number" },
    ],
  },
  {
    title: "About Us",
    type: "static",
    fields: [{ name: "aboutUs", label: "About Us", type: "textarea", span: 2 }],
  },
];


const CollegeForm = () => {
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