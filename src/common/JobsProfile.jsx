import React, { useState } from 'react';
import { assets } from '../assets/assets';
import AppliedListSection from './AppliedListSection';

const JobsProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const listItems = ['AI Engineering', 'Data Management', 'Machine Learning', 'Robotics', 'Cloud Computing'];

  const paraText =
    'Dr. Anya Sharma, a renowned AI researcher, holds a Ph.D. from MIT and has led several cutting-edge projects at FutureTech Labs. Her work focuses on ethical AI and its impact on society. Dr. Sharma has been recognized with numerous awards and is a sought-after speaker at global tech events. She is passionate about fostering innovation and collaboration in the field of artificial intelligence.';

  const appliedListHeading = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'College', dataIndex: 'college', key: 'college' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Contact Number', dataIndex: 'contact', key: 'contact' },
    { title: 'Mail id', dataIndex: 'mail', key: 'mail' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
  ];

  const appliedListData = [
    { id: '01', name: 'Nala', college: 'Quantum Innovators Institute', department: 'Robotics', year: '2025', contact: '9876543210', mail: 'nala@example.com', location: 'Salem' },
    { id: '02', name: 'Rishi', college: 'Stellaris Academy', department: 'AI Engineering', year: '2024', contact: '8765432109', mail: 'rishi@sample.com', location: 'Salem' },
    { id: '03', name: 'Priya', college: 'Zenith Institute', department: 'Data Analytics', year: '2026', contact: '7654321098', mail: 'priya@domain.com', location: 'Salem' },
    { id: '04', name: 'Veer', college: 'Nova College', department: 'Cybersecurity', year: '2027', contact: '6543210987', mail: 'veer@institution.com', location: 'Salem' },
    { id: '05', name: 'Leela', college: 'Apex University', department: 'Cloud Computing', year: '2025', contact: '5432109876', mail: 'leela@university.com', location: 'Salem' },
    { id: '06', name: 'Kiran', college: 'Pinnacle Institute', department: 'Software Development', year: '2024', contact: '4321098765', mail: 'kiran@academy.com', location: 'Salem' },
    { id: '07', name: 'Diya', college: 'Horizon College', department: 'UX Design', year: '2026', contact: '3210987654', mail: 'diya@institute.com', location: 'Salem' },
    { id: '08', name: 'Aryan', college: 'Summit Academy', department: 'Mobile Development', year: '2027', contact: '2109876543', mail: 'aryan@college.com', location: 'Salem' },
    { id: '09', name: 'Neha', college: 'Vanguard Institute', department: 'Network Engineering', year: '2025', contact: '1098765432', mail: 'neha@summit.com', location: 'Salem' },
    { id: '10', name: 'Rohan', college: 'Everest College', department: 'Game Development', year: '2024', contact: '0987654321', mail: 'rohan@vanguard.com', location: 'Salem' },
    { id: '11', name: 'Ishaan', college: 'Future Minds College', department: 'Machine Learning', year: '2026', contact: '9876501234', mail: 'ishaan@future.com', location: 'Coimbatore' },
    { id: '12', name: 'Meera', college: 'Tech Valley University', department: 'AI Research', year: '2025', contact: '8765401234', mail: 'meera@techvalley.com', location: 'Chennai' },
  ];

  const ListCard = ({ title, items }) => (
    <div className="bg-white rounded-[22px] border border-gray-200 shadow-sm p-5 md:p-6">
      <h3 className="text-[16px] md:text-[18px] font-bold text-primary mb-3">{title}</h3>
      <ul className="space-y-2 list-disc list-inside text-[14px] md:text-[15px] leading-[28px] font-semibold text-secondary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );

  const TextCard = ({ title, text }) => (
    <div className="bg-white rounded-[22px] border border-gray-200 shadow-sm p-5 md:p-6">
      <h3 className="text-[16px] md:text-[18px] font-bold text-primary mb-3">{title}</h3>
      <p className="text-[14px] md:text-[15px] leading-[30px] font-medium text-secondary">{text}</p>
    </div>
  );

  return (
    <div className="bg-[#f8f9fa] min-h-screen ">
      <section className="bg-white rounded-[16px] md:rounded-[24px] border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="flex gap-4 md:gap-6">
            <div className="w-[86px] h-[86px] md:w-[118px] md:h-[118px] rounded-[12px] border border-gray-300 flex items-center justify-center bg-white">
              <img src={assets.logo} alt="Company logo" className="w-[54px] md:w-[84px] h-auto object-contain" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-semibold text-[18px] leading-none tracking-normal text-primary">UI UX Designer</h1>
                <span className="inline-flex items-center gap-2 bg-[#E6F8EE] text-[#23A55A] px-3 py-1 rounded-full text-[12px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#23A55A]" />
                  Active
                </span>
              </div>
              <p className="font-jakarta font-semibold text-[16px] text-secondary">Nulinz Technology</p>
              <p className="font-jakarta font-medium text-[14px] text-[#344054]">Onsite</p>
              <p className="font-jakarta font-medium text-[14px] text-[#344054]">10 Openings</p>
              <p className="font-jakarta font-medium text-[14px] text-[#344054]">₹ 25,500</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto">
            <div className="rounded-[18px] bg-[linear-gradient(119.97deg,_#006098_0%,_#00C1FD_100%)] text-white p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
              <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3">Total Openings</p>
              <p className="text-[28px] md:text-[40px] leading-none font-bold">45</p>
            </div>

            <div className="rounded-[18px] bg-white border border-gray-200 text-[#0C5F94] p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
              <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3 text-[#7D89A0]">Intern Start Date</p>
              <p className="text-[18px] md:text-[26px] leading-none font-bold">12/04/2026</p>
            </div>

            <div className="rounded-[18px] bg-white border border-gray-200 text-[#0C5F94] p-4 md:p-5 min-h-[100px] md:min-h-[130px] flex flex-col justify-center sm:min-w-[150px]">
              <p className="uppercase tracking-[1px] text-[10px] md:text-[11px] font-bold mb-3 text-[#7D89A0]">Application Deadline</p>
              <p className="text-[18px] md:text-[26px] leading-none font-bold">10/04/2026</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pt-6 pb-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#0989D4] text-white'
                  : 'bg-white text-[#344054] border border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-colors ${
                activeTab === 'applied'
                  ? 'bg-[#0989D4] text-white'
                  : 'bg-white text-[#344054] border border-gray-300'
              }`}
            >
              Applied List
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#ff5327] text-white px-6 py-2.5 rounded-full text-[15px] font-medium shadow-sm">Inactive</button>
            <button className="inline-flex items-center gap-2 bg-white border border-[#D0D5DD] text-[#344054] px-6 py-2.5 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors">
              <img src={assets.edit} alt="Edit" className="w-5 h-5 object-contain" />
              Edit Details
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <ListCard title="Responsibilities" items={listItems} />
            <ListCard title="Eligibility Criteria" items={listItems} />
            <ListCard title="Skill" items={listItems} />

            <ListCard title="Skill Development Benefits" items={listItems} />
            <ListCard title="Supported Learning Recourse" items={listItems} />
            <TextCard title="Description" text={paraText} />

            <div className="xl:col-span-2">
              <TextCard title="Learning" text={paraText} />
            </div>
            <TextCard title="Certificate Availability" text={paraText} />
          </div>
        ) : (
          <AppliedListSection data={appliedListData} heading={appliedListHeading} />
        )}
      </section>
    </div>
  );
};




export default JobsProfile;
