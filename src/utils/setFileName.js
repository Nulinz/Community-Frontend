// src/utils/setFileName.js
const BASE_URL = import.meta.env.VITE_API_URL 

function setFileName(file) {
  if (!file) return "";

  // If it's already a full URL, return as-is
  if (file.startsWith("http")) {
    return file;
  }

  // Otherwise, prepend the base URL + /beta/api
  return `${BASE_URL}${file.startsWith("/") ? "" : "/"}${file}`;
}

export default setFileName;