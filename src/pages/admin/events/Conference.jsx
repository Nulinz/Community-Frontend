import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicTable from "../../../common/DynamicTable";
import { getAllConferences } from '../../../services/admin/adminServices';
import { toast } from 'react-toastify';


const Conference = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [conferences, setConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      setIsLoading(true);
      const response = await getAllConferences();
      console.log("Conferences API Response:", response);
      if (response.success) {
        setConferences(response.data);
      } else {
        toast.error("Failed to fetch conferences");
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      toast.error("An error occurred while fetching conferences");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      title: '#', 
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
      key: 'index' 
    },
    { 
      title: 'Conference Name', 
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
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
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
      dataIndex: 'individualFees', 
      key: 'individualFees',
      render: (fees) => `₹${fees || 0}`
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
    }
  ];

  const filteredData = conferences.filter(item => 
    (item.eventName?.toLowerCase().includes(search.toLowerCase())) ||
    (item.organizer?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-secondary font-medium">Loading Conferences...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <DynamicTable
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        onRowClick={(record) => navigate(`/admin/conference-profile/${record._id}`)}
        // Search Config
        showSearch={true}
        searchPlaceholder="Search ..."
        onSearch={handleSearch}
        // Add Button Config
        showAddButton={true}
        addButtonLabel="Add Conference"
        addButtonIcon={<Plus size={18} />}
        onAdd={() =>
          navigate('/admin/conference-form')
        } 
        
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Conference;
