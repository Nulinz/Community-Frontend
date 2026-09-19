/**
 * Shared Date and Time Validation Utility
 *
 * Provides timezone-safe date parsing, mathematical time comparison,
 * and unified real-time & defensive validation across all event and
 * opportunity forms (Event, Competition, Conference, Seminar,
 * Internship, Job, and Freelance forms).
 */
import { toast } from "react-toastify";

/**
 * Returns today's date formatted as "YYYY-MM-DD" in local time.
 * Avoids UTC timezone conversion offsets commonly produced by toISOString().
 */
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Converts "HH:mm" 24-hour time string into total minutes since midnight.
 * Allows direct mathematical comparison between start and end times.
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

/**
 * Validates dynamic schedule rows ensuring end time is strictly after start time.
 */
export const validateScheduleRows = (schedule, label = "Schedule") => {
  if (!Array.isArray(schedule) || schedule.length === 0) return true;
  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];
    if (row?.startTime && row?.endTime) {
      const rowStart = timeToMinutes(row.startTime);
      const rowEnd = timeToMinutes(row.endTime);
      if (rowStart !== null && rowEnd !== null && rowEnd <= rowStart) {
        toast.error(`${label} (Row ${i + 1}): End time must be after start time`);
        return false;
      }
    }
  }
  return true;
};

/**
 * Real-time validation handler for event-based forms
 * (EventForm, CompetitionForm, ConferenceForm, SeminarForm).
 *
 * Checks date bounds against today, ensures registration precedes event dates,
 * and validates that start time is before end time.
 * Returns an override object to clear invalid fields immediately, or null if valid.
 */
export const validateEventFieldChange = (
  fieldName,
  value,
  currentData,
  isEdit = false,
  hasEndDate = false
) => {
  if (!value) return null;
  const todayStr = getTodayDateString();

  // ── Event Start Date ──────────────────────────────────────────
  if (fieldName === "eventDate") {
    if (!isEdit && value < todayStr) {
      toast.error("Event date cannot be in the past");
      return { eventDate: "" };
    }
    if (hasEndDate && currentData.eventEndDate && value > currentData.eventEndDate) {
      toast.error("Event date cannot be later than event end date");
      return { eventDate: "" };
    }
    if (currentData.registrationEndDate && value < currentData.registrationEndDate) {
      toast.error("Event date cannot be earlier than registration end date");
      return { eventDate: "" };
    }
    if (currentData.registrationStartDate && value < currentData.registrationStartDate) {
      toast.error("Event date cannot be earlier than registration start date");
      return { eventDate: "" };
    }
  }

  // ── Event End Date (multi-day events like Competitions) ───────
  if (fieldName === "eventEndDate") {
    if (!isEdit && value < todayStr) {
      toast.error("Event end date cannot be in the past");
      return { eventEndDate: "" };
    }
    if (currentData.eventDate && value < currentData.eventDate) {
      toast.error("Event end date cannot be earlier than event start date");
      return { eventEndDate: "" };
    }
    if (currentData.registrationEndDate && value < currentData.registrationEndDate) {
      toast.error("Event end date cannot be earlier than registration end date");
      return { eventEndDate: "" };
    }
  }

  // ── Registration Start Date ───────────────────────────────────
  if (fieldName === "registrationStartDate") {
    if (currentData.registrationEndDate && value > currentData.registrationEndDate) {
      toast.error("Registration start date cannot be after registration end date");
      return { registrationStartDate: "" };
    }
    if (currentData.eventDate && value > currentData.eventDate) {
      toast.error("Registration start date cannot be after the event start date");
      return { registrationStartDate: "" };
    }
  }

  // ── Registration End Date ─────────────────────────────────────
  if (fieldName === "registrationEndDate") {
    if (currentData.registrationStartDate && value < currentData.registrationStartDate) {
      toast.error("Registration end date cannot be earlier than registration start date");
      return { registrationEndDate: "" };
    }
    if (currentData.eventDate && value > currentData.eventDate) {
      toast.error("Registration end date cannot be after the event start date");
      return { registrationEndDate: "" };
    }
  }

  // ── Event Start Time ──────────────────────────────────────────
  if (fieldName === "eventStartTime") {
    const isSameDay = !hasEndDate || !currentData.eventEndDate || currentData.eventEndDate === currentData.eventDate;
    if (isSameDay && currentData.eventEndTime) {
      const startMins = timeToMinutes(value);
      const endMins = timeToMinutes(currentData.eventEndTime);
      if (startMins !== null && endMins !== null && startMins >= endMins) {
        toast.error("Event start time must be before event end time");
        return { eventStartTime: "" };
      }
    }
  }

  // ── Event End Time ────────────────────────────────────────────
  if (fieldName === "eventEndTime") {
    const isSameDay = !hasEndDate || !currentData.eventEndDate || currentData.eventEndDate === currentData.eventDate;
    if (isSameDay && currentData.eventStartTime) {
      const startMins = timeToMinutes(currentData.eventStartTime);
      const endMins = timeToMinutes(value);
      if (startMins !== null && endMins !== null && endMins <= startMins) {
        toast.error("Event end time must be after event start time");
        return { eventEndTime: "" };
      }
    }
  }

  return null;
};

