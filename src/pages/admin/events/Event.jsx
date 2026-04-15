import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DynamicTable from "../../../common/DynamicTable"
import { useNavigate } from 'react-router-dom';
import { eventFormVariant } from '../../../utils/profileFormConfigs';


const Event = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Column definitions matching your Event screenshot
  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id' 
    },
    { 
      title: 'Event Name', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Organizer', 
      dataIndex: 'organizer', 
      key: 'organizer' 
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date' 
    },
    { 
      title: 'Mode', 
      dataIndex: 'mode', 
      key: 'mode' 
    },
    { 
      title: 'Reg Type', 
      dataIndex: 'regType', 
      key: 'regType' 
    },
    { 
      title: 'Fees', 
      dataIndex: 'fees', 
      key: 'fees' 
    },
    { 
      title: 'Applied', 
      dataIndex: 'applied', 
      key: 'applied' 
    },
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

  // Sample data to demonstrate pagination (more than 10 items)
  const EventData = [
    { id: '01', name: 'IoT Innovation Contest', organizer: 'ConnectSphere Tech', date: '01/12/2026', mode: 'Offline', regType: 'Paid', fees: '₹900', applied: '250', status: 'active' },
    { id: '02', name: 'AI Hackathon', organizer: 'InnovateSphere', date: '20/06/2026', mode: 'Online', regType: 'Free', fees: '₹0', applied: '300', status: 'active' },
    { id: '03', name: 'Data Science Bowl', organizer: 'Data Insights Corp', date: '10/07/2026', mode: 'Online', regType: 'Paid', fees: '₹500', applied: '80', status: 'inactive' },
    { id: '04', name: 'UX Designathon', organizer: 'Design Forward Inc.', date: '05/08/2026', mode: 'Offline', regType: 'Paid', fees: '₹1000', applied: '200', status: 'active' },
    { id: '05', name: 'Mobile App Challenge', organizer: 'Appify Solutions', date: '15/08/2026', mode: 'Online', regType: 'Free', fees: '₹0', applied: '500', status: 'inactive' },
    { id: '06', name: 'Web Dev Event', organizer: 'CodeCrafters United', date: '25/09/2026', mode: 'Offline', regType: 'Paid', fees: '₹750', applied: '150', status: 'active' },
    { id: '07', name: 'Cybersecurity Showdown', organizer: 'SecureTech Group', date: '01/10/2026', mode: 'Online', regType: 'Free', fees: '₹0', applied: '180', status: 'inactive' },
    { id: '08', name: 'AI Robotics Challenge', organizer: 'RoboAI Innovations', date: '10/11/2026', mode: 'Offline', regType: 'Paid', fees: '₹1200', applied: '220', status: 'active' },
    { id: '09', name: 'Blockchain Hackathon', organizer: 'BlockChain Forward', date: '18/11/2026', mode: 'Online', regType: 'Free', fees: '₹0', applied: '130', status: 'inactive' },
    { id: '10', name: 'IoT Innovation Contest', organizer: 'ConnectSphere Tech', date: '01/12/2026', mode: 'Offline', regType: 'Paid', fees: '₹900', applied: '250', status: 'active' },
    { id: '11', name: 'Next Gen UI Challenge', organizer: 'Visual Arts Lab', date: '12/12/2026', mode: 'Online', regType: 'Free', fees: '₹0', applied: '410', status: 'inactive' },
  ];

  // Filtering logic
  const filteredData = EventData.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.organizer.toLowerCase().includes(search.toLowerCase())
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
        // Search Config
        showSearch={true}
        searchPlaceholder="Search ..."
        onSearch={handleSearch}
        // Add Button Config
        showAddButton={true}
        addButtonLabel="Add Event"
        addButtonIcon={<Plus size={18} />}
        onAdd={() =>
          navigate('/admin/add-form', {
            state: { formType: 'event', formVariant: eventFormVariant },
          })
        }
        // Pagination Config
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        onRowClick={() => navigate('/admin/events-profile')}
      />
    </div>
  );
};

export default Event;
