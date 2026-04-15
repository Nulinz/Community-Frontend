import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { internshipFormVariant } from '../../../utils/profileFormConfigs';

import { useNavigate } from 'react-router-dom';


const Internship = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();


    const columns = [
        { title: '#', dataIndex: 'id', key: 'id' },
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

    const internshipData = [
        { id: '01', jobTitle: 'AI Developer', company: 'Quantum Leap Technologies', date: '20/01/2027', jobType: 'Paid', salary: 'Rs 4000', location: 'Banglore', applied: '250', status: 'active' },
        { id: '02', jobTitle: 'Data Scientist', company: 'Binary Bridge Analytics', date: '10/02/2027', jobType: 'unpaid', salary: 'Rs 0', location: 'Chennai', applied: '300', status: 'active' },
        { id: '03', jobTitle: 'Software Architect', company: 'Apex Systems Guild', date: '28/02/2027', jobType: 'Paid', salary: 'Rs 5200', location: 'Mumbai', applied: '80', status: 'active' },
        { id: '04', jobTitle: 'Network Engineer', company: 'Synapse Infrastructure', date: '15/03/2027', jobType: 'unpaid', salary: 'Rs 2000', location: 'Delhi', applied: '200', status: 'inactive' },
        { id: '05', jobTitle: 'Database Admin', company: 'Oracle Tech Solutions', date: '30/03/2027', jobType: 'Paid', salary: 'Rs 4500', location: 'Kolkata', applied: '500', status: 'inactive' },
        { id: '06', jobTitle: 'Cloud Specialist', company: 'Amazon Cloud Services', date: '10/04/2027', jobType: 'unpaid', salary: 'Rs 3500', location: 'Hyderabad', applied: '150', status: 'inactive' },
        { id: '07', jobTitle: 'Frontend Developer', company: 'Google Development', date: '25/04/2027', jobType: 'Paid', salary: 'Rs 5000', location: 'Pune', applied: '180', status: 'active' },
        { id: '08', jobTitle: 'Backend Developer', company: 'Microsoft Dev', date: '05/05/2027', jobType: 'unpaid', salary: 'Rs 0', location: 'Banglore', applied: '220', status: 'inactive' },
        { id: '09', jobTitle: 'Mobile Developer', company: 'Apple Inc', date: '20/05/2027', jobType: 'Paid', salary: 'Rs 5800', location: 'Chennai', applied: '130', status: 'inactive' },
        { id: '10', jobTitle: 'Security Engineer', company: 'Tata Consultancy Services', date: '10/06/2027', jobType: 'Paid', salary: 'Rs 6200', location: 'Mumbai', applied: '250', status: 'active' },
        { id: '11', jobTitle: 'ML Intern', company: 'DeepCompute Labs', date: '20/06/2027', jobType: 'Paid', salary: 'Rs 5400', location: 'Coimbatore', applied: '170', status: 'active' },
    ];

    const filteredData = internshipData.filter(
        (item) =>
            item.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
            item.company.toLowerCase().includes(search.toLowerCase())
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
                addButtonLabel="Add Internship"
                addButtonIcon={<Plus size={18} />}
                onAdd={() =>
                    navigate('/admin/jobs/add-form', {
                        state: { formType: 'internship', formVariant: internshipFormVariant },
                    })
                }
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={() => navigate('/admin/jobs/internship-profile')}

            />
        </div>
    );
};

export default Internship;
