import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../common/DynamicTable';
import { getAllColleges } from '../../../services/admin/adminServices';
import { toast } from 'react-toastify';

const College = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setIsLoading(true);
      const response = await getAllColleges();
      if (response.success) {
        setColleges(response.data);
      } else {
        toast.error("Failed to fetch colleges");
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("An error occurred while fetching colleges");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRows = colleges.filter((item) =>
    (item.collegeName?.toLowerCase().includes(search.toLowerCase())) ||
    (item.contactPersonName?.toLowerCase().includes(search.toLowerCase())) ||
    (item.city?.toLowerCase().includes(search.toLowerCase())) ||
    (item.state?.toLowerCase().includes(search.toLowerCase())) ||
    (item.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const columns = [
    { 
      title: '#', 
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
      key: 'index' 
    },
    { title: 'College Name', dataIndex: 'collegeName', key: 'collegeName' },
    { title: 'Type', dataIndex: 'collegeType', key: 'collegeType' },
    { title: 'Contact Person', dataIndex: 'contactPersonName', key: 'contactPersonName' },
    { title: 'Mobile Number', dataIndex: 'phone', key: 'phone' },
    { title: 'Mail Id', dataIndex: 'email', key: 'email' },
    { 
      title: 'Location', 
      key: 'location',
      render: (_, record) => `${record?.city || 'N/A'}, ${record?.state || 'N/A'}`
    },
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
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-secondary font-medium">Loading Colleges...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <DynamicTable
        columns={columns}
        dataSource={filteredRows}
        rowKey="_id"
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search ..."
        showAddButton={true}
        addButtonLabel="Add College"
        addButtonIcon={<Plus size={18} />}
        onAdd={() =>
          navigate('/admin/college-form')
        }
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        onRowClick={(record) => navigate(`/admin/college-profile/${record._id}`)}
      />
    </div>
  );
};

export default College;
