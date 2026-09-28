import { useMain } from "../context/MainContext";

/**
 * Custom hook to resolve the active organizer display name from user session context.
 * Used across EventForm, SeminarForm, CompetitionForm, and ConferenceForm to pre-fill
 * the organizer input and static form overrides.
 */
export const useOrganizerDisplayName = () => {
  const { user } = useMain();
  const role = String(user?.role || "").trim().toLowerCase();

  if (role === "admin") {
    return "nulinz community";
  }

  return String(user?.collegeName || user?.companyName || user?.name || "").trim();
};

