import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import setFileName from "../utils/setFileName";


const toCleanString = (value) => String(value || "").trim();

const getInitialFieldValue = (field) => {
  if (field.type === "checkbox" || field.type === "multiselect") return [];
  if (field.type === "toggle") {
    return Array.isArray(field.options) && field.options.length === 2
      ? field.options[1]
      : "No";
  }
  return "";
};

const hasMeaningfulValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return toCleanString(value).length > 0;
};

const safeParseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "string") return JSON.parse(parsed);
      return parsed;
    } catch { return []; }
  }
  return [];
};

const createInitialStaticData = (config, overrides = {}) => {
  const data = {};
  config.filter((s) => s.type === "static").forEach((section) => {
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

const createInitialDynamicData = (config) => {
  const data = {};
  config.filter((s) => s.type === "dynamic").forEach((section) => {
    const rowCount = section.initialRows || 1;
    data[section.key] = Array.from({ length: rowCount }, () =>
      createEmptyDynamicRow(section)
    );
  });
  return data;
};

const extractDynamicList = (rows = [], fieldName) =>
  rows.map((row) => toCleanString(row?.values?.[fieldName])).filter(Boolean);

// ─── Label ──────────────────────────────────────────────────
const Label = ({ text, required = true }) => (
  <label className="block font-source font-semibold text-sm md:text-base leading-none tracking-normal text-primary mb-2">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

// ─── FormInput ──────────────────────────────────────────────
const FormInput = ({ field, value, onChange, inputName }) => {
  if (field.type === "checkbox") {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
        {field.options.map((opt) => (
          <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name={`${inputName}-${opt}`}
                checked={selectedValues.includes(opt)}
                onChange={(e) =>
                  onChange(
                    e.target.checked
                      ? [...selectedValues, opt]
                      : selectedValues.filter((i) => i !== opt)
                  )
                }
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 transition-all"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : [];
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleValue = (opt) =>
      onChange(
        selectedValues.includes(opt)
          ? selectedValues.filter((i) => i !== opt)
          : [...selectedValues, opt]
      );

    return (
      <div className="relative w-full" ref={ref}>
        <div
          onClick={() => setOpen(!open)}
          className="w-full min-h-10 p-2 border border-gray-200 rounded bg-[#fcfcfc] flex flex-wrap gap-2 cursor-pointer"
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 text-sm">Select options</span>
          ) : (
            selectedValues.map((val) => (
              <span key={val} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                {val}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedValues.filter((i) => i !== val));
                  }}
                  className="cursor-pointer hover:text-red-500 font-bold leading-none"
                >
                  ×
                </span>
              </span>
            ))
          )}
        </div>
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
            {field.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                <input type="checkbox" checked={selectedValues.includes(opt)} onChange={() => toggleValue(opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (field.type === "toggle") {
    const options = Array.isArray(field.options) && field.options.length === 2 ? field.options : ["Yes", "No"];
    const isFirstOptionActive = value === options[0];
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isFirstOptionActive}
        onClick={() => onChange(isFirstOptionActive ? options[1] : options[0])}
        className={`relative inline-flex h-10 min-w-[110px] items-center rounded-full px-1 transition-colors ${isFirstOptionActive ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${isFirstOptionActive ? "translate-x-0" : "translate-x-[70px]"}`} />
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
          <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={inputName}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 transition-all"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
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
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    const isExisting = typeof value === "string" && value !== "";
    const isNew = value instanceof File;
    const isImage = field.name === "coverImage" || field.name === "collegeLogo" || field.name === "companyLogo";

    return (
      <div className="space-y-2">
       
        <div className="flex relative border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
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

        {(isExisting || isNew) && (
  <div className="w-8 absolute right-0 top-1  h-8 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
    <img
      src={isNew ? URL.createObjectURL(value) : setFileName(value)}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </div>
)}
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
      readOnly={field.readOnly}
      onChange={(e) => {
        if (field.readOnly) return;
        let nextValue = e.target.value;
        if (field.type === "tel") nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
        onChange(nextValue);
      }}
      inputMode={field.type === "tel" ? "numeric" : undefined}
      maxLength={field.type === "tel" ? 10 : undefined}
      className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
    />
  );
};

// ─── FormLayout ─────────────────────────────────────────────
const FormLayout = ({
  config,           // form config array
  editData,         // existing data for edit mode (optional)
  onSubmit,         // async fn(formData, payload, staticData) => void
  staticOverrides,  // extra initial static values e.g. { companyName: "Acme" }
  submitLabel,      // override "Save" button text
  dateFields,       // array of field names to format as YYYY-MM-DD e.g. ["eventDate"]
}) => {
  const navigate = useNavigate();

const [staticData, setStaticData] = useState(() => {
  if (editData) {
    const data = {};
    config.filter((s) => s.type === "static").forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === "file") {
          data[field.name] = editData[field.name] ?? "";
        } else if (field.type === "multiselect") {
          data[field.name] = safeParseArray(editData[field.name]);
        } else if (field.type === "date") {
          // ✅ Auto-format any date field — no need for dateFields prop
          const val = editData[field.name];
          if (val) {
            try { data[field.name] = new Date(val).toISOString().split("T")[0]; }
            catch { data[field.name] = ""; }
          } else {
            data[field.name] = "";
          }
        } else {
          const val = editData[field.name];
          data[field.name] = val !== undefined && val !== null
            ? val
            : getInitialFieldValue(field);
        }
      });
    });
    if (editData._id || editData.id) data.id = editData._id || editData.id;
    return data;
  }
  return createInitialStaticData(config, staticOverrides);
});

  const [dynamicData, setDynamicData] = useState(() => {
    if (editData) {
      const data = {};
      config.filter((s) => s.type === "dynamic").forEach((section) => {
        const list = editData[section.payloadKey || section.key];
        if (Array.isArray(list) && list.length > 0) {
          data[section.key] = list.map((item) => ({
            id: item._id || `${Date.now()}-${Math.random()}`,
            // single-field sections store primitives, multi-field store objects
            values: typeof item === "object" && !Array.isArray(item)
              ? { ...item }
              : { [section.fields[0].name]: item },
          }));
        } else {
          data[section.key] = Array.from(
            { length: section.initialRows || 1 },
            () => createEmptyDynamicRow(section)
          );
        }
      });
      return data;
    }
    return createInitialDynamicData(config);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // keep staticOverrides in sync (e.g. organizerName loads async)
  useEffect(() => {
    if (!editData && staticOverrides) {
      setStaticData((prev) => ({ ...prev, ...staticOverrides }));
    }
  }, [JSON.stringify(staticOverrides)]);

  const sectionMap = config.reduce((acc, section) => {
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

  const updateStaticField = (fieldName, value) =>
    setStaticData((prev) => ({ ...prev, [fieldName]: value }));

  const updateDynamicField = (sectionKey, rowId, fieldName, value) =>
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map((row) =>
        row.id === rowId ? { ...row, values: { ...row.values, [fieldName]: value } } : row
      ),
    }));

  const buildPayload = () => {
    const payload = {};
    if (staticData.id) payload.id = staticData.id;

    config.forEach((section) => {
      if (section.type === "static") {
        section.fields.forEach((field) => {
          const payloadKey = field.payloadKey || field.name;
          const rawValue = staticData[field.name];
          if (field.type === "file") {
            payload[payloadKey] = rawValue;
          } else if (field.type === "multiselect" || Array.isArray(rawValue)) {
            payload[payloadKey] = Array.isArray(rawValue) ? rawValue : [];
          } else {
            payload[payloadKey] = toCleanString(rawValue);
          }
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
              if (field.type === "file") rowPayload[rowKey] = rawValue;
              else if (field.type === "multiselect" || Array.isArray(rawValue))
                rowPayload[rowKey] = Array.isArray(rawValue) ? rawValue : [];
              else rowPayload[rowKey] = toCleanString(rawValue);
            });
            return rowPayload;
          })
          .filter((rowPayload) => Object.values(rowPayload).some(hasMeaningfulValue));
      }
    });

    return payload;
  };

  const buildFormData = (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value == null) return;
      if (value instanceof File) { formData.append(key, value); return; }
      if (Array.isArray(value)) { formData.append(key, JSON.stringify(value)); return; }
      formData.append(key, String(value));
    });
    return formData;
  };

  const validateForm = () => {
    const isEdit = !!staticData.id;
    for (const section of config) {
      // showWhen support
      if (section.showWhen && staticData[section.showWhen.field] !== section.showWhen.value) continue;

      if (section.type === "static") {
        for (const field of section.fields) {
          if (field.required === false) continue;
          const value = staticData[field.name];
          if (field.type === "file" && isEdit && typeof value === "string" && value.trim() !== "") continue;
          if (!hasMeaningfulValue(value)) {
            toast.error(`${field.label} is required`);
            return false;
          }
        }
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          for (const field of section.fields) {
            if (field.required === false) continue;
            const value = row.values[field.name];
            if (!hasMeaningfulValue(value)) {
              toast.error(`${section.title} (Row ${i + 1}): ${field.label} is required`);
              return false;
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
      const formData = buildFormData(payload);
      await onSubmit(formData, payload, staticData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save");
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
        {config
          .filter((section) =>
            !section.showWhen || staticData[section.showWhen.field] === section.showWhen.value
          )
          .map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6 border-b pb-6 last:border-b-0">
              <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <h2 className="font-source font-semibold text-lg md:text-xl leading-none tracking-normal text-[#000000]">
                  {section.title}
                </h2>
                {section.type === "dynamic" && !["grid-6", "row-action"].includes(section.dynamicStyle) && (
                  <button type="button" onClick={() => addRow(section.key)} className="bg-[#001447] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                    Add
                  </button>
                )}
              </div>

              {/* STATIC */}
              {section.type === "static" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className={`${field.span === 2 ? "md:col-span-2" : ""} min-w-0`}>
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

              {/* DYNAMIC: grid-6 */}
              {section.type === "dynamic" && section.dynamicStyle === "grid-6" && (
                <div className="space-y-4">
                  {Array.from(
                    { length: Math.ceil((dynamicData[section.key] || []).length / 3) },
                    (_, chunkIndex) => (dynamicData[section.key] || []).slice(chunkIndex * 3, chunkIndex * 3 + 3)
                  ).map((chunk, chunkIndex) => (
                    <div key={`${section.key}-chunk-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-end">
                      {chunk.map((rowData, indexInChunk) => {
                        const itemIndex = chunkIndex * 3 + indexInChunk + 1;
                        const baseField = section.fields[0];
                        return (
                          <div key={rowData.id}>
                            <Label text={`${section.title} (${itemIndex})`} required={itemIndex <= 3} />
                            <FormInput
                              field={baseField}
                              value={rowData.values[baseField.name]}
                              onChange={(value) => updateDynamicField(section.key, rowData.id, baseField.name, value)}
                              inputName={`${section.key}_${rowData.id}_${baseField.name}`}
                            />
                          </div>
                        );
                      })}
                      <div className="flex items-end justify-start lg:justify-center">
                        {chunkIndex === 0 ? (
                          <button type="button" onClick={() => addRow(section.key)} className="h-10 bg-[#001447] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto">Add</button>
                        ) : (
                          <button type="button" onClick={() => { const rows = dynamicData[section.key] || []; const lastRow = rows[rows.length - 1]; if (lastRow) removeRow(section.key, lastRow.id); }} className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition">
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DYNAMIC: row-action */}
              {section.type === "dynamic" && section.dynamicStyle === "row-action" && (
                <div className="space-y-4">
                  {(dynamicData[section.key] || []).map((rowData, rowIndex) => (
                    <div key={rowData.id} className={`grid grid-cols-1 ${section.fields.length >= 4 ? "md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]" : "md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"} gap-4 items-end`}>
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex}>
                          <Label text={field.label} required={field.required !== false} />
                          <FormInput
                            field={field}
                            value={rowData.values[field.name]}
                            onChange={(value) => updateDynamicField(section.key, rowData.id, field.name, value)}
                            inputName={`${section.key}_${rowData.id}_${field.name}`}
                          />
                        </div>
                      ))}
                      <div className="flex items-end justify-start lg:justify-center">
                        {rowIndex === 0 ? (
                          <button type="button" onClick={() => addRow(section.key)} className="h-10 bg-[#001447] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto">Add</button>
                        ) : (
                          <button type="button" onClick={() => removeRow(section.key, rowData.id)} className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition">
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DYNAMIC: default (col-span) */}
              {section.type === "dynamic" && !section.dynamicStyle && (
                <div className="space-y-4">
                  {(dynamicData[section.key] || []).map((rowData, rowIndex) => (
                    <div key={rowData.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className={field.colSpan}>
                          <Label text={field.label} required={field.required !== false} />
                          <FormInput
                            field={field}
                            value={rowData.values[field.name]}
                            onChange={(value) => updateDynamicField(section.key, rowData.id, field.name, value)}
                            inputName={`${section.key}_${rowData.id}_${field.name}`}
                          />
                        </div>
                      ))}
                      <div className="md:col-span-1 flex justify-center pb-2">
                        {rowIndex > 0 && (
                          <Trash2 className="text-red-500 cursor-pointer hover:scale-110 transition" onClick={() => removeRow(section.key, rowData.id)} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
          <button type="button" onClick={() => navigate(-1)} className="w-full md:w-auto px-6 md:px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-6 md:px-10 py-2 bg-[#0095ff] text-white rounded font-bold shadow-md hover:bg-blue-600 disabled:opacity-70">
            {isSubmitting ? "Saving..." : submitLabel || (editData ? "Update" : "Save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormLayout;