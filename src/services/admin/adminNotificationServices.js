/**
 * Admin Notification API Services
 *
 * Dedicated client service module handling communication with administrative
 * notification dispatch endpoints:
 * 1. apiGetNotificationAudienceCounts: Retrieves live counts of eligible users per category.
 * 2. apiDispatchAdminNotification: Fires bulk dispatch for events, subscriptions, or jobs.
 * 3. apiDispatchApplicationViewedNotification: Fires targeted notification to applicants of a specific job.
 */

import API from "../../utils/api";

/**
 * Fetch estimated audience counts for events, subscriptions, and unapplied jobs.
 */
export const apiGetNotificationAudienceCounts = async () => {
  try {
    const response = await API.get("/admin/notifications/preview-counts");
    return response.data;
  } catch (error) {
    console.error("apiGetNotificationAudienceCounts error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Dispatch bulk notifications for global category ('events' | 'subscriptions' | 'jobs').
 */
export const apiDispatchAdminNotification = async (type) => {
  try {
    const response = await API.post("/admin/notifications/dispatch", { type });
    return response.data;
  } catch (error) {
    console.error("apiDispatchAdminNotification error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Dispatch targeted application viewed notification to all candidates of a specific job/internship.
 */
export const apiDispatchApplicationViewedNotification = async (jobId, jobType = "Job") => {
  try {
    const response = await API.post("/admin/notifications/dispatch-application-viewed", {
      jobId,
      jobType,
    });
    return response.data;
  } catch (error) {
    console.error("apiDispatchApplicationViewedNotification error:", error);
    throw error.response?.data || error;
  }
};