/**
 * Defensive submission validator for event-based forms.
 */
export const validateEventSubmission = (
  payload,
  isEdit = false,
  hasEndDate = false,
  scheduleLabel = "Schedule"
) => {
  if (!payload) return true;
  const {
    eventDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    registrationStartDate,
    registrationEndDate,
    schedule,
  } = payload;

  const todayStr = getTodayDateString();

  if (!isEdit && eventDate && eventDate < todayStr) {
    toast.error("Event date cannot be in the past");
    return false;
  }

  if (hasEndDate && eventEndDate) {
    if (!isEdit && eventEndDate < todayStr) {
      toast.error("Event end date cannot be in the past");
      return false;
    }
    if (eventDate && eventEndDate < eventDate) {
      toast.error("Event end date cannot be earlier than event start date");
      return false;
    }
  }

  if (registrationStartDate && registrationEndDate && registrationStartDate > registrationEndDate) {
    toast.error("Registration start date cannot be after registration end date");
    return false;
  }

  if (registrationEndDate && eventDate && registrationEndDate > eventDate) {
    toast.error("Registration end date cannot be after the event start date");
    return false;
  }

  if (registrationStartDate && eventDate && registrationStartDate > eventDate) {
    toast.error("Registration start date cannot be after the event start date");
    return false;
  }

  const isSameDay = !hasEndDate || !eventEndDate || eventEndDate === eventDate;
  if (isSameDay && eventStartTime && eventEndTime) {
    const startMins = timeToMinutes(eventStartTime);
    const endMins = timeToMinutes(eventEndTime);
    if (startMins !== null && endMins !== null && endMins <= startMins) {
      toast.error("Event end time must be after event start time");
      return false;
    }
  }

  if (!validateScheduleRows(schedule, scheduleLabel)) {
    return false;
  }

  return true;
};

/**
 * Real-time validation handler for opportunity and job forms
 * (InternshipForm and JobForm).
 *
 * Validates application deadline and start date chronologies.
 */
export const validateOpportunityFieldChange = (
  fieldName,
  value,
  currentData,
  isEdit = false,
  options = {
    startDateField: "internStartDate",
    startLabel: "Internship start date",
    deadlineLabel: "Application deadline",
  }
) => {
  if (!value) return null;
  const todayStr = getTodayDateString();
  const { startDateField, startLabel, deadlineLabel } = options;

  if (fieldName === "applicationDeadline") {
    if (!isEdit && value < todayStr) {
      toast.error(`${deadlineLabel} cannot be in the past`);
      return { applicationDeadline: "" };
    }
    const currentStart = currentData[startDateField];
    if (currentStart && value > currentStart) {
      toast.error(`${deadlineLabel} cannot be after ${startLabel.toLowerCase()}`);
      return { applicationDeadline: "" };
    }
  }

  if (fieldName === startDateField) {
    if (!isEdit && value < todayStr) {
      toast.error(`${startLabel} cannot be in the past`);
      return { [startDateField]: "" };
    }
    if (currentData.applicationDeadline && value < currentData.applicationDeadline) {
      toast.error(`${startLabel} cannot be earlier than ${deadlineLabel.toLowerCase()}`);
      return { [startDateField]: "" };
    }
  }

  return null;
};

/**
 * Defensive submission validator for opportunity and job forms.
 */
