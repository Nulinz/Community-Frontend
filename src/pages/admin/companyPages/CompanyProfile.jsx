import React, { useRef, useState } from 'react';
import { BriefcaseBusiness, Clock3, LockKeyhole, MapPin, Plus, SquarePen, Upload, X } from 'lucide-react';
import { assets } from '../../../assets/assets';
import DynamicTable from '../../../common/DynamicTable';

const tabs = ['About', 'Posts', 'Jobs', 'People'];

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peoplePage, setPeoplePage] = useState(1);
  const [password, setPassword] = useState('CNX@I204');
  const [confirmPassword, setConfirmPassword] = useState('CNX@I204');
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const fileInputRef = useRef(null);

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

  const postSamples = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
  ];

  const jobs = [
    { id: 1, title: 'Senior UI/UX Designer', company: 'Nulinz', location: 'Salem', duration: 'No fixed duration', salary: 'Unpaid', skills: 'AutoCAD, Modelling,3D Modelling, architecture...', posted: '5 Days Ago' },
    { id: 2, title: 'Web Developer', company: 'Nulinz', location: 'Salem', duration: '6 Months', salary: '7,000/month', skills: 'AutoCAD, Modelling,3D Modelling, architecture...', posted: '5 Days Ago' },
    { id: 3, title: 'Senior AutoCAD Designers', company: 'Nulinz', location: 'Salem', duration: 'No fixed duration', salary: '20,000', skills: 'AutoCAD, Modelling,3D Modelling, architecture...', posted: '5 Days Ago' },
    { id: 4, title: 'Senior UI/UX Designer', company: 'Nulinz', location: 'Salem', duration: 'No fixed duration', salary: 'Unpaid', skills: 'AutoCAD, Modelling,3D Modelling, architecture...', posted: '5 Days Ago' },
    { id: 5, title: 'Web Developer', company: 'Nulinz', location: 'Salem', duration: '6 Months', salary: '7,000/month', skills: 'AutoCAD, Modelling,3D Modelling, architecture...', posted: '5 Days Ago' },
    { id: 6, title: 'Senior AutoCAD Designers', company: 'Nulinz', location: 'Salem', duration: 'No fixed duration', salary: '20,000', skills: 'AutoCAD, Modelling,3D Modelling, architecture...', posted: '5 Days Ago' },
  ];

  const peopleColumns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'College', dataIndex: 'college', key: 'college' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Contact Number', dataIndex: 'contact', key: 'contact' },
    { title: 'Mail id', dataIndex: 'mail', key: 'mail' },
  ];

  const peopleData = [
    { id: '01', name: 'Nala', college: 'Quantum Innovators Institute', department: 'Robotics', year: '2025', contact: '9876543210', mail: 'nala@example.com' },
    { id: '02', name: 'Rishi', college: 'Stellaris Academy', department: 'AI Engineering', year: '2024', contact: '8765432109', mail: 'rishi@sample.com' },
    { id: '03', name: 'Priya', college: 'Zenith Institute', department: 'Data Analytics', year: '2026', contact: '7654321098', mail: 'priya@domain.com' },
    { id: '04', name: 'Veer', college: 'Nova College', department: 'Cybersecurity', year: '2027', contact: '6543210987', mail: 'veer@institution.com' },
    { id: '05', name: 'Leela', college: 'Apex University', department: 'Cloud Computing', year: '2025', contact: '5432109876', mail: 'leela@university.com' },
    { id: '06', name: 'Kiran', college: 'Pinnacle Institute', department: 'Software Development', year: '2024', contact: '4321098765', mail: 'kiran@academy.com' },
    { id: '07', name: 'Diya', college: 'Horizon College', department: 'UX Design', year: '2026', contact: '3210987654', mail: 'diya@institute.com' },
    { id: '08', name: 'Aryan', college: 'Summit Academy', department: 'Mobile Development', year: '2027', contact: '2109876543', mail: 'aryan@college.com' },
    { id: '09', name: 'Neha', college: 'Vanguard Institute', department: 'Network Engineering', year: '2025', contact: '1098765432', mail: 'neha@summit.com' },
    { id: '10', name: 'Rohan', college: 'Everest College', department: 'Game Development', year: '2024', contact: '0987654321', mail: 'rohan@vanguard.com' },
    { id: '11', name: 'Ishaan', college: 'Future Minds College', department: 'Machine Learning', year: '2026', contact: '9876501234', mail: 'ishaan@future.com' },
    { id: '12', name: 'Meera', college: 'Tech Valley University', department: 'AI Research', year: '2025', contact: '8765401234', mail: 'meera@techvalley.com' },
  ];

  const filteredPeople = peopleData.filter((item) =>
    [item.name, item.college, item.department, item.year, item.contact, item.mail]
      .join(' ')
      .toLowerCase()
      .includes(peopleSearch.toLowerCase())
  );

  const addFilesToPosts = (files) => {
    const items = Array.from(files || [])
      .filter((file) => file.type.startsWith('image/'))
      .map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        src: URL.createObjectURL(file),
      }));

    if (!items.length) return;
    setUploadedPosts((prev) => [...prev, ...items]);
  };

  const handleUploadChange = (event) => {
    addFilesToPosts(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addFilesToPosts(event.dataTransfer.files);
  };

  const removePostImage = (id) => {
    setUploadedPosts((prev) => prev.filter((item) => item.id !== id));
  };

  const InfoList = ({ items = [] }) => (
    <ul className="text-[14px] text-secondary font-medium leading-[1.6] list-disc pl-5 space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-[24px] border border-[#EAECF0] overflow-hidden shadow-sm">
        <div
          className="h-[150px] md:h-[170px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(91, 108, 131, 0.2), rgba(184, 199, 217, 0.18)), url('https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&fit=crop&w=1600&q=80')",
          }}
        />

        <div className="px-6 pb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 -mt-[56px]">
            <div className="flex-1 min-w-0">

              <div className="w-[120px] h-[120px] rounded-[16px] border-[3px] border-white bg-[#0B3A53] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                <img src={assets.logo} alt="Company Logo" className="w-[85px] h-[85px] object-contain" />
              </div>

              <div className="mt-4 space-y-2 max-w-[760px]">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[30px] font-semibold text-primary">TechNova Corp</h1>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ECFDF3] text-[#027A48] text-[14px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
                    Active
                  </span>
                </div>
                <p className="text-[14px]  text-secondary">
                  <span className='text-[16px] font-semibold'>Cloud Computing &amp; AI Solutions .</span> San Francisco, CA
                </p>
                <p className="text-[14px] text-secondary font-medium">
                  <span className='text-[16px] font-semibold'>Year Founded: 2018</span> www.nulinz.com
                </p>
                <p className="text-[16px] text-secondary font-normal leading-[1.8]">
                  Orchestrating the future of enterprise intelligence through scalable neural networks and
                  sustainable cloud infrastructure. Join our global network of innovators.
                </p>
                <p className="text-[14px] text-secondary font-medium">
                  <span className="text-[#110E7E] font-bold">42,809 followers</span>
                  <span className="mx-4 text-[#D0D5DD]">.</span>
                  <span>50 -100 employees</span>
                </p>
              </div>
            </div>

            <div className="lg:min-w-[440px] lg:pt-[40px] flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="min-w-[180px] md:min-w-[220px] rounded-[20px] p-6 bg-[linear-gradient(180deg,_#0989D4_0%,_#006098_100%)] text-white shadow-md flex flex-col justify-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[1.5px] mb-4 opacity-90">Total Departments</p>
                  <p className="text-[30px] font-bold leading-none">12</p>
                </div>
                <div className="min-w-[180px] md:min-w-[220px] rounded-[20px] p-6 border border-[#EAECF0] bg-white shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-secondary mb-4">Established Year</p>
                  <p className="text-[30px] font-bold leading-none text-[#006098]">2008</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="px-[16px] py-2.5 rounded-full bg-[#F04438] text-white text-[15px] font-semibold shadow-sm hover:bg-[#D92D20] transition-colors">
                  Inactive
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-[16px] py-2.5 rounded-full bg-[#0086C9] text-white text-[15px] font-semibold shadow-sm hover:bg-[#026AA2] transition-colors"
                >
                  Set Password
                </button>
                <button
                  onClick={() => {
                    setUploadedPosts(postSamples.map((src, index) => ({ id: `sample-${index}`, src })));
                    setIsAddPostModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-[16px] py-2.5 rounded-full border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold bg-white shadow-sm hover:bg-[#F9FAFB] transition-colors"
                >
                  <Plus size={20} />
                  Add Post
                </button>
                <button className="inline-flex items-center gap-2 px-[16px] py-2.5 rounded-full border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold bg-white shadow-sm hover:bg-[#F9FAFB] transition-colors">
                  <SquarePen size={18} />
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-0 border-b border-[#EAECF0] pb-0 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 text-[18px] font-medium transition-colors ${
                activeTab === tab ? 'text-[#110E7E] font-semibold' : 'text-[#475467] hover:text-[#344054]'
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#110E7E] rounded-full" />}
            </button>
          ))}
        </div>

        {activeTab === 'About' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pt-6">
            <div className="space-y-5">
              <SectionCard title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <DetailItem label="Contact Person Name" value="Ashwin" />
                  <DetailItem label="Phone" value="+91 8438298692" />
                  <DetailItem label="Email" value="nulinz@gmail.com.com" />
                </div>
                <div className="pt-2">
                  <DetailItem
                    label="Location"
                    value="1st Floor, NV Arcade Building, Near 5Roads, Next Reliance Mall, Salem - 636004"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Company Culture Tags">
                <div className="flex flex-wrap gap-3">
                  {['Remote', 'Hybrid', 'Flat-Structure', 'Social', 'Pet-Friendly'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full border border-[#D0D5DD] bg-[#F8FAFC] text-[14px] font-medium text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Technologies We Use">
                <InfoList
                  items={[
                    'React.js',
                    'Next.js',
                    'Node.js',
                    'Python (Django / FastAPI)',
                    'Flutter',
                    'AWS & Azure',
                    'MySQL & MongoDB',
                    'Docker & Kubernetes',
                    'GitHub Actions (CI/CD)',
                  ]}
                />
              </SectionCard>

              <SectionCard title="What We Do">
                <InfoList
                  items={[
                    'Custom Software Development',
                    'Mobile App Development (Android & iOS)',
                    'SaaS Product Development',
                    'ERP & CRM Systems',
                    'UI/UX Design Services',
                    'Cloud Migration & DevOps',
                    'AI & Data Analytics Solutions',
                  ]}
                />
              </SectionCard>
            </div>

            <div className="space-y-5">
              <SectionCard title="About Us">
                <p className="text-[14px] md:text-[15px] text-secondary leading-[1.8] font-medium">
                  Nulinz Global Technology Technologies is a fast-growing software development company specializing in scalable web and mobile applications.
                  We deliver innovative digital products for startups, enterprises, and global clients. Our team focuses on performance-driven development,
                  cloud integration, and modern UI/UX design. We aim to simplify business operations using smart automation and technology solutions.
                </p>
              </SectionCard>

              <SectionCard title="Certificate Availability">
                <p className="text-[14px] md:text-[15px] text-secondary leading-[1.8] font-medium">
                  A completion certificate will be provided to students who successfully fulfill the internship requirements, including task completion and
                  attendance. The certificate can be used for academic or career purposes.
                </p>
              </SectionCard>

              <SectionCard title="Learning Benefits">
                <InfoList
                  items={[
                    'Exposure to real-time industry projects',
                    'Guidance from experienced professionals',
                    'Hands-on experience with company tools and processes',
                    'Performance feedback and career mentoring',
                  ]}
                />
              </SectionCard>

              <SectionCard title="Learning Outcomes">
                <InfoList
                  items={[
                    'Structured learning modules aligned with internship tasks',
                    'Progress tracking and milestone-based evaluations',
                    'Skill assessments and performance insights',
                    'Access to learning resources and support',
                  ]}
                />
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === 'Posts' && (
          <div className="pt-6">
            <SectionCard title="Posts">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {postSamples.map((src, index) => (
                  <div key={src} className="rounded-[16px] overflow-hidden border border-[#EAECF0]">
                    <img src={src} alt={`Company Post ${index + 1}`} className="w-full h-[260px] object-cover" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'Jobs' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-[14px] border border-[#EAECF0] bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-[10px] border border-[#EAECF0] bg-[#F8FAFC] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={assets.logo} alt="Company" className="w-9 h-9 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-semibold leading-[1.2] text-primary truncate">{job.title}</h3>
                      <p className="mt-1 text-[14px] font-medium text-[#667085]">{job.company}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px] text-[#475467] font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#667085]" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={16} className="text-[#667085]" />
                      {job.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness size={16} className="text-[#667085]" />
                      {job.salary}
                    </span>
                  </div>

                  <p className="mt-2 text-[16px] text-[#475467] font-medium truncate">{job.skills}</p>
                  <p className="mt-3 text-[12px] text-[#667085] font-medium">{job.posted}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'People' && (
          <div className="pt-6">
            <DynamicTable
              columns={peopleColumns}
              dataSource={filteredPeople}
              rowKey="id"
              showSearch={true}
              searchPlaceholder="Search ..."
              onSearch={(value) => {
                setPeopleSearch(value);
                setPeoplePage(1);
              }}
              showPagination={true}
              currentPage={peoplePage}
              pageSize={10}
              onPageChange={setPeoplePage}
            />
          </div>
        )}
      </section>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] bg-white border border-[#EAECF0] rounded-[16px] shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-[10px] border border-[#EAECF0] inline-flex items-center justify-center text-[#667085]">
                  <LockKeyhole size={18} />
                </span>
                <h3 className="text-[20px] font-bold text-primary">Set Password</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-[#98A2B3] hover:text-[#667085]">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[16px] font-source font-semibold text-secondary mb-1">Mobile Number</p>
                <p className="text-[16px] font-source text-primary">8438293689</p>
              </div>

              <div>
                <label className="block text-[16px] font-source font-semibold text-secondary mb-2">Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D0D5DD] outline-none focus:ring-1 focus:ring-[#0086C9]"
                />
              </div>

              <div>
                <label className="block text-[16px] font-source font-semibold text-secondary mb-2">Confirm Password</label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-[#D0D5DD] outline-none focus:ring-1 focus:ring-[#0086C9]"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="h-12 rounded-[10px] border border-[#D0D5DD] text-[#344054] text-[16px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="h-12 rounded-[10px] bg-[#0989D4] text-white text-[16px] font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="w-full max-w-[560px] bg-white rounded-[16px] border border-[#EAECF0] shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[20px] font-bold text-primary">Add Post</h3>
              <button onClick={() => setIsAddPostModalOpen(false)} className="text-[#98A2B3] hover:text-[#667085]">
                <X size={24} />
              </button>
            </div>
            <p className="text-[14px] text-secondary mb-4">Upload poster for this company.</p>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="border border-[#D0D5DD] rounded-[14px] h-[150px] flex flex-col items-center justify-center gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                <Upload size={20} className="text-[#667085]" />
              </div>
              <p className="text-[14px] text-[#667085]">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[#0989D4] font-semibold">
                  Click to upload
                </button>{' '}
                or drag and drop
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUploadChange} className="hidden" />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {uploadedPosts.slice(0, 3).map((item) => (
                <div key={item.id} className="relative rounded-[12px] overflow-hidden border border-[#EAECF0] bg-[#F9FAFB]">
                  <img src={item.src} alt="Post preview" className="w-full h-[120px] object-cover" />
                  <button
                    onClick={() => removePostImage(item.id)}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-[#D92D20] border border-[#F4C7C3] flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsAddPostModalOpen(false)}
                className="h-11 rounded-[10px] border border-[#D0D5DD] text-[#344054] text-[15px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddPostModalOpen(false)}
                className="h-11 rounded-[10px] bg-[#0989D4] text-white text-[15px] font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;


