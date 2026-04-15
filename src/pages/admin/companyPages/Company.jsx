import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { companyFormVariant } from '../../../utils/profileFormConfigs';

const Company = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Sample data matching your screenshot
    const companies = [
        { id: '01', name: 'Solaris Energy', industry: 'Renewable Energy', contact: 'Kavita', mobile: '9223344556', mail: 'contact@solarisenergy.com', location: 'Jaipur', status: 'active' },
        { id: '02', name: 'GreenTech Solutions', industry: 'Environmental', contact: 'Maya', mobile: '9876543210', mail: 'contact@greentech.com', location: 'Chennai', status: 'active' },
        { id: '03', name: 'EduSmart', industry: 'Education', contact: 'Ravi', mobile: '9123456789', mail: 'info@edusmart.edu', location: 'Bangalore', status: 'inactive' },
        { id: '04', name: 'HealthPlus', industry: 'Healthcare', contact: 'Anjali', mobile: '9988776655', mail: 'support@healthplus.com', location: 'Hyderabad', status: 'active' },
        { id: '05', name: 'FinServe', industry: 'Finance', contact: 'Suresh', mobile: '9001234567', mail: 'hello@finserve.com', location: 'Mumbai', status: 'inactive' },
    ];

    const filteredRows = companies.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const columns = [
        { title: '#', dataIndex: 'id', key: 'id' },
        { title: 'Company Name', dataIndex: 'name', key: 'name' },
        { title: 'Industry', dataIndex: 'industry', key: 'industry' },
        { title: 'Contact Person', dataIndex: 'contact', key: 'contact' },
        { title: 'Mobile Number', dataIndex: 'mobile', key: 'mobile' },
        { title: 'Mail Id', dataIndex: 'mail', key: 'mail' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                const isActive = String(value).toLowerCase() === 'active';
                return (
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[14px] font-semibold ${isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}
                    >
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        }
    ];

    return (
        <div className="animate-in fade-in duration-500">

            <DynamicTable
                columns={columns}
                dataSource={filteredRows}
                rowKey="id"
                showSearch={true}
                onSearch={handleSearch}
                searchPlaceholder="Search ..."
                showAddButton={true}
                addButtonLabel="Add company"
                addButtonIcon={<Plus size={18} />}
                onAdd={() =>
                    navigate('/admin/add-form', {
                        state: { formType: 'company', formVariant: companyFormVariant },
                    })
                }
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                onRowClick={() => navigate('/admin/company-profile')}
            />
        </div>
    );
};



export default Company;
