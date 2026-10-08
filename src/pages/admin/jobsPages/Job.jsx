import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllJobs } from '../../../services/admin/adminServices';
import { hasNewRegistrations, markItemAsSeen, setCategoryBadge, hasAnyUnreadInList } from '../../../utils/applicantTracker';
import { useTitle } from '../../../context/AdminTitle';
import { useMain } from '../../../context/MainContext';

const TABS = [
    { label: "Community", value: "community" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const Job = ({ module = 'admin' }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("community");
    const navigate = useNavigate();
    const { setTitle } = useTitle();
    const { user } = useMain();

    useEffect(() => { setTitle("Jobs / Hiring"); }, [setTitle]);

    useEffect(() => {
        fetchJobs(activeTab);
    }, [activeTab]);

    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-GB');
    };

    const fetchJobs = async (status) => {
        try {
            setIsLoading(true);
            const response = await getAllJobs(status);
            const rawList = response?.data || [];
            const mappedData = rawList.map((item) => ({
                ...item,
                id: item?._id,
                company: item?.companyName || '-',
                date: formatDate(item?.applicationDeadline || item?.createdAt),
                jobType: item?.jobType || item?.jobCategory || 'Full Time',
                salary: item?.salary ? `Rs ${item.salary}` : 'Rs 0',
                location: item?.location || '-',
                applied: item?.appliedCount || 0,
                status: item?.isActive ? 'active' : 'inactive',
                isNewApplicant: hasNewRegistrations(item?._id, item?.appliedCount || 0),
            }));
            setJobs(mappedData);
            setCategoryBadge("jobs", hasAnyUnreadInList(mappedData, ["appliedCount", "applied"]));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch jobs');
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Re-check seen status when notification storage updates
    useEffect(() => {
        const handleSync = () => {
            setJobs((prevJobs) => {
                const updated = prevJobs.map((j) => ({
                    ...j,
                    isNewApplicant: hasNewRegistrations(j.id || j._id, j.applied || j.appliedCount || 0),
                }));
                setCategoryBadge("jobs", hasAnyUnreadInList(updated, ["appliedCount", "applied"]));
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
            dataIndex: 'index',
            key: 'index',
            render: (_text, _record, index) => (currentPage - 1) * 10 + index + 1
        },
        {
            title: 'Job Title',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text, record) => (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#101828]">{text}</span>
                    {record.isNewApplicant && (
                        <span className="relative flex h-2 w-2 flex-shrink-0" title="New applicant arrived">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                    )}
                </div>
            )
        },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Job Type', dataIndex: 'jobType', key: 'jobType' },
        { title: 'Salary', dataIndex: 'salary', key: 'salary' },
        { title: 'Applied', dataIndex: 'applied', key: 'applied' },
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

    const filteredData = jobs.filter(
        (item) =>
            (item.jobTitle || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.company || '').toLowerCase().includes(search.toLowerCase())
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
                loading={isLoading}
                showSearch={true}
                searchPlaceholder="Search jobs..."
                onSearch={handleSearch}
                showAddButton={true}
                addButtonLabel="Add Job"
                addButtonIcon={<Plus size={18} />}
                onAdd={() => navigate(`/${module}/jobs/job-form`)}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={(record) => {
                    markItemAsSeen(record._id || record.id, record.applied || record.appliedCount || 0);
                    navigate(`/${module}/jobs/job-profile/${record._id}`);
                }}
            />
        </div>
    );
};

export default Job;
