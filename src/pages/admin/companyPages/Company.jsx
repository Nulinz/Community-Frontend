import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import { getAllCpmpanies } from '../../../services/admin/adminServices';

const Company = ({ module }) => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCpmpanies();
            if (response.success) {
                const mappedData = (response.data || []).map(item => ({
                    ...item,
                    id: item._id
                }));
                setCompanies(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch companies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const filteredRows = companies.filter((item) =>
        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.contactPersonName.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { 
            title: '#', 
            dataIndex: 'index', 
            key: 'index',
            render: (_text, _record, index) => index + 1
        },
        { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
        { title: 'Industry', dataIndex: 'companyType', key: 'companyType' },
        { title: 'Contact Person', dataIndex: 'contactPersonName', key: 'contactPersonName' },
        { title: 'Mobile Number', dataIndex: 'phone', key: 'phone' },
        { title: 'Mail Id', dataIndex: 'email', key: 'email' },
        { title: 'Location', dataIndex: 'city', key: 'city' },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (value) => {
                const isActive = value === true;
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
                rowKey="_id"
                isLoading={isLoading}
                showSearch={true}
                onSearch={handleSearch}
                searchPlaceholder="Search company, email, contact..."
                showAddButton={true}
                addButtonLabel="Add company"
                addButtonIcon={<Plus size={18} />}
                onAdd={() => navigate(`/${module}/company-form`)}
                showPagination={true}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}

                onRowClick={(record) => navigate(`/${module}/company-profile/${record.id}`)}
            />
        </div>
    );
};




export default Company;
