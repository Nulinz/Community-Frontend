import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllFreelances } from '../../../services/admin/adminServices';


const Freelance = ({ module = 'admin' }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [freelances, setFreelances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFreelances();
    }, []);

    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-GB');
    };

    const fetchFreelances = async () => {
        try {
            setIsLoading(true);
            const response = await getAllFreelances();
            const mappedData = (response?.data || []).map((item) => ({
                ...item,
                id: item?._id,
                projectTitle: item?.jobTitle || '-',
                category: item?.companyName || '-',
                mode: item?.mode || '-',
                salary: item?.salary ? `Rs ${item.salary}` : 'Rs 0',
                duration: item?.duration || '-',
                applied: '-',
                deadline: formatDate(item?.applicationDeadline || item?.createdAt),
                status: item?.isActive ? 'active' : 'inactive',
            }));
            setFreelances(mappedData);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch freelances');
            setFreelances([]);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_text, _record, index) => index + 1
        },
        { title: 'Project Title', dataIndex: 'projectTitle', key: 'projectTitle' },
        { title: 'Organizer', dataIndex: 'category', key: 'category' },
        { title: 'Mode', dataIndex: 'mode', key: 'mode' },
        { title: 'Salary', dataIndex: 'salary', key: 'salary' },
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
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'
                            }`}
                    >
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
            (item.category || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    return (
        <div className="bg-[#F9FAFB] min-h-screen">
            <DynamicTable
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                loading={isLoading}
                showSearch={true}
                searchPlaceholder="Search ..."
                onSearch={handleSearch}
                showAddButton={true}
                addButtonLabel="Add Freelance"
                addButtonIcon={<Plus size={18} />}
                onAdd={() =>
                    navigate(`/${module}/jobs/freelance-form`)
                }
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={(record) => navigate(`/${module}/jobs/freelance-profile/${record._id}`)}

            />
        </div>
    );
};

export default Freelance;
