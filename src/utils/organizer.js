import { useMain } from "../context/MainContext";

export const useOrganizerDisplayName = () => {
  const { user } = useMain();
  const role = String(user?.role || "").trim().toLowerCase();

  if (role === "admin") {
    return "nulinz community";
  }

  return String(user?.name || "").trim();
};
