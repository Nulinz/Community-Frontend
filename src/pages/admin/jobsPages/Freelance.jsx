import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllFreelances } from '../../../services/admin/adminServices';
import { hasNewRegistrations, markItemAsSeen, setCategoryBadge, hasAnyUnreadInList } from '../../../utils/applicantTracker';
import { useTitle } from '../../../context/AdminTitle';
import { useMain } from '../../../context/MainContext';

const TABS = [
    { label: "Community", value: "community" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const Freelance = ({ module = 'admin' }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [freelances, setFreelances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("community");
    const { setTitle } = useTitle();
    const navigate = useNavigate();
    const { user, dynamicPath } = useMain();
    useEffect(() => { setTitle("Projects"); }, []);

    useEffect(() => {
        fetchFreelances(activeTab);
    }, [activeTab]);

    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-GB');
    };

    const formatBudget = (rawBudget, rawSalary) => {
        const val = rawBudget !== undefined && rawBudget !== null && String(rawBudget).trim() !== ""
            ? String(rawBudget).trim()
            : (rawSalary !== undefined && rawSalary !== null && String(rawSalary).trim() !== "" && String(rawSalary).trim() !== "0"
                ? String(rawSalary).trim()
                : "");

        if (!val || val === "0") return "-";

        // Keep currency symbol if already formatted
        if (/^(?:rs\.?|inr|₹)/i.test(val)) {
            return val;
        }

        const numeric = parseFloat(val.replace(/[^0-9.]/g, ''));
        if (!isNaN(numeric)) {
            return `Rs ${numeric.toLocaleString('en-IN')}`;
        }

        return `Rs ${val}`;
    };

    const fetchFreelances = async (status) => {
        try {
            setIsLoading(true);
            const response = await getAllFreelances(status);
            const isAdmin = user?.role === "admin";
            const mappedData = (response?.data || []).map((item) => {
                const formattedBudget = formatBudget(item?.budget, item?.salary);
                return {
                    ...item,
                    id: item?._id,
                    projectTitle: item?.jobTitle || '-',
                    category: item?.companyName || '-',
                    mode: item?.mode || '-',
                    budget: formattedBudget,
                    salary: formattedBudget,
                    duration: item?.duration || '-',
                    applied: item?.appliedCount ?? 0,
                    deadline: formatDate(item?.applicationDeadline || item?.createdAt),
                    status: item?.isActive ? 'active' : 'inactive',
                    isNewApplicant: isAdmin && hasNewRegistrations(item?._id, item?.appliedCount || 0),
                };
            });
            setFreelances(mappedData);
            if (isAdmin) {
                setCategoryBadge("freelance", hasAnyUnreadInList(mappedData, ["appliedCount", "applied"]));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch projects');
            setFreelances([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Re-check seen status when notification storage updates (Admin only for Envy)
    useEffect(() => {
        const handleSync = () => {
            if (user?.role !== "admin") return;
            setFreelances((prev) => {
                const updated = prev.map((item) => ({
                    ...item,
                    isNewApplicant: hasNewRegistrations(item.id || item._id, item.applied || item.appliedCount || 0),
                }));
                setCategoryBadge("freelance", hasAnyUnreadInList(updated, ["appliedCount", "applied"]));
                return updated;
            });
        };
        window.addEventListener("nulinz_seen_updated", handleSync);
        return () => window.removeEventListener("nulinz_seen_updated", handleSync);
    }, [user?.role]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setCurrentPage(1);
        setSearch('');
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_text, _record, index) => (currentPage - 1) * 10 + index + 1
        },
        {
            title: 'Project Title',
            dataIndex: 'projectTitle',
            key: 'projectTitle',
            render: (text, record) => (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#101828]">{text}</span>
                    {user?.role === "admin" && record.isNewApplicant && (
                        <span className="relative flex h-2 w-2 flex-shrink-0" title="New applicant arrived">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                    )}
                </div>
            )
        },
        { title: 'Organizer', dataIndex: 'category', key: 'category' },
        // { title: 'Mode', dataIndex: 'mode', key: 'mode' },
        { title: 'Budget', dataIndex: 'budget', key: 'budget' },
        { title: 'Duration', dataIndex: 'duration', key: 'duration' },
        { title: 'Applied', dataIndex: 'applied', key: 'applied' },
        { title: 'Deadline', dataIndex: 'deadline', key: 'deadline' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                const isActive = String(value).toLowerCase() === 'active';
                return (
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
    ];

    const filteredData = freelances.filter(
        (item) =>
            (item.projectTitle || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.category || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.budget || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

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
                                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-blue-50 hover:text-[#171717]'
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
                loading={isLoading}
                showSearch={true}
                searchPlaceholder="Search ..."
                onSearch={handleSearch}
                showAddButton={true}
                addButtonLabel="Add Projects"
                addButtonIcon={<Plus size={18} />}
                onAdd={() => navigate(`/${module}/jobs/freelance-form`)}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={(record) => {
                    if (user?.role === "admin") {
                        markItemAsSeen(record._id || record.id, record.applied || record.appliedCount || 0);
                    }
                    navigate(`/${module}/jobs/freelance-profile/${record._id}`);
                }}
            />
        </div>
    );
};

export default Freelance;