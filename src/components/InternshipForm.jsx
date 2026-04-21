import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createInternship } from "../services/admin/adminServices";
import { useOrganizerDisplayName } from "../utils/organizer";

const internshipFormConfig = [
  {
    title: "Basic Details",
    type: "static",
    fields: [
      { name: "internshipType", label: "Internship Type", type: "radio", options: ["Paid", "Unpaid"] },
      { name: "jobTitle", label: "Job Title", type: "text" },
      {
        name: "companyName",
        label: "Organizer",
        type: "text",
        readOnly: true,
      },
      { name: "location", label: "Location", type: "text" },
      { name: "mode", label: "Mode", type: "select", options: ["Online", "Offline", "Hybrid"] },
      { name: "totalOpenings", label: "Total Openings", type: "number" },
      {
        name: "duration",
        label: "Duration",
        type: "select",
        options: ["No Fixed Duration", "1 Month", "3 Months", "6 Months"],
      },
      { name: "internStartDate", label: "Intern Start Date", type: "date" },
      { name: "applicationDeadline", label: "Application Deadline", type: "date" },
      { name: "salary", label: "Salary", type: "number" },
    ],
  },
  {
    title: "Responsibilities",
    type: "dynamic",
    key: "responsibilities",
    dynamicStyle: "grid-6",
    initialRows: 6,
    fields: [{ name: "responsibility", label: "Responsibility", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Eligibility Criteria",
    type: "dynamic",
    key: "eligibility",
    dynamicStyle: "grid-6",
    initialRows: 6,
    fields: [{ name: "eligibilityCriteria", label: "Eligibility Criteria", type: "text", colSpan: "md:col-span-11" }],
  },
  {
    title: "Project Description",
    type: "static",
    fields: [
      { name: "description", label: "Description", type: "textarea", span: 2 },
      { name: "certificateAvailability", label: "Certificate Availability", type: "textarea", span: 2 },
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

const createInitialStaticData = (overrides = {}) => {
  const data = {};
  internshipFormConfig
    .filter((section) => section.type === "static")
    .forEach((section) => {
      section.fields.forEach((field) => {
        data[field.name] = getInitialFieldValue(field);
      });
    });
  return { ...data, ...overrides };
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
  internshipFormConfig
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
    return (
      <div className="flex border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
        <label className="bg-[#0095ff] text-xs md:text-sm text-white px-3 md:px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:bg-blue-600 transition">
          Choose File
          <input
            type="file"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        </label>
        <span className="flex-1 min-w-0 bg-[#fcfcfc] px-3 md:px-4 py-2.5 text-gray-400 text-xs truncate">
          {value?.name || "No File Chosen"}
        </span>
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
      readOnly={field.readOnly}
      onChange={(e) => {
        if (field.readOnly) return;
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

const InternshipForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const organizerName = useOrganizerDisplayName();

  const [staticData, setStaticData] = useState(() => {
    if (editData) {
      const data = {};
      internshipFormConfig
        .filter((section) => section.type === "static")
        .forEach((section) => {
          section.fields.forEach((field) => {
            data[field.name] = editData[field.name] || getInitialFieldValue(field);
          });
      });
      if (editData._id || editData.id) data.id = editData._id || editData.id;
      return data;
    }
    return createInitialStaticData({ companyName: organizerName });
  });

  const [dynamicData, setDynamicData] = useState(() => {
    if (editData) {
      const data = {};
      internshipFormConfig
        .filter((section) => section.type === "dynamic")
        .forEach((section) => {
          const list = editData[section.key];
          if (Array.isArray(list)) {
            data[section.key] = list.map((item) => ({
              id: item._id || `${Date.now()}-${Math.random()}`,
              values: { [section.fields[0].name]: item },
            }));
          } else {
            data[section.key] = [createEmptyDynamicRow(section)];
          }
        });
      return data;
    }
    return createInitialDynamicData();
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) return;
    setStaticData((prev) => ({ ...prev, companyName: organizerName }));
  }, [editData, organizerName]);

  const sectionMap = internshipFormConfig.reduce((acc, section) => {
    if (section.type === "dynamic" && section.key) acc[section.key] = section;
    return acc;
  }, {});

  // add row
  const addRow = (sectionKey) => {
    const section = sectionMap[sectionKey];
    if (!section) return;
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), createEmptyDynamicRow(section)],
    }));
  };

  // remove row
  const removeRow = (sectionKey, rowId) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((row) => row.id !== rowId),
    }));
  };

  // update static fields
  const updateStaticField = (fieldName, value) => {
    setStaticData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // update dynamic fields
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

  // payload
  const buildPayload = () => {
    const payload = {};

    internshipFormConfig.forEach((section) => {
      if (section.type === "static") {
        section.fields.forEach((field) => {
          const payloadKey = field.payloadKey || field.name;
          const rawValue = staticData[field.name];
          payload[payloadKey] = toCleanString(rawValue);
        });
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];

        if (section.fields.length === 1) {
          const field = section.fields[0];
          const payloadKey = section.payloadKey || section.key || field.payloadKey || field.name;
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
              rowPayload[rowKey] = toCleanString(rawValue);
            });
            return rowPayload;
          })
          .filter((rowPayload) => Object.values(rowPayload).some(hasMeaningfulValue));
      }
    });

    if (staticData.id) payload.id = staticData.id;

    return payload;
  };

  const validateForm = () => {
    for (const section of internshipFormConfig) {
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

            // For responsibilities and eligibility, only first 3 inputs are required
            const isSpecialSection = ["responsibilities", "eligibility"].includes(section.key);
            const isRequiredRow = isSpecialSection ? i < 3 : field.required !== false;

            if (isRequiredRow) {
              if (!hasMeaningfulValue(value)) {
                toast.error(`${section.title} (Row ${i + 1}): ${field.label} is required`);
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
      await createInternship(payload);
      toast.success("Internship saved successfully");
      setStaticData(createInitialStaticData({ companyName: organizerName }));
      setDynamicData(createInitialDynamicData());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save internship");
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
        {internshipFormConfig.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-6 border-b pb-6 last:border-b-0">
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

export default InternshipForm;
