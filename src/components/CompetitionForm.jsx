import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createCompetition } from "../services/admin/adminServices";

const competitionFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "eventName", label: "Event Name", type: "text" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["Online", "Offline"] },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "registrationType", label: "Registration Type", type: "radio", options: ["Free", "Paid"] },
      { name: "registrationStartDate", label: "Registration Start Date", type: "date" },
      { name: "registrationEndDate", label: "Registration End Date", type: "date" },
      { name: "totalSeats", label: "Total Seats", type: "number" },
      { name: "coverImage", label: "Cover Image", type: "file" },
    ],
  },
  {
    title: "Round Details",
    type: "dynamic",
    key: "rounds",
    dynamicStyle: "row-action",
    initialRows: 2,
    fields: [
      { name: "roundNumber", label: "Round Number", type: "text" },
      { name: "roundName", label: "Round Name", type: "text" },
      { name: "roundDescription", label: "Round Description", type: "text" },
    ],
  },
  {
    title: "Event Schedule",
    type: "dynamic",
    key: "schedule",
    dynamicStyle: "row-action",
    initialRows: 2,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "startTime", label: "Start Time", type: "time" },
      { name: "endTime", label: "End Time", type: "time" },
    ],
  },
  {
    title: "Fees Details",
    type: "static",
    fields: [
      { name: "individualFees", label: "Individual Fees", type: "number" },
      { name: "teamFees", label: "Team Fees", type: "number" },
      { name: "lateFees", label: "Late Fees", type: "number" },
    ],
  },
  {
    title: "Opportunity",
    type: "static",
    fields: [
      { name: "internshipOpportunity", label: "Internship Opportunity", type: "radio", options: ["Yes", "No"] },
      { name: "placementOpportunity", label: "Placement Opportunity", type: "radio", options: ["Yes", "No"] },
      { name: "industryExposure", label: "Industry Exposure", type: "radio", options: ["Yes", "No"] },
      { name: "industryPartners", label: "Industry Partners", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Prize Details",
    type: "static",
    fields: [
      { name: "firstPrize", label: "1st Prize", type: "text" },
      { name: "secondPrize", label: "2nd Prize", type: "text" },
      { name: "thirdPrize", label: "3rd Prize", type: "text" },
      { name: "participationPrize", label: "Participation Prize", type: "text", required: false },
    ],
  },
  {
    title: "Venue Details",
    type: "static",
    fields: [
      { name: "venueName", label: "Venue Name", type: "text" },
      { name: "venueAddress", label: "Venue Address", type: "text" },
      { name: "geoLocation", label: "Geo location", type: "text", required: false },
    ],
  },
  {
    title: "Food Details",
    type: "static",
    fields: [
      { name: "foodProvide", label: "Food Provide", type: "radio", options: ["Yes", "No"] },
      { name: "vegNonVeg", label: "Veg / Non-Veg", type: "radio", options: ["Veg", "Non-veg", "Both"] },
      { name: "midnightSnacks", label: "Midnight Snacks", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Accommodation",
    type: "static",
    fields: [
      { name: "accommodationProvide", label: "Accommodation Provide", type: "radio", options: ["Yes", "No"] },
      { name: "separatedForBoysGirls", label: "Separated for boys & girls", type: "radio", options: ["Yes", "No"] },
      { name: "onlyForOutstationParticipants", label: "Only For Outstation Participants", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Event Incharge Details",
    type: "dynamic",
    key: "incharges",
    dynamicStyle: "row-action",
    initialRows: 2,
    fields: [
      { name: "type", label: "Type", type: "select", options: ["Organizer", "Volunteer", "Staff"] },
      { name: "name", label: "Name", type: "text" },
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "mailId", label: "Mail Id", type: "text" },
    ],
  },
  {
    title: "Eligibility & Team Details",
    type: "static",
    fields: [
      { name: "eligibilityDetails", label: "Eligibility Details", type: "text" },
      { name: "allowedDepartments", label: "Allowed Departments", type: "select", options: ["Select option", "CS", "IT", "ECE", "EEE"] },
      { name: "teamOrIndividualEvent", label: "Team Or Individual Event", type: "radio", options: ["Team", "Individual", "Both"] },
      { name: "teamSizeMinimum", label: "Team Size Minimum", type: "number" },
      { name: "teamSizeMaximum", label: "Team Size Maximum", type: "number" },
    ],
  },
  {
    title: "Rules",
    type: "static",
    fields: [
      { name: "ruleBook", label: "Rule Book", type: "file" },
      { name: "additionalRules", label: "Additional Rules", type: "text" },
    ],
  },
  {
    title: "Event Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
    ],
  },
];

const toCleanString = (value) => String(value || "").trim();

const getInitialFieldValue = (field) => {
  if (field.type === "checkbox") return [];
  if (field.type === "toggle") {
    return Array.isArray(field.options) && field.options.length === 2
      ? field.options[1]
      : "No";
  }
  return "";
};

const createInitialStaticData = () => {
  const data = {};
  competitionFormConfig
    .filter((section) => section.type === "static")
    .forEach((section) => {
      section.fields.forEach((field) => {
        data[field.name] = getInitialFieldValue(field);
      });
    });
  return data;
};

const createEmptyDynamicRow = (section) => {
  const values = {};
  section.fields.forEach((field) => {
    values[field.name] = getInitialFieldValue(field);
  });
  return { id: `${Date.now()}-${Math.random()}`, values };
};

const createInitialDynamicData = () => {
  const data = {};
  competitionFormConfig
    .filter((section) => section.type === "dynamic")
    .forEach((section) => {
      const rowCount = section.initialRows || 1;
      data[section.key] = Array.from({ length: rowCount }, () => createEmptyDynamicRow(section));
    });
  return data;
};

const extractDynamicList = (rows = [], fieldName) =>
  rows
    .map((row) => toCleanString(row?.values?.[fieldName]))
    .filter(Boolean);

const hasMeaningfulValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return toCleanString(value).length > 0;
};

const Label = ({ text, required = true }) => (
  <label className="block font-source font-semibold text-sm md:text-base leading-none tracking-normal text-primary mb-2">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FormInput = ({ field, value, onChange, inputName }) => {
  if (field.type === "checkbox") {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
        {field.options.map((opt) => (
          <label
            key={opt}
            className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name={`${inputName}-${opt}`}
                checked={selectedValues.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, opt]);
                  } else {
                    onChange(selectedValues.filter((item) => item !== opt));
                  }
                }}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 transition-all"
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "toggle") {
    const options =
      Array.isArray(field.options) && field.options.length === 2
        ? field.options
        : ["Yes", "No"];
    const isFirstOptionActive = value === options[0];
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isFirstOptionActive}
        onClick={() => onChange(isFirstOptionActive ? options[1] : options[0])}
        className={`relative inline-flex h-10 min-w-[110px] items-center rounded-full px-1 transition-colors ${
          isFirstOptionActive ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${
            isFirstOptionActive ? "translate-x-0" : "translate-x-[70px]"
          }`}
        />
        <span className="relative z-10 flex w-full justify-between px-3 text-xs font-semibold text-white">
          <span>{options[0]}</span>
          <span>{options[1]}</span>
        </span>
      </button>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
        {field.options.map((opt) => (
          <label
            key={opt}
            className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={inputName}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 transition-all"
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 border border-gray-200 rounded bg-[#fcfcfc] text-sm h-10 outline-none"
      >
        <option value="">Select Option</option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    const isExisting = typeof value === "string" && value !== "";
    const isNew = value instanceof File;
    const isImage = field.name === "coverImage";

    return (
      <div className="space-y-2">
        {isImage && (isExisting || isNew) && (
          <div className="relative w-full aspect-[4/1] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden mb-2 shadow-sm group">
            <img
              src={isNew ? URL.createObjectURL(value) : `${BASE_URL}/${value}`}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="flex border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
          <label className="bg-[#0095ff] text-xs md:text-sm text-white px-3 md:px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:bg-blue-600 transition">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              accept={isImage ? "image/*" : undefined}
            />
          </label>
          <span className="flex-1 min-w-0 bg-[#fcfcfc] px-3 md:px-4 py-2.5 text-gray-400 text-xs truncate">
            {isNew ? value.name : isExisting ? value.split("/").pop() : "No File Chosen"}
          </span>
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm resize-none"
      />
    );
  }

  return (
    <input
      type={field.type}
      value={value}
      onChange={(e) => {
        let nextValue = e.target.value;
        if (field.type === "tel") {
          nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
        }
        onChange(nextValue);
      }}
      inputMode={field.type === "tel" ? "numeric" : undefined}
      maxLength={field.type === "tel" ? 10 : undefined}
      className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
    />
  );
};

const CompetitionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  const [staticData, setStaticData] = useState(() => createInitialStaticData());
  const [dynamicData, setDynamicData] = useState(() => createInitialDynamicData());
  const [competitionId, setCompetitionId] = useState(null);

  useEffect(() => {
    if (editData) {
      setCompetitionId(editData._id || editData.id);

      // Map static fields
      const newStaticData = createInitialStaticData();
      Object.keys(newStaticData).forEach((key) => {
        let val = editData[key];
        if (val !== undefined && val !== null) {
          if (["eventDate", "registrationStartDate", "registrationEndDate"].includes(key) && val) {
            try {
              newStaticData[key] = new Date(val).toISOString().split("T")[0];
            } catch (e) {
              newStaticData[key] = "";
            }
          } else {
            newStaticData[key] = val;
          }
        }
      });
      setStaticData(newStaticData);

      // Map dynamic fields
      const newDynamicData = createInitialDynamicData();
      competitionFormConfig
        .filter((section) => section.type === "dynamic")
        .forEach((section) => {
          const list = editData[section.key] || [];
          if (list.length > 0) {
            newDynamicData[section.key] = list.map((item) => ({
              id: item._id || `${Date.now()}-${Math.random()}`,
              values: { ...item },
            }));
          }
        });
      setDynamicData(newDynamicData);
    }
  }, [editData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionMap = competitionFormConfig.reduce((acc, section) => {
    if (section.type === "dynamic" && section.key) acc[section.key] = section;
    return acc;
  }, {});

  const addRow = (sectionKey) => {
    const section = sectionMap[sectionKey];
    if (!section) return;
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), createEmptyDynamicRow(section)],
    }));
  };

  const removeRow = (sectionKey, rowId) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((row) => row.id !== rowId),
    }));
  };

  const updateStaticField = (fieldName, value) => {
    setStaticData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const updateDynamicField = (sectionKey, rowId, fieldName, value) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map((row) =>
        row.id === rowId
          ? { ...row, values: { ...row.values, [fieldName]: value } }
          : row
      ),
    }));
  };

  const buildPayload = () => {
    const payload = {};

    competitionFormConfig.forEach((section) => {
      if (section.type === "static") {
        section.fields.forEach((field) => {
          const payloadKey = field.payloadKey || field.name;
          const rawValue = staticData[field.name];
          payload[payloadKey] = field.type === "file" ? rawValue : toCleanString(rawValue);
        });
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];

        if (section.fields.length === 1) {
          const field = section.fields[0];
          const payloadKey = section.payloadKey || field.payloadKey || field.name;
          payload[payloadKey] = extractDynamicList(rows, field.name);
          return;
        }

        const payloadKey = section.payloadKey || section.key;
        payload[payloadKey] = rows
          .map((row) => {
            const rowPayload = {};
            section.fields.forEach((field) => {
              const rowKey = field.payloadKey || field.name;
              const rawValue = row?.values?.[field.name];
              rowPayload[rowKey] = field.type === "file" ? rawValue : toCleanString(rawValue);
            });
            return rowPayload;
          })
          .filter((rowPayload) => Object.values(rowPayload).some(hasMeaningfulValue));
      }
    });

    if (payload.mailId) {
      payload.mailId = toCleanString(payload.mailId).toLowerCase();
    }

    return payload;
  };

  const buildFormData = (payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value == null) return;

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    return formData;
  };

  const validateForm = () => {
    for (const section of competitionFormConfig) {
      if (section.type === "static") {
        for (const field of section.fields) {
          if (field.required !== false) {
            const value = staticData[field.name];
            if (!hasMeaningfulValue(value)) {
              toast.error(`${field.label} is required`);
              return false;
            }
          }
        }
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          for (const field of section.fields) {
            const value = row.values[field.name];

            if (field.required !== false) {
              if (!hasMeaningfulValue(value)) {
                toast.error(`${section.title} (Row ${i + 1}): ${field.label} is required`);
                return false;
              }
            }

            if (hasMeaningfulValue(value)) {
              if (field.type === "tel" && value.length !== 10) {
                toast.error(`${section.title} (Row ${i + 1}): ${field.label} must be exactly 10 digits`);
                return false;
              }
              if (field.name === "mailId" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                toast.error(`${section.title} (Row ${i + 1}): Please enter a valid Email Id`);
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = buildPayload();
      if (competitionId) payload.id = competitionId; // Include ID for update

      const formData = buildFormData(payload);
      await createCompetition(formData);
      toast.success("Competition saved successfully");
      
      // Navigate back after successful save
      navigate("/admin/competition");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save competition");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1400px] mx-auto space-y-5 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200"
      >
        {competitionFormConfig.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-6 border-b pb-6">
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <h2 className="font-source font-semibold text-lg md:text-xl leading-none tracking-normal text-[#000000]">
                {section.title}
              </h2>
              {section.type === "dynamic" &&
                !["grid-6", "row-action"].includes(section.dynamicStyle) && (
                  <button
                    type="button"
                    onClick={() => addRow(section.key)}
                    className="bg-[#001447] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                  >
                    Add
                  </button>
                )}
            </div>

            {section.type === "static" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {section.fields.map((field, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className={`${field.span === 2 ? "md:col-span-2" : ""} min-w-0`}
                  >
                    <Label text={field.label} required={field.required !== false} />
                    <FormInput
                      field={field}
                      value={staticData[field.name]}
                      onChange={(value) => updateStaticField(field.name, value)}
                      inputName={field.name}
                    />
                  </div>
                ))}
              </div>
            )}

            {section.type === "dynamic" && section.dynamicStyle === "grid-6" && (
              <div className="space-y-4">
                {Array.from(
                  { length: Math.ceil((dynamicData[section.key] || []).length / 3) },
                  (_, chunkIndex) =>
                    (dynamicData[section.key] || []).slice(chunkIndex * 3, chunkIndex * 3 + 3)
                ).map((chunk, chunkIndex) => (
                  <div
                    key={`${section.key}-chunk-${chunkIndex}`}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-end"
                  >
                    {chunk.map((rowData, indexInChunk) => {
                      const itemIndex = chunkIndex * 3 + indexInChunk + 1;
                      const baseField = section.fields[0];
                      const numberedField = {
                        ...baseField,
                        label: `${section.title} (${itemIndex})`,
                        required: itemIndex <= 3,
                      };

                      return (
                        <div key={rowData.id}>
                          <Label
                            text={numberedField.label}
                            required={numberedField.required !== false}
                          />
                          <FormInput
                            field={baseField}
                            value={rowData.values[baseField.name]}
                            onChange={(value) =>
                              updateDynamicField(section.key, rowData.id, baseField.name, value)
                            }
                            inputName={`${section.key}_${rowData.id}_${baseField.name}`}
                          />
                        </div>
                      );
                    })}

                    <div className="flex items-end justify-start lg:justify-center">
                      {chunkIndex === 0 ? (
                        <button
                          type="button"
                          onClick={() => addRow(section.key)}
                          className="h-10 bg-[#001447] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto"
                        >
                          Add
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const rows = dynamicData[section.key] || [];
                            const lastRow = rows[rows.length - 1];
                            if (lastRow) removeRow(section.key, lastRow.id);
                          }}
                          className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition"
                        >
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === "dynamic" && section.dynamicStyle === "row-action" && (
              <div className="space-y-4">
                {(dynamicData[section.key] || []).map((rowData, rowIndex) => (
                  <div
                    key={rowData.id}
                    className={`grid grid-cols-1 ${
                      section.fields.length >= 4
                        ? "md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
                        : "md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
                    } gap-4 items-end`}
                  >
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex}>
                        <Label text={field.label} required={field.required !== false} />
                        <FormInput
                          field={field}
                          value={rowData.values[field.name]}
                          onChange={(value) =>
                            updateDynamicField(section.key, rowData.id, field.name, value)
                          }
                          inputName={`${section.key}_${rowData.id}_${field.name}`}
                        />
                      </div>
                    ))}
                    <div className="flex items-end justify-start lg:justify-center">
                      {rowIndex === 0 ? (
                        <button
                          type="button"
                          onClick={() => addRow(section.key)}
                          className="h-10 bg-[#001447] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto"
                        >
                          Add
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeRow(section.key, rowData.id)}
                          className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition"
                        >
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === "dynamic" && !section.dynamicStyle && (
              <div className="space-y-4">
                {(dynamicData[section.key] || []).map((rowData, rowIndex) => (
                  <div
                    key={rowData.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                  >
                    {section.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className={field.colSpan}>
                        <Label text={field.label} required={field.required !== false} />
                        <FormInput
                          field={field}
                          value={rowData.values[field.name]}
                          onChange={(value) =>
                            updateDynamicField(section.key, rowData.id, field.name, value)
                          }
                          inputName={`${section.key}_${rowData.id}_${field.name}`}
                        />
                      </div>
                    ))}
                    <div className="md:col-span-1 flex justify-center pb-2">
                      {rowIndex > 0 && (
                        <Trash2
                          className="text-red-500 cursor-pointer hover:scale-110 transition"
                          onClick={() => removeRow(section.key, rowData.id)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full md:w-auto px-6 md:px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 md:px-10 py-2 bg-[#0095ff] text-white rounded font-bold shadow-md hover:bg-blue-600 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompetitionForm;
