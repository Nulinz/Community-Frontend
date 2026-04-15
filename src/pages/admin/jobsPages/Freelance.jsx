import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { useNavigate } from 'react-router-dom';
import { freelanceFormVariant } from '../../../utils/profileFormConfigs';


const Freelance = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();


    const columns = [
        { title: '#', dataIndex: 'id', key: 'id' },
        { title: 'Project Title', dataIndex: 'projectTitle', key: 'projectTitle' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
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

    const freelanceData = [
        { id: '01', projectTitle: 'Network Engineer', category: 'Architecture', mode: 'Hybrid', salary: 'Rs 7000', duration: '3 Months', applied: '250', deadline: '15/01/2027', status: 'inactive' },
        { id: '02', projectTitle: 'Help Desk Analyst', category: 'Management', mode: 'Remote', salary: 'Rs 4000', duration: '6 Months', applied: '300', deadline: '20/01/2027', status: 'active' },
        { id: '03', projectTitle: 'Security Engineer', category: 'Data Science', mode: 'Remote', salary: 'Rs 8000', duration: '3 Months', applied: '80', deadline: '28/01/2027', status: 'inactive' },
        { id: '04', projectTitle: 'IT Manager', category: 'Design', mode: 'On site', salary: 'Rs 9000', duration: '3 Months', applied: '200', deadline: '15/02/2027', status: 'inactive' },
        { id: '05', projectTitle: 'Tech Support', category: 'Data Science', mode: 'Remote', salary: 'Rs 5000', duration: '6 Months', applied: '500', deadline: '20/02/2027', status: 'inactive' },
        { id: '06', projectTitle: 'System Admin', category: 'Web Dev', mode: 'Remote', salary: 'Rs 6000', duration: '3 Months', applied: '150', deadline: '10/03/2027', status: 'inactive' },
        { id: '07', projectTitle: 'IT Consultant', category: 'Mobile Dev', mode: 'On site', salary: 'Rs 7000', duration: '3 Months', applied: '180', deadline: '25/03/2027', status: 'active' },
        { id: '08', projectTitle: 'Data Security Analyst', category: 'Cloud', mode: 'On site', salary: 'Rs 8000', duration: '3 Months', applied: '220', deadline: '05/04/2027', status: 'inactive' },
        { id: '09', projectTitle: 'Cloud Security Engineer', category: 'Data Science', mode: 'On site', salary: 'Rs 9000', duration: '3 Months', applied: '130', deadline: '20/04/2027', status: 'active' },
        { id: '10', projectTitle: 'Network Security Engineer', category: 'Data Science', mode: 'Remote', salary: 'Rs 6000', duration: '6 Months', applied: '250', deadline: '10/05/2027', status: 'inactive' },
        { id: '11', projectTitle: 'UI Security Consultant', category: 'Design', mode: 'Hybrid', salary: 'Rs 6500', duration: '3 Months', applied: '140', deadline: '20/05/2027', status: 'active' },
    ];

    const filteredData = freelanceData.filter(
        (item) =>
            item.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
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
                rowKey="id"
                showSearch={true}
                searchPlaceholder="Search ..."
                onSearch={handleSearch}
                showAddButton={true}
                addButtonLabel="Add Freelance"
                addButtonIcon={<Plus size={18} />}
                onAdd={() =>
                    navigate('/admin/jobs/add-form', {
                        state: { formType: 'freelance', formVariant: freelanceFormVariant },
                    })
                }
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={() => navigate('/admin/jobs/freelance-profile')}

            />
        </div>
    );
};

export default Freelance;
