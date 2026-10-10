import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import DynamicTable from '../../../common/DynamicTable';
import DeleteConfirmModal from '../../../common/DeleteConfirmModal';
import { getAllCpmpanies } from '../../../services/admin/adminServices';
import { deleteModuleItem } from '../../../services/commonServices';
import { toast } from 'react-toastify';
import { useTitle } from '../../../context/AdminTitle';

const Company = ({ module }) => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Company");
    }, []);

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

    /**
     * Handles confirmed company deletion through the unified deletion service.
     * Removes the company document and its uploaded assets, then updates local state.
     */
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setIsDeleting(true);
            const targetId = deleteTarget._id || deleteTarget.id;
            await deleteModuleItem('company', targetId);
            setCompanies((prev) => prev.filter((item) => (item._id || item.id) !== targetId));
            toast.success("Company deleted successfully");
            setDeleteTarget(null);
        } catch (error) {
            console.error("Failed to delete company:", error);
            toast.error(error?.response?.data?.message || "Failed to delete company");
        } finally {
            setIsDeleting(false);
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
            render: (_text, _record, index) => (currentPage - 1) * 10 + index + 1
        },
        { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
        { 
            title: 'Industry', 
            dataIndex: 'industry', 
            key: 'industry',
            render: (_text, record) => record.industry || record.companyType || 'N/A'
        },
        { title: 'Contact Person', dataIndex: 'contactPersonName', key: 'contactPersonName' },
        { title: 'Mobile Number', dataIndex: 'phone', key: 'phone' },
        { title: 'Mail Id', dataIndex: 'email', key: 'email' },
        { title: 'Location', dataIndex: 'city', key: 'city' },
        {
            title: 'Status',
            dataIndex: 'is_active',
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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(record);
                    }}
                    className="p-1.5 text-[#F04438] hover:text-[#D92D20] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Company"
                    aria-label="Delete Company"
                >
                    <Trash2 size={18} />
                </button>
            ),
        },
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

            {/* Reusable Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Company"
                itemName={deleteTarget?.companyName}
                isSubmitting={isDeleting}
            />
        </div>
    );
};

export default Company;
