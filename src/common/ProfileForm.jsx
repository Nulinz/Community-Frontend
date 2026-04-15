import React, { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formVariants } from '../utils/profileFormConfigs';


const createEmptyDynamicRow = (section) => {
  const base = { id: `${Date.now()}-${Math.random()}` };
  section.fields.forEach((field) => {
    const key = field.label.replace(/\s+/g, '_').toLowerCase();
    base[key] = '';
  });
  return base;
};

const createInitialDynamicData = (config) => {
  return config.reduce((acc, section) => {
    if (section.type === 'dynamic') {
      const rowCount = section.initialRows || 1;
      acc[section.key] = Array.from({ length: rowCount }, () => createEmptyDynamicRow(section));
    }
    return acc;
  }, {});
};


const ProfileForm = ({ formVariant: formVariantProp }) => {
  const location = useLocation();
  const navigate = useNavigate();

//   takeing form varient
  const formType = location.state?.formType || 'event';
  const selectedVariant = location.state?.formVariant || formVariantProp || formVariants[formType] || formVariants.event;


  const formConfig = selectedVariant?.formConfig || [];

  const sectionMap = useMemo(
    () =>
      formConfig.reduce((acc, section) => {
        if (section.type === 'dynamic' && section.key) {
          acc[section.key] = section;
        }
        return acc;
      }, {}),
    [formConfig]
  );

  const [dynamicData, setDynamicData] = useState(() => createInitialDynamicData(formConfig));

  useEffect(() => {
    setDynamicData(createInitialDynamicData(formConfig));
  }, [formConfig]);

  const addRow = (sectionKey) => {
    const section = sectionMap[sectionKey];
    if (!section) return;

    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), createEmptyDynamicRow(section)],
    }));
  };

  const removeRow = (sectionKey, id) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((item) => item.id !== id),
    }));
  };

  const Label = ({ text, required = true }) => (
    <label className="block font-source font-semibold text-[16px] leading-none tracking-normal text-primary mb-2">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const FormInput = ({ field }) => {
    if (field.type === 'checkbox') {
      return (
        <div className="flex gap-6 items-center h-10">
          {field.options.map((opt) => (
            <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                name={`${field.label}-${opt}`}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 transition-all"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    }

    if (field.type === 'radio') {
      return (
        <div className="flex gap-6 items-center h-10">
          {field.options.map((opt) => (
            <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={field.label}
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

    if (field.type === 'select') {
      return (
        <select className="w-full p-2.5 border border-gray-200 rounded bg-[#fcfcfc] text-sm h-10 outline-none">
          {field.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'file') {
      return (
        <div className="flex border border-gray-200 rounded overflow-hidden h-10 w-[273px] font-source transition focus-within:border-blue-400">
          <label className="bg-[#0095ff] text-[14px] text-white px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:bg-blue-600 transition">
            Choose File
            <input type="file" className="hidden" />
          </label>
          <span className="flex-1 bg-[#fcfcfc] px-4 py-2.5 text-gray-400 text-xs truncate">No File Chosen</span>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          rows={4}
          className="w-full p-3 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm resize-none"
        />
      );
    }

    return (
      <input
        type={field.type}
        className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
      />
    );
  };

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <form className="space-y-5 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* <h1 className="font-source font-semibold text-[24px] text-[#000000]">{selectedVariant.title}</h1> */}

        {formConfig.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6 border-b pb-6">
            <div className="flex justify-between items-center">
              <h2 className="font-source font-semibold text-[20px] leading-none tracking-normal text-[#000000]">
                {section.title}
              </h2>
              {section.type === 'dynamic' && !['grid-6', 'row-action'].includes(section.dynamicStyle) && (
                <button
                  type="button"
                  onClick={() => addRow(section.key)}
                  className="bg-[#001447] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                >
                  Add
                </button>
              )}
            </div>

            {section.type === 'static' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx} className={field.span === 2 ? 'md:col-span-2' : ''}>
                    <Label text={field.label} required={field.required !== false} />
                    <FormInput field={field} />
                  </div>
                ))}
              </div>
            )}

            {section.type === 'dynamic' && (
              <div className="space-y-4">
                {section.dynamicStyle === 'row-action' ? (
                  (dynamicData[section.key] || []).map((rowData, rIdx) => (
                    <div
                      key={rowData.id}
                      className={`grid grid-cols-1 ${
                        section.fields.length >= 4
                          ? 'md:grid-cols-[repeat(4,minmax(0,1fr))_auto]'
                          : 'md:grid-cols-[repeat(3,minmax(0,1fr))_auto]'
                      } gap-4 items-end`}
                    >
                      {section.fields.map((field, fIdx) => (
                        <div key={fIdx}>
                          <Label text={field.label} required={field.required !== false} />
                          <FormInput field={field} />
                        </div>
                      ))}
                      <div className="flex items-end justify-center md:justify-center">
                        {rIdx === 0 ? (
                          <button
                            type="button"
                            onClick={() => addRow(section.key)}
                            className="h-10 bg-[#001447] text-white px-5 rounded-md text-sm font-bold"
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
                  ))
                ) : section.dynamicStyle === 'grid-6' ? (
                  <>
                    {Array.from(
                      { length: Math.ceil((dynamicData[section.key] || []).length / 3) },
                      (_, chunkIdx) => (dynamicData[section.key] || []).slice(chunkIdx * 3, chunkIdx * 3 + 3)
                    ).map((chunk, chunkIdx) => (
                      <div key={`${section.key}-chunk-${chunkIdx}`} className="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-end">
                        {chunk.map((rowData, idxInChunk) => {
                          const itemIndex = chunkIdx * 3 + idxInChunk + 1;
                          const baseField = section.fields[0];
                          const numberedField = {
                            ...baseField,
                            label: `${section.title} (${itemIndex})`,
                            required: itemIndex <= 3,
                          };

                          return (
                            <div key={rowData.id}>
                              <Label text={numberedField.label} required={numberedField.required !== false} />
                              <FormInput field={numberedField} />
                            </div>
                          );
                        })}

                        <div className="flex items-end justify-center md:justify-center">
                          {chunkIdx === 0 ? (
                            <button
                              type="button"
                              onClick={() => addRow(section.key)}
                              className="h-10 bg-[#001447] text-white px-5 rounded-md text-sm font-bold"
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
                  </>
                ) : (
                  (dynamicData[section.key] || []).map((rowData, rIdx) => (
                    <div key={rowData.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {section.fields.map((field, fIdx) => (
                        <div key={fIdx} className={field.colSpan}>
                          <Label text={field.label} />
                          <FormInput field={field} />
                        </div>
                      ))}
                      <div className="md:col-span-1 flex justify-center pb-2">
                        {rIdx > 0 && (
                          <Trash2
                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                            onClick={() => removeRow(section.key, rowData.id)}
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {selectedVariant.descriptionLabel && (
          <div className="space-y-4">
            <h2 className="font-source font-semibold text-[20px] leading-none tracking-normal text-[#000000]">
              {selectedVariant.descriptionLabel}
            </h2>
            <textarea
              className="w-full h-32 p-3 border border-gray-200 rounded bg-[#fcfcfc] outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter details..."
            />
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" className="px-10 py-2 bg-[#0095ff] text-white rounded font-bold shadow-md hover:bg-blue-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