export const validateOpportunitySubmission = (
  payload,
  isEdit = false,
  options = {
    startDateField: "internStartDate",
    startLabel: "Internship start date",
    deadlineLabel: "Application deadline",
  }
) => {
  if (!payload) return true;
  const todayStr = getTodayDateString();
  const { startDateField, startLabel, deadlineLabel } = options;
  const applicationDeadline = payload.applicationDeadline;
  const startDate = payload[startDateField];

  if (!isEdit && applicationDeadline && applicationDeadline < todayStr) {
    toast.error(`${deadlineLabel} cannot be in the past`);
    return false;
  }

  if (!isEdit && startDate && startDate < todayStr) {
    toast.error(`${startLabel} cannot be in the past`);
    return false;
  }

  if (applicationDeadline && startDate && applicationDeadline > startDate) {
    toast.error(`${deadlineLabel} cannot be after ${startLabel.toLowerCase()}`);
    return false;
  }

  return true;
};

/**
 * Real-time validation handler for Freelance project forms.
 *
 * Validates applicationDeadline, jobStartDate (Expected Timeline),
 * and jobEndDate (Deadline).
 */
export const validateFreelanceFieldChange = (
  fieldName,
  value,
  currentData,
  isEdit = false
) => {
  if (!value) return null;
  const todayStr = getTodayDateString();

  if (fieldName === "applicationDeadline") {
    if (!isEdit && value < todayStr) {
      toast.error("Application deadline cannot be in the past");
      return { applicationDeadline: "" };
    }
    if (currentData.jobStartDate && value > currentData.jobStartDate) {
      toast.error("Application deadline cannot be after expected timeline");
      return { applicationDeadline: "" };
    }
    if (currentData.jobEndDate && value > currentData.jobEndDate) {
      toast.error("Application deadline cannot be after project deadline");
      return { applicationDeadline: "" };
    }
  }

  if (fieldName === "jobStartDate") {
    if (!isEdit && value < todayStr) {
      toast.error("Expected timeline cannot be in the past");
      return { jobStartDate: "" };
    }
    if (currentData.applicationDeadline && value < currentData.applicationDeadline) {
      toast.error("Expected timeline cannot be earlier than application deadline");
      return { jobStartDate: "" };
    }
    if (currentData.jobEndDate && value > currentData.jobEndDate) {
      toast.error("Expected timeline cannot be after project deadline");
      return { jobStartDate: "" };
    }
  }

  if (fieldName === "jobEndDate") {
    if (!isEdit && value < todayStr) {
      toast.error("Project deadline cannot be in the past");
      return { jobEndDate: "" };
    }
    if (currentData.jobStartDate && value < currentData.jobStartDate) {
      toast.error("Project deadline cannot be earlier than expected timeline");
      return { jobEndDate: "" };
    }
    if (currentData.applicationDeadline && value < currentData.applicationDeadline) {
      toast.error("Project deadline cannot be earlier than application deadline");
      return { jobEndDate: "" };
    }
  }

  return null;
};

/**
 * Defensive submission validator for Freelance project listings.
 */
export const validateFreelanceSubmission = (payload, isEdit = false) => {
  if (!payload) return true;
  const todayStr = getTodayDateString();
  const { applicationDeadline, jobStartDate, jobEndDate } = payload;

  if (!isEdit && applicationDeadline && applicationDeadline < todayStr) {
    toast.error("Application deadline cannot be in the past");
    return false;
  }

  if (!isEdit && jobStartDate && jobStartDate < todayStr) {
    toast.error("Expected timeline cannot be in the past");
    return false;
  }

  if (!isEdit && jobEndDate && jobEndDate < todayStr) {
    toast.error("Project deadline cannot be in the past");
    return false;
  }

  if (applicationDeadline && jobStartDate && applicationDeadline > jobStartDate) {
    toast.error("Application deadline cannot be after expected timeline");
    return false;
  }

  if (jobStartDate && jobEndDate && jobStartDate > jobEndDate) {
    toast.error("Expected timeline cannot be after project deadline");
    return false;
  }

  if (applicationDeadline && jobEndDate && applicationDeadline > jobEndDate) {
    toast.error("Application deadline cannot be after project deadline");
    return false;
  }

  return true;
};
