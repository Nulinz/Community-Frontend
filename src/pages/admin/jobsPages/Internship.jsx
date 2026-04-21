import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllInternships } from '../../../services/admin/adminServices';


const Internship = ({ module = 'admin' }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [internships, setInternships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchInternships();
    }, []);

    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-GB');
    };

    const fetchInternships = async () => {
        try {
            setIsLoading(true);
            const response = await getAllInternships();
            const mappedData = (response?.data || []).map((item) => ({
                ...item,
                id: item?._id,
                company: item?.companyName || '-',
                date: formatDate(item?.applicationDeadline || item?.createdAt),
                jobType: item?.internshipType || '-',
                salary: item?.salary ? `Rs ${item.salary}` : 'Rs 0',
                location: item?.location || '-',
                applied: '-',
                status: item?.isActive ? 'active' : 'inactive',
            }));
            setInternships(mappedData);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch internships');
            setInternships([]);
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
        { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
        { title: 'Company', dataIndex: 'company', key: 'company' },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Job Type', dataIndex: 'jobType', key: 'jobType' },
        { title: 'Salary', dataIndex: 'salary', key: 'salary' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        { title: 'Applied', dataIndex: 'applied', key: 'applied' },
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

    const filteredData = internships.filter(
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
            <DynamicTable
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                loading={isLoading}
                showSearch={true}
                searchPlaceholder="Search ..."
                onSearch={handleSearch}
                showAddButton={true}
                addButtonLabel="Add Internship"
                addButtonIcon={<Plus size={18} />}
                onAdd={() =>
                    navigate(`/${module}/jobs/internship-form`)
                }
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={(record) => navigate(`/${module}/jobs/internship-profile/${record._id}`)}
            />
        </div>
    );
};




export default Internship;
