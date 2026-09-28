import React, { useState, useEffect, useCallback } from 'react';
import { Users, CheckCircle2, XCircle, Award, RefreshCw, Check, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import AppliedListSection from '../common/AppliedListSection';
import GenerateCertificateModal from './GenerateCertificateModal';
import { downloadCSVFromAPI } from '../utils/exportUtils';
import PageLoader from '../common/PageLoader';

/**
 * AttendanceTabSection displays the real-time check-in and attendance metrics
 * for Conferences, Events, Seminars, and Competitions.
 * Supports viewing present attendees or all registrants, real-time manual refresh,
 * direct manual attendance toggling for walk-ins/assisted check-in, and CSV export.
 */
const AttendanceTabSection = ({ eventId, eventType = "Event", eventTitle = "", organizerName = "" }) => {
  const [attendees, setAttendees] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [viewFilter, setViewFilter] = useState('present'); // 'present' | 'all'
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: "0",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchAttendanceData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await API.get(
        `/users/attendance/stats/${eventId}?eventType=${encodeURIComponent(eventType)}`
      );

      if (response.data?.success) {
        const data = response.data.data;
        setStats(data.stats || {
          totalRegistered: 0,
          totalPresent: 0,
          totalAbsent: 0,
          attendanceRate: "0",
        });
        setAttendees(data.attendees || []);
        setAllRegistrations(data.allRegistrations || data.attendees || []);

        if (isManualRefresh) {
          toast.success("Attendance records refreshed!");
        }
      } else {
        toast.error("Failed to load attendance records.");
      }
    } catch (err) {
      console.error("Fetch Attendance Error:", err);
      toast.error(err.response?.data?.message || "Failed to load attendance.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [eventId, eventType]);

  useEffect(() => {
    if (eventId) {
      fetchAttendanceData();
    }
  }, [eventId, eventType, fetchAttendanceData]);

  // Handle manual attendance toggle from organizer interface
  const handleToggleAttendance = async (record) => {
    const regId = record.id || record._id;
    if (!regId) return;

    try {
      setTogglingId(regId);
      const isCurrentlyPresent = String(record.attendanceStatus || "").toLowerCase() === "present";
      const nextStatus = isCurrentlyPresent ? "absent" : "present";

      const res = await API.patch(`/users/attendance/toggle-status/${regId}`, {
        status: nextStatus,
      });

      if (res.data?.success) {
        toast.success(res.data.message || `Attendance updated to ${nextStatus === "present" ? "Present" : "Absent"}`);
        await fetchAttendanceData();
      } else {
        toast.error(res.data?.message || "Failed to update attendance.");
      }
    } catch (err) {
      console.error("Toggle Attendance Error:", err);
      toast.error(err.response?.data?.message || "Failed to toggle attendance status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenCertificateModal = (attendee) => {
    setSelectedCandidate(attendee);
    setIsCertModalOpen(true);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const attendanceColumns = [
    { title: '#', dataIndex: 'sNo', key: 'sNo' },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'College', dataIndex: 'collegeName', key: 'collegeName' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    {
      title: 'Status',
      dataIndex: 'attendanceStatus',
      key: 'attendanceStatus',
      render: (status) => {
        const isPresent = String(status || "").toLowerCase() === "present";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
              isPresent
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
            {isPresent ? 'Present' : 'Absent'}
          </span>
        );
      },
    },
    { title: 'Check-in Time', dataIndex: 'attendedAtFormatted', key: 'attendedAtFormatted' },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        const isPresent = String(record.attendanceStatus || "").toLowerCase() === "present";
        const isCurrentToggling = togglingId === (record.id || record._id);

        return (
          <div className="flex items-center gap-2">
            {isPresent ? (
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  handleOpenCertificateModal(record);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#171717] text-white hover:bg-black rounded-full text-xs font-semibold shadow-xs transition cursor-pointer"
                title="Generate Participation Certificate"
              >
                <Award size={13} /> Certificate
              </button>
            ) : null}

            <button
              onClick={(e) => {
                e?.stopPropagation();
                handleToggleAttendance(record);
              }}
              disabled={isCurrentToggling}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                isPresent
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  : 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              } disabled:opacity-50`}
              title={isPresent ? "Mark as Absent" : "Mark as Present"}
            >
              <Check size={12} />
              {isCurrentToggling ? "Updating..." : isPresent ? "Mark Absent" : "Mark Present"}
            </button>
          </div>
        );
      },
    },
  ];

  const currentDataset = viewFilter === 'all' ? allRegistrations : attendees;

  const formattedAttendanceData = currentDataset.map((item, index) => ({
    ...item,
    sNo: String(index + 1).padStart(2, '0'),
    name: item.fullName || item.name || "N/A",
    college: item.collegeName || item.college || "N/A",
    attendedAtFormatted: formatDateTime(item.attendedAt),
  }));

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Metric Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Attendance Records</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time QR check-in status and verified attendee list.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Filter Pill Buttons */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewFilter('present')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewFilter === 'present'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Present ({stats.totalPresent})
            </button>
            <button
              type="button"
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({stats.totalRegistered})
            </button>
          </div>

          {/* Real-time Refresh Button */}
          <button
            type="button"
            onClick={() => fetchAttendanceData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold rounded-xl shadow-xs transition hover:bg-gray-50 cursor-pointer disabled:opacity-60"
            title="Refresh Attendance Records"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-gray-900" : "text-gray-600"} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#171717] flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Registered</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalRegistered}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Present Count</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">
              {stats.totalPresent}{" "}
              <span className="text-xs text-emerald-600 font-semibold ml-1">
                ({stats.attendanceRate}%)
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent Count</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-0.5">{stats.totalAbsent}</h3>
          </div>
        </div>
      </div>

      {/* Attendee Table with Filters & CSV Export */}
      <AppliedListSection
        data={formattedAttendanceData}
        heading={attendanceColumns}
        showExportButton={true}
        onExport={() =>
          downloadCSVFromAPI(
            `/users/export/event-attendance/${eventId}?eventType=${encodeURIComponent(eventType)}`,
            `${(eventTitle || eventType).replace(/[^a-zA-Z0-9]/g, "_")}_Attendance.csv`
          )
        }
      />

      {/* Certificate Generation Modal */}
      <GenerateCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        candidate={selectedCandidate}
        defaultDomain={eventTitle || `${eventType} Participation`}
        organizerName={organizerName}
        eventId={eventId}
        eventType={eventType}
      />
    </div>
  );
};

export default AttendanceTabSection;
