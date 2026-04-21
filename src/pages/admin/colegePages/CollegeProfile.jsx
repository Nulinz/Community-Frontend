import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LockKeyhole, SquarePen, X, Loader2 } from 'lucide-react';
import { assets } from '../../../assets/assets';
import DynamicTable from '../../../common/DynamicTable';
import { getCollegeById, toggleCollegeStatus, setCollegePassword } from '../../../services/admin/adminServices';
import { toast } from 'react-toastify';

const tabs = ['Overview', 'Competition', 'Conference', 'Event', 'Seminar'];

const CollegeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [competitionPage, setCompetitionPage] = useState(1);
  const [conferencePage, setConferencePage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [seminarPage, setSeminarPage] = useState(1);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('CNX@I204');
  const [confirmPassword, setConfirmPassword] = useState('CNX@I2304');
  
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchCollegeData();
  }, [id]);

  const fetchCollegeData = async () => {
    try {
      setIsLoading(true);
      const response = await getCollegeById(id);
      if (response.success) {
        setCollege(response.data);
      } else {
        setError("College not found");
      }
    } catch (err) {
      setError("Failed to fetch college details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsSubmitting(true);
      const response = await toggleCollegeStatus(college._id || college.id);
      if (response.success) {
        toast.success(response.message);
        setCollege((prev) => ({ ...prev, isActive: response.data.isActive }));
      }
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await setCollegePassword({ 
        id: college._id || college.id, 
        password, 
        confirmPassword 
      });
      if (response.success) {
        toast.success(response.message || "Password updated successfully");
        setPassword('');
        setConfirmPassword('');
        setIsPasswordModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-secondary font-medium mt-2">Loading Profile...</p>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 max-w-md">
          <p className="font-bold text-lg mb-1">Oops!</p>
          <p className="text-sm font-medium">{error || "Something went wrong"}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary text-white rounded-full font-semibold shadow-md hover:bg-opacity-90 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const SectionCard = ({ title, children, className = '' }) => (
    <div className={`rounded-[20px] border border-[#EAECF0] bg-[#FFFFFF] p-[14px] ${className}`}>
      <h2 className="text-[20px] font-semibold text-primary mb-[18px]">{title}</h2>
      {children}
    </div>
  );

  const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-[16px] font-semibold text-primary leading-normal">{label}</p>
      <p className="text-[14px] font-medium text-secondary leading-normal">{value}</p>
    </div>
  );

  const renderStatus = (value) => {
    const isActive = value === true;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-semibold ${
          isActive ? 'bg-[#E6F8EE] text-[#23A55A]' : 'bg-[#F1F5F9] text-[#64748B]'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#23A55A]' : 'bg-[#64748B]'}`} />
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const competitionColumns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'Competition Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Mode', dataIndex: 'mode', key: 'mode' },
    { title: 'Reg Type', dataIndex: 'regType', key: 'regType' },
    { title: 'Fees', dataIndex: 'fees', key: 'fees' },
    { title: 'Applied', dataIndex: 'applied', key: 'applied' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatus },
  ];

  const conferenceColumns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'Conference Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Mode', dataIndex: 'mode', key: 'mode' },
    { title: 'Reg Type', dataIndex: 'regType', key: 'regType' },
    { title: 'Fees', dataIndex: 'fees', key: 'fees' },
    { title: 'Applied', dataIndex: 'applied', key: 'applied' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatus },
  ];

  const eventColumns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'Event Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Reg Type', dataIndex: 'regType', key: 'regType' },
    { title: 'Fees', dataIndex: 'fees', key: 'fees' },
    { title: 'Applied', dataIndex: 'applied', key: 'applied' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatus },
  ];

  const seminarColumns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'Seminar Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Reg Type', dataIndex: 'regType', key: 'regType' },
    { title: 'Fees', dataIndex: 'fees', key: 'fees' },
    { title: 'Applied', dataIndex: 'applied', key: 'applied' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatus },
  ];

  const competitionData = [
    { id: '01', name: 'IoT Innovation Contest', date: '01/12/2026', mode: 'Offline', regType: 'Paid', fees: '?900', applied: '250', status: true },
    { id: '02', name: 'AI Hackathon', date: '20/06/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '300', status: true },
    { id: '03', name: 'Data Science Bowl', date: '10/07/2026', mode: 'Online', regType: 'Paid', fees: '?500', applied: '80', status: false },
    { id: '04', name: 'UX Designathon', date: '05/08/2026', mode: 'Offline', regType: 'Paid', fees: '?1000', applied: '200', status: false },
    { id: '05', name: 'Mobile App Challenge', date: '15/08/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '500', status: true },
    { id: '06', name: 'Web Dev Competition', date: '25/09/2026', mode: 'Offline', regType: 'Paid', fees: '?750', applied: '150', status: true },
    { id: '07', name: 'Cybersecurity Showdown', date: '01/10/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '180', status: true },
    { id: '08', name: 'AI Robotics Challenge', date: '10/11/2026', mode: 'Offline', regType: 'Paid', fees: '?1200', applied: '220', status: false },
    { id: '09', name: 'Blockchain Hackathon', date: '18/11/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '130', status: false },
    { id: '10', name: 'IoT Innovation Contest', date: '01/12/2026', mode: 'Offline', regType: 'Paid', fees: '?900', applied: '250', status: false },
  ];

  const conferenceData = [
    { id: '01', name: 'IoT Innovation Contest', date: '01/12/2026', mode: 'Offline', regType: 'Paid', fees: '?900', applied: '250', status: true },
    { id: '02', name: 'AI Hackathon', date: '20/06/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '300', status: true },
    { id: '03', name: 'Data Science Bowl', date: '10/07/2026', mode: 'Online', regType: 'Paid', fees: '?500', applied: '80', status: false },
    { id: '04', name: 'UX Designathon', date: '05/08/2026', mode: 'Offline', regType: 'Paid', fees: '?1000', applied: '200', status: false },
    { id: '05', name: 'Mobile App Challenge', date: '15/08/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '500', status: true },
    { id: '06', name: 'Web Dev Competition', date: '25/09/2026', mode: 'Offline', regType: 'Paid', fees: '?750', applied: '150', status: true },
    { id: '07', name: 'Cybersecurity Showdown', date: '01/10/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '180', status: true },
    { id: '08', name: 'AI Robotics Challenge', date: '10/11/2026', mode: 'Offline', regType: 'Paid', fees: '?1200', applied: '220', status: false },
    { id: '09', name: 'Blockchain Hackathon', date: '18/11/2026', mode: 'Online', regType: 'Free', fees: '?0', applied: '130', status: false },
    { id: '10', name: 'IoT Innovation Contest', date: '01/12/2026', mode: 'Offline', regType: 'Paid', fees: '?900', applied: '250', status: false },
  ];

  const eventData = [
    { id: '01', name: 'AI Ethics and Policy Forum', date: '08/03/2027', regType: 'Free', fees: '?0', applied: '250', status: true },
    { id: '02', name: 'Cybersecurity Trends Conference', date: '22/08/2026', regType: 'Free', fees: '?0', applied: '300', status: false },
    { id: '03', name: 'Quantum Computing Workshop', date: '10/09/2026', regType: 'Paid', fees: '?4500', applied: '80', status: true },
    { id: '04', name: 'Digital Marketing Strategies', date: '05/10/2026', regType: 'Paid', fees: '?1500', applied: '200', status: false },
    { id: '05', name: 'Sustainable Tech Expo', date: '18/11/2026', regType: 'Free', fees: '?0', applied: '500', status: true },
    { id: '06', name: 'Virtual Reality Developers Meetup', date: '12/12/2026', regType: 'Paid', fees: '?3200', applied: '150', status: false },
    { id: '07', name: 'Blockchain for Business Summit', date: '03/01/2027', regType: 'Paid', fees: '?4000', applied: '180', status: true },
    { id: '08', name: 'Augmented Reality in Education', date: '25/01/2027', regType: 'Free', fees: '?0', applied: '220', status: false },
    { id: '09', name: 'Cloud Computing Symposium', date: '14/02/2027', regType: 'Paid', fees: '?2800', applied: '130', status: true },
    { id: '10', name: 'AI Ethics and Policy Forum', date: '08/03/2027', regType: 'Free', fees: '?0', applied: '250', status: false },
  ];

  const seminarData = [
    { id: '01', name: 'Quantum Computing Decoded', date: '15/04/2027', regType: 'Paid', fees: '?3500', applied: '250', status: false },
    { id: '02', name: 'Sustainable Urban Planning', date: '02/05/2027', regType: 'Free', fees: '?0', applied: '300', status: true },
    { id: '03', name: 'Advanced Robotics Workshop', date: '18/05/2027', regType: 'Paid', fees: '?5000', applied: '80', status: false },
    { id: '04', name: 'Digital Marketing Strategies', date: '01/06/2027', regType: 'Free', fees: '?1500', applied: '200', status: false },
    { id: '05', name: 'Cybersecurity Threats Summit', date: '14/06/2027', regType: 'Paid', fees: '?4200', applied: '500', status: true },
    { id: '06', name: 'Mobile App Development', date: '28/06/2027', regType: 'Free', fees: '?3200', applied: '150', status: false },
    { id: '07', name: 'Data Analytics and Insights', date: '11/07/2027', regType: 'Paid', fees: '?4800', applied: '180', status: false },
    { id: '08', name: 'Cloud Computing Essentials', date: '25/07/2027', regType: 'Free', fees: '?0', applied: '220', status: true },
    { id: '09', name: 'AI and Machine Learning', date: '08/08/2027', regType: 'Paid', fees: '?5500', applied: '130', status: false },
    { id: '10', name: 'Blockchain Technology Summit', date: '22/08/2027', regType: 'Paid', fees: '?6000', applied: '250', status: true },
  ];
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className=" mx-auto space-y-6">
        <section className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-[#EAECF0]">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="w-[110px] h-[110px] rounded-[16px] border border-[#EAECF0] bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                <img src={college.collegeLogo ? `${BASE_URL}/${college.collegeLogo}` : assets.logo} alt="College Logo" className="w-full h-full object-contain p-2" />
              </div>

              <div className="space-y-2 ">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[24px] md:text-[28px] font-bold text-primary tracking-tight">{college.collegeName}</h1>
                  {renderStatus(college.isActive)}
                </div>
                <div className="space-y-1">
                  <p className="text-[16px] font-semibold text-secondary">{college.collegeType}</p>
                  <p className="text-[14px] text-secondary font-medium">{college.affiliatedUniversity}</p>
                  <p className="text-[14px] text-secondary font-medium">{college.city}, {college.state}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="min-w-[180px] md:min-w-[220px] rounded-[20px] p-6 bg-[linear-gradient(180deg,_#0989D4_0%,_#006098_100%)] text-white shadow-md flex flex-col justify-center">
                <p className="text-[10px] font-semibold uppercase tracking-[1.5px] mb-4 opacity-90">Total Departments</p>
                <p className="text-[30px] font-bold leading-none">{college.totalDepartments || (college.departments?.length) || 0}</p>
              </div>
              <div className="min-w-[180px] md:min-w-[220px] rounded-[20px] p-6 border border-[#EAECF0] bg-white shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-secondary mb-4">Established Year</p>
                <p className="text-[30px] font-bold leading-none text-[#006098]">
                  {college.establishedYear ? (
                    college.establishedYear.match(/\b\d{4}\b/)?.[0] || college.establishedYear
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-5 py-6">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-[21px] py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 shadow-sm ${
                    activeTab === tab
                      ? 'bg-[#0989D4] text-white'
                      : 'bg-white border border-[#D0D5DD] text-secondary hover:bg-[#F9FAFB] hover:border-[#98A2B3]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                disabled={isSubmitting}
                onClick={handleToggleStatus}
                className={`px-[16px] py-2.5 rounded-full text-white text-[15px] font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 ${college.isActive ? 'bg-[#F04438] hover:bg-[#D92D20]' : 'bg-[#12B76A] hover:bg-[#0E9355]'}`}
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (college.isActive ? 'Deactivate' : 'Activate')}
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-[16px] py-2.5 rounded-full bg-[#0086C9] text-white text-[15px] font-semibold shadow-sm hover:bg-[#026AA2] transition-colors"
              >
                Set Password
              </button>
              <button 
                onClick={() => navigate('/admin/college-form', { state: { editData: college } })}
                className="inline-flex items-center gap-2 px-[16px] py-2.5 rounded-full border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold bg-white shadow-sm hover:bg-[#F9FAFB] transition-colors"
              >
                <SquarePen size={18} /> Edit Details
              </button>
            </div>
          </div>

          {activeTab === 'Overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Contact Information">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <DetailItem label="Contact Person Name" value={college.contactPersonName} />
                    <DetailItem label="Phone Number" value={college.phone} />
                    <DetailItem label="Mail ID" value={college.email} />
                  </div>
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <DetailItem label="Address" value={`${college.address}, ${college.city}, ${college.state} - ${college.pincode}`} />
                  </div>
                </SectionCard>

                <SectionCard title="Academic Details">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <DetailItem label="Courses Available" value={Array.isArray(college.coursesAvailable) ? college.coursesAvailable.join(', ') : (college.coursesAvailable || 'N/A')} />
                    <DetailItem label="Placement Available" value={college.placementAvailable} />
                    <DetailItem label="Total Students" value={college.totalStudents} />
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="About Us" className="mt-6">
                <p className="text-[14px] md:text-[15px] text-secondary leading-[1.8] font-medium whitespace-pre-wrap">
                  {college.aboutUs || "No information provided."}
                </p>
              </SectionCard>
            </div>
          )}

          {activeTab === 'Competition' && (
            <div className="animate-in fade-in duration-500">
              <DynamicTable
                columns={competitionColumns}
                dataSource={competitionData}
                rowKey="id"
                showPagination={true}
                currentPage={competitionPage}
                pageSize={10}
                onPageChange={setCompetitionPage}
              />
            </div>
          )}

          {activeTab === 'Conference' && (
            <div className="animate-in fade-in duration-500">
              <DynamicTable
                columns={conferenceColumns}
                dataSource={conferenceData}
                rowKey="id"
                showPagination={true}
                currentPage={conferencePage}
                pageSize={10}
                onPageChange={setConferencePage}
              />
            </div>
          )}

          {activeTab === 'Event' && (
            <div className="animate-in fade-in duration-500">
              <DynamicTable
                columns={eventColumns}
                dataSource={eventData}
                rowKey="id"
                showPagination={true}
                currentPage={eventPage}
                pageSize={10}
                onPageChange={setEventPage}
              />
            </div>
          )}

          {activeTab === 'Seminar' && (
            <div className="animate-in fade-in duration-500">
              <DynamicTable
                columns={seminarColumns}
                dataSource={seminarData}
                rowKey="id"
                showPagination={true}
                currentPage={seminarPage}
                pageSize={10}
                onPageChange={setSeminarPage}
              />
            </div>
          )}
        </section>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-[520px] bg-white border border-[#EAECF0] rounded-[16px] shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-[10px] border border-[#EAECF0] inline-flex items-center justify-center text-[#667085]">
                  <LockKeyhole size={18} />
                </span>
                <h3 className="text-[20px] font-bold text-primary">Set Password</h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-[#98A2B3] hover:text-[#667085] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[16px] font-semibold text-secondary mb-1">Mobile Number</p>
                <p className="text-[15px] text-primary">{college.phone}</p>
              </div>

              <div>
                <label className="block text-[16px] font-semibold text-secondary mb-2">Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D0D5DD] outline-none focus:ring-1 focus:ring-[#0086C9] transition-all"
                />
              </div>

              <div>
                <label className="block text-[16px] font-semibold text-secondary mb-2">Confirm Password</label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D0D5DD] outline-none focus:ring-1 focus:ring-[#0086C9] transition-all"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="h-12 rounded-[10px] border border-[#D0D5DD] text-[#344054] text-[16px] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSetPassword}
                className="h-12 rounded-[10px] bg-[#0989D4] text-white text-[16px] font-semibold hover:bg-[#007fb8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeProfile;
