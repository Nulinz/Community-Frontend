import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../common/DynamicTable';
import { collegeFormVariant } from '../../../utils/profileFormConfigs';

const College = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const collegeData = [
    { id: '01', name: 'Solaris Energy', type: 'Private', contact: 'Kavitha', mobile: '9223344556', mail: 'contact@solarisenergy.com', location: 'Jaipur', status: 'active' },
    { id: '02', name: 'GreenTech Solutions', type: 'Government', contact: 'Maya', mobile: '9876543210', mail: 'contact@greentech.com', location: 'Chennai', status: 'inactive' },
    { id: '03', name: 'EduSmart', type: 'Autonomous', contact: 'Ravi', mobile: '9123456789', mail: 'info@edusmart.edu', location: 'Bangalore', status: 'active' },
    { id: '04', name: 'HealthPlus', type: 'Private', contact: 'Anjali', mobile: '9988776655', mail: 'support@healthplus.com', location: 'Hyderabad', status: 'active' },
    { id: '05', name: 'FinServe', type: 'Government', contact: 'Suresh', mobile: '9001234567', mail: 'hello@finserve.com', location: 'Mumbai', status: 'inactive' },
    { id: '06', name: 'AgriWave', type: 'Autonomous', contact: 'Neha', mobile: '9012345678', mail: 'contact@agriwave.in', location: 'Pune', status: 'active' },
    { id: '07', name: 'TechNova', type: 'Autonomous', contact: 'Arjun', mobile: '9129876543', mail: 'info@technova.com', location: 'Delhi', status: 'active' },
    { id: '08', name: 'UrbanStyle', type: 'Private', contact: 'Priya', mobile: '9876501234', mail: 'support@urbanstyle.co', location: 'Kolkata', status: 'active' },
    { id: '09', name: 'BuildSmart', type: 'Private', contact: 'Vikram', mobile: '9445566778', mail: 'contact@buildsmart.com', location: 'Chennai', status: 'inactive' },
    { id: '10', name: 'AutoMotiveX', type: 'Autonomous', contact: 'Sanjay', mobile: '9334455667', mail: 'info@automotivex.com', location: 'Ahmedabad', status: 'active' },
    { id: '11', name: 'CodeForge', type: 'Private', contact: 'Harish', mobile: '9001122334', mail: 'hello@codeforge.com', location: 'Coimbatore', status: 'active' },
    { id: '12', name: 'BluePeak', type: 'Government', contact: 'Divya', mobile: '9786501231', mail: 'contact@bluepeak.edu', location: 'Madurai', status: 'inactive' },
  ];

  const filteredRows = collegeData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.contact.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'College Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
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
    },
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
        addButtonLabel="Add College"
        addButtonIcon={<Plus size={18} />}
        onAdd={() =>
          navigate('/admin/add-form', {
            state: { formType: 'college', formVariant: collegeFormVariant },
          })
        }
        showPagination={true}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        onRowClick={() => navigate('/admin/college-profile')}
      />
    </div>
  );
};

export default College;
