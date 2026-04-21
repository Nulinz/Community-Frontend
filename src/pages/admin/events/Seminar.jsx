import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import DynamicTable from "../../../common/DynamicTable"
import { useNavigate } from 'react-router-dom';
import { getAllSeminars } from '../../../services/admin/adminServices';
import { toast } from 'react-toastify';

const Seminar = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [seminars, setSeminars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSeminars();
      if (response.success) {
        setSeminars(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch seminars');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      title: '#', 
      key: 'index',
      render: (_, record, index) => {
        const idx = (currentPage - 1) * 10 + index + 1;
        return String(idx).padStart(2, '0');
      }
    },
    { 
      title: 'Seminar Name', 
      dataIndex: 'eventName', 
      key: 'eventName' 
    },
    { 
      title: 'Organizer', 
      dataIndex: 'organizer', 
      key: 'organizer' 
    },
    { 
      title: 'Date', 
      dataIndex: 'eventDate', 
      key: 'eventDate',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { 
      title: 'Mode', 
      dataIndex: 'mode', 
      key: 'mode' 
    },
    { 
      title: 'Reg Type', 
      dataIndex: 'registrationType', 
      key: 'registrationType' 
    },
    { 
      title: 'Fees', 
      key: 'fees',
      render: (_, record) => `₹${record.individualFees || 0}`
    },
    { 
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => {
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

  const filteredData = seminars.filter(item => 
    item.eventName?.toLowerCase().includes(search.toLowerCase()) ||
    item.organizer?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <DynamicTable
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          showSearch={true}
          searchPlaceholder="Search ..."
          onSearch={handleSearch}
          showAddButton={true}
          addButtonLabel="Add Seminar"
          addButtonIcon={<Plus size={18} />}
          onAdd={() => navigate('/admin/seminar-form')}
          showPagination={true}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
          onRowClick={(record) => navigate(`/admin/seminar-profile/${record._id || record.id}`)}
        />
      )}
    </div>
  );
};

export default Seminar;
