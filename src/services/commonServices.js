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

/**
 * Universal media deletion service for entity posts (Events, Competitions,
 * Seminars, Conferences, Companies).
 * Dispatches a DELETE request with the target image path in payload.
 */
export const deleteModulePost = async (moduleType, id, imageUrl) => {
  const response = await API.delete(`/common/module/${moduleType}/${id}/post`, {
    data: { imageUrl },
  });
  return response.data;
};

