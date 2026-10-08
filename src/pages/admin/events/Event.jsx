import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicTable from "../../../common/DynamicTable";
import PageLoader from "../../../common/PageLoader";
import { getAllEvents } from '../../../services/admin/adminServices';
import { hasNewRegistrations, markItemAsSeen, setCategoryBadge, hasAnyUnreadInList } from '../../../utils/applicantTracker';
import { toast } from 'react-toastify';
import { useMain } from '../../../context/MainContext';
import { useTitle } from '../../../context/AdminTitle';

const TABS = [
  { label: "Community", value: "community" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const Event = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("community");
  const { user, dynamicPath } = useMain();
  const { setTitle } = useTitle();

  useEffect(() => { setTitle("Events"); }, []);

  useEffect(() => {
    fetchEvents(activeTab);
  }, [activeTab]);

  const fetchEvents = async (status) => {
    try {
      setIsLoading(true);
      const response = await getAllEvents(status);
      if (response.success) {
        const rawList = response.data || [];
        const mapped = rawList.map((item) => ({
          ...item,
          isNewRegistration: hasNewRegistrations(item._id || item.id, item.registeredCount || 0),
        }));
        setEvents(mapped);
        setCategoryBadge("events", hasAnyUnreadInList(mapped, ["registeredCount"]));
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("An error occurred while fetching events");
    } finally {
      setIsLoading(false);
    }
  };

  // Re-check seen status when notification storage updates
  useEffect(() => {
    const handleSync = () => {
      setEvents((prev) => {
        const updated = prev.map((item) => ({
          ...item,
          isNewRegistration: hasNewRegistrations(item._id || item.id, item.registeredCount || 0),
        }));
        setCategoryBadge("events", hasAnyUnreadInList(updated, ["registeredCount"]));
        return updated;
      });
    };
    window.addEventListener("nulinz_seen_updated", handleSync);
    return () => window.removeEventListener("nulinz_seen_updated", handleSync);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearch('');
  };

  const columns = [
    {
      title: '#',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
      key: 'index'
    },
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <p className="max-w-[150px] truncate" title={text}>{text}</p>
          {record?.isNewRegistration && (
            <span className="relative flex h-2 w-2 flex-shrink-0" title="New registration arrived">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
          )}
        </div>
      )
    },
    { title: 'Type', dataIndex: 'eventType', key: 'eventType' },
    { title: 'Organizer', dataIndex: 'organizer', key: 'organizer' },
    {
      title: 'Date',
      dataIndex: 'eventDate',
      key: 'eventDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    { title: 'Mode', dataIndex: 'mode', key: 'mode' },
    { title: 'Reg Type', dataIndex: 'registrationType', key: 'registrationType' },
    {
      title: 'Fees',
      dataIndex: 'individualFees',
      key: 'individualFees',
      render: (fees) => `₹${fees || 0}`
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value) => {
        const isActive = value === true;
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'
            }`}>
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    }
  ];

  const filteredData = events.filter(item =>
    (item.eventName?.toLowerCase().includes(search.toLowerCase())) ||
    (item.organizer?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">

      {/* Tabs */}
      <div className="flex items-center gap-5 px-4 pt-4 pb-2">
        {
          user.role === "admin" &&
          TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === tab.value
                  ? 'bg-[#171717] text-white shadow'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              {tab.label}
            </button>
          ))
        }
      </div>

      <DynamicTable
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        onRowClick={(record) => {
          markItemAsSeen(record._id || record.id, record.registeredCount || 0);
          navigate(dynamicPath(`event-profile/${record._id}`));
        }}
        showSearch={true}
        searchPlaceholder="Search ..."
        onSearch={handleSearch}
        showAddButton={true}
        addButtonLabel="Add Event"
        addButtonIcon={<Plus size={18} />}
        onAdd={() => navigate(dynamicPath("events-form"))}
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Event;