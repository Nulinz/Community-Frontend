import API from "../utils/api";

/**
 * Universal deletion service for all community entities (Events, Competitions,
 * Seminars, Conferences, Jobs, Internships, Freelance projects, Companies, Colleges).
 * Dispatches a standard DELETE request to the unified backend endpoint.
 */
export const deleteModuleItem = async (moduleType, id) => {
  const response = await API.delete(`/common/module/${moduleType}/${id}`);
  return response.data;
};
