/**
 * Application & Registration Notification Tracker
 *
 * Provides a lightweight, client-side tracking mechanism using localStorage
 * to detect unread applicant counts for Jobs, Internships, Envy (Freelancing),
 * and registration counts for Events, Competitions, Seminars, and Conferences.
 *
 * Dispatches the custom 'nulinz_seen_updated' window event to keep table rows
 * and the navigation sidebar in sync simultaneously without needing new backend APIs.
 */

const COUNTS_STORAGE_KEY = "nulinz_seen_counts";
const CATEGORIES_STORAGE_KEY = "nulinz_category_badges";

/**
 * Retrieves the persisted map of { [itemId]: lastSeenCount } from localStorage.
 */
export const getSeenMap = () => {
  try {
    return JSON.parse(localStorage.getItem(COUNTS_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

/**
 * Determines whether a specific opportunity or event item has unread applicants or registrations.
 *
 * @param {string|number} itemId - The unique document _id
 * @param {number} currentCount - Total applications or registrations count returned by the API
 * @returns {boolean} True if the count is greater than the recorded last-seen count
 */
export const hasNewRegistrations = (itemId, currentCount = 0) => {
  const numericCount = Number(currentCount) || 0;
  if (!itemId || numericCount <= 0) return false;

  const seenMap = getSeenMap();
  const lastSeen = seenMap[String(itemId)];

  // If the admin has never opened this item, flag as new if count > 0; otherwise check for growth
  return lastSeen === undefined ? numericCount > 0 : numericCount > Number(lastSeen);
};

/**
 * Records an item's current applicant/registration count as 'seen'.
 * Dispatches a window-wide notification event so the Sidebar and lists clear the badge simultaneously.
 *
 * @param {string|number} itemId - The unique document _id
 * @param {number} currentCount - The count to record as seen
 */
export const markItemAsSeen = (itemId, currentCount = 0) => {
  if (!itemId) return;
  const seenMap = getSeenMap();
  seenMap[String(itemId)] = Number(currentCount) || 0;
  localStorage.setItem(COUNTS_STORAGE_KEY, JSON.stringify(seenMap));

  window.dispatchEvent(new Event("nulinz_seen_updated"));
};

/**
 * Helper to check whether any item in a given list has unread applicants/registrations.
 *
 * @param {Array} items - List of opportunities or events
 * @param {Array<string>} [countFields=['appliedCount', 'applied', 'registeredCount']] - Possible count field keys
 * @returns {boolean}
 */
export const hasAnyUnreadInList = (items = [], countFields = ["appliedCount", "applied", "registeredCount"]) => {
  if (!Array.isArray(items) || items.length === 0) return false;

  return items.some((item) => {
    if (!item) return false;
    const id = item._id || item.id;
    let count = 0;
    for (const field of countFields) {
      if (item[field] !== undefined && item[field] !== null) {
        count = Number(item[field]) || 0;
        break;
      }
    }
    return hasNewRegistrations(id, count);
  });
};

/**
 * Retrieves the category badge map used by the navigation sidebar.
 */
export const getCategoryBadges = () => {
  try {
    return JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

/**
 * Updates a category badge status in localStorage and notifies the navigation sidebar.
 *
 * @param {string} categoryKey - e.g., 'jobs', 'internships', 'freelance', 'events', 'competition', 'seminar', 'conference'
 * @param {boolean} hasUnread - Whether this category has any unread items
 */
export const setCategoryBadge = (categoryKey, hasUnread) => {
  if (!categoryKey) return;
  const badges = getCategoryBadges();
  const nextVal = Boolean(hasUnread);
  if (badges[categoryKey] === nextVal) return;
  badges[categoryKey] = nextVal;
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(badges));
  window.dispatchEvent(new Event("nulinz_seen_updated"));
};

/**
 * Silently synchronizes category badges on application load without blocking rendering.
 *
 * @param {string} userRole - The current user's role
 */
export const syncAllCategoryBadges = async (userRole = "") => {
  try {
    const {
      getAllJobs,
      getAllInternships,
      getAllFreelances,
      getAllEvents,
      getAllCompetitions,
      getAllSeminars,
      getAllConferences,
    } = await import("../services/admin/adminServices");

    const requests = [
      getAllJobs("community")
        .then((res) => setCategoryBadge("jobs", hasAnyUnreadInList(res?.data, ["appliedCount", "applied"])))
        .catch(() => {}),
      getAllInternships("community")
        .then((res) => setCategoryBadge("internships", hasAnyUnreadInList(res?.data, ["appliedCount", "applied"])))
        .catch(() => {}),
      getAllEvents("community")
        .then((res) => setCategoryBadge("events", hasAnyUnreadInList(res?.data, ["registeredCount"])))
        .catch(() => {}),
      getAllCompetitions("community")
        .then((res) => setCategoryBadge("competition", hasAnyUnreadInList(res?.data, ["registeredCount"])))
        .catch(() => {}),
      getAllSeminars("community")
        .then((res) => setCategoryBadge("seminar", hasAnyUnreadInList(res?.data, ["registeredCount"])))
        .catch(() => {}),
      getAllConferences("community")
        .then((res) => setCategoryBadge("conference", hasAnyUnreadInList(res?.data, ["registeredCount"])))
        .catch(() => {}),
    ];

    if (userRole === "admin") {
      requests.push(
        getAllFreelances("community")
          .then((res) => setCategoryBadge("freelance", hasAnyUnreadInList(res?.data, ["appliedCount", "applied"])))
          .catch(() => {})
      );
    } else {
      setCategoryBadge("freelance", false);
    }

    await Promise.allSettled(requests);
  } catch {
    // Non-blocking background sync
  }
};

