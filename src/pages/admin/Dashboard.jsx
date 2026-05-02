// import DynamicTable from '../../common/DynamicTable';
// import { assets } from '../../assets/assets';

// const Dashboard = () => {

//   const metricCards = [
//     { key: 'companies', title: 'Total Companies', value: '150', delta: '20', deltaSuffix: 'This month', highlighted: true },
//     { key: 'college', title: 'Total College', value: '250', delta: '15', deltaSuffix: 'This month' },
//     { key: 'competition', title: 'Active Competition', value: '50', delta: '15', deltaSuffix: 'This month' },
//     { key: 'conference', title: 'Active Conference', value: '50', delta: '₹50,500', deltaSuffix: 'This month' },
//     { key: 'events', title: 'Active Events', value: '136', delta: '10', deltaSuffix: 'This month' },
//     { key: 'seminar', title: 'Active Seminar', value: '55', delta: '5', deltaSuffix: 'This month' },
//     { key: 'internship', title: 'Active Internship', value: '30', delta: '9', deltaSuffix: 'This month' },
//     { key: 'freelance', title: 'Active Freelance', value: '30', delta: '9', deltaSuffix: 'This month' },
//   ];

//   const companyColumns = [
//     { title: '#', dataIndex: 'id', key: 'id' },
//     { title: 'Company Name', dataIndex: 'name', key: 'name' },
//     { title: 'Industry', dataIndex: 'industry', key: 'industry' },
//     { title: 'Contact Person', dataIndex: 'contact', key: 'contact' },
//     { title: 'Mobile Number', dataIndex: 'mobile', key: 'mobile' },
//     { title: 'Mail Id', dataIndex: 'mail', key: 'mail' },
//     { title: 'Location', dataIndex: 'location', key: 'location' },
//   ];

//   const companyRows = [
//     { id: '01', name: 'Solaris Energy', industry: 'Renewable Energy', contact: 'Kavita', mobile: '9223344556', mail: 'contact@solarisenergy.com', location: 'Jaipur' },
//     { id: '02', name: 'GreenTech Solutions', industry: 'Environmental', contact: 'Maya', mobile: '9876543210', mail: 'contact@greentech.com', location: 'Chennai' },
//     { id: '03', name: 'EduSmart', industry: 'Education', contact: 'Ravi', mobile: '9123456789', mail: 'info@edusmart.edu', location: 'Bangalore' },
//     { id: '04', name: 'HealthPlus', industry: 'Healthcare', contact: 'Anjali', mobile: '9988776655', mail: 'support@healthplus.com', location: 'Hyderabad' },
//     { id: '05', name: 'FinServe', industry: 'Finance', contact: 'Suresh', mobile: '9001234567', mail: 'hello@finserve.com', location: 'Mumbai' },
//   ];

  
//   return (
//     <div className="space-y-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
//         {metricCards.map((card) => {
//           const isHighlighted = card.highlighted;
//           return (
//             <div
//               key={card.key}
//               className={`rounded-[24px] border p-5  flex flex-col justify-between ${
//                 isHighlighted
//                   ? 'bg-[linear-gradient(180deg,_#0989D4_0%,_#0E8CD6_100%)] border-transparent text-white'
//                   : 'bg-white border-[#EAECF0] text-primary'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <h3 className={`text-[20px] font-semibold leading-[100%] ${isHighlighted ? 'text-white' : 'text-primary'}`}>
//                   {card.title}
//                 </h3>
//                 <span className={`w-9 h-9 rounded-[12px] inline-flex items-center justify-center ${isHighlighted ? 'bg-white/20' : 'bg-[#F2F4F7]'}`}>
//                   {isHighlighted ? (
//                     <img src={assets.up_i} alt="" />
//                   ) : (
//                     <img src={assets.down_i}/>
//                   )}
//                 </span>
//               </div>


//               <div className="mt-2">
//                 <p className={`text-[35px] font-bold leading-[1] ${isHighlighted ? 'text-white' : 'text-[#101828]'}`}>{card.value}</p>
//                 <div className="mt-3 flex items-center gap-2">
//                   <span className={`px-3 py-1 rounded-full text-[14px] font-semibold leading-none ${
//                     isHighlighted ? 'bg-white/20 text-white' : 'bg-[#FEECEC] text-[#F04438]'
//                   }`}>
//                     {card.delta}
//                   </span>
//                   <span className={`text-[14px] font-medium ${isHighlighted ? 'text-[#EAF6FF]' : 'text-[#667085]'}`}>
//                     {card.deltaSuffix}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <section className="rounded-[24px] border border-[#EAECF0] bg-white p-4">
//         <h2 className="text-[20px] font-semibold text-primary mb-2">Company</h2>
//         <DynamicTable
//           columns={companyColumns}
//           dataSource={companyRows}
//           rowKey="id"
//           showPagination={false}
//           plain={true}
//         />
//       </section>
//     </div>
//   );
// };

// export default Dashboard;



import { useEffect, useState } from 'react';
import DynamicTable from '../../common/DynamicTable';
import { assets } from '../../assets/assets';
import { apiGetAdminDashboard } from '../../services/admin/adminServices';
import setFileName from '../../utils/setFileName';

// ─── tiny helper ────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ─── Component ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestCompanies, setLatestCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiGetAdminDashboard();
      console.log(res)
      if (!res.success) throw new Error(res.message);
      setStats(res.data.stats);
      setLatestCompanies(res.data.latestCompanies);

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  // ── Metric card config (maps to API stats keys) ───────────────────────────
  const metricCards = [
    { key: 'companies',    title: 'Total Companies',     highlighted: true },
    { key: 'colleges',     title: 'Total College' },
    { key: 'competitions', title: 'Active Competition' },
    { key: 'conferences',  title: 'Active Conference' },
    { key: 'events',       title: 'Active Events' },
    { key: 'seminars',     title: 'Active Seminar' },
    { key: 'internships',  title: 'Active Internship' },
    { key: 'freelances',   title: 'Active Freelance' },
  ];

  // ── Table columns ─────────────────────────────────────────────────────────
  const companyColumns = [
    { title: '#',               dataIndex: 'index',              key: 'index' },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, row) => (
        <div className="flex items-center gap-2">
          {row.companyLogo ? (
            <img
              src={setFileName(row.companyLogo)}
              alt={text}
              className="w-8 h-8 rounded-full object-cover border border-gray-100"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {text?.[0] ?? '?'}
            </span>
          )}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    { title: 'Industry',        dataIndex: 'companyType',        key: 'companyType' },
    { title: 'Contact Person',  dataIndex: 'contactPersonName',  key: 'contactPersonName' },
    { title: 'Location',        dataIndex: 'city',               key: 'city' },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) =>
        v
          ? new Date(v).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—',
    },
  ];

  // Add a 1-based index to each row for the "#" column
  const companyRows = latestCompanies.map((c, i) => ({
    ...c,
    index: `0${i + 1}`,
    id: c._id,
  }));

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 font-medium">
        ⚠️ {error}
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const isHighlighted = card.highlighted;
          const data = stats?.[card.key];

          return (
            <div
              key={card.key}
              className={`rounded-[24px] border p-5 flex flex-col justify-between ${
                isHighlighted
                  ? 'bg-[linear-gradient(180deg,_#0989D4_0%,_#0E8CD6_100%)] border-transparent text-white'
                  : 'bg-white border-[#EAECF0] text-primary'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3
                  className={`text-[20px] font-semibold leading-[100%] ${
                    isHighlighted ? 'text-white' : 'text-primary'
                  }`}
                >
                  {card.title}
                </h3>
                <span
                  className={`w-9 h-9 rounded-[12px] inline-flex items-center justify-center ${
                    isHighlighted ? 'bg-white/20' : 'bg-[#F2F4F7]'
                  }`}
                >
                  <img
                    src={isHighlighted ? assets.up_i : assets.down_i}
                    alt=""
                  />
                </span>
              </div>

              {/* Value + delta */}
              <div className="mt-2">
                {loading || !data ? (
                  <>
                    <Skeleton className="h-9 w-16 mb-3" />
                    <Skeleton className="h-6 w-28" />
                  </>
                ) : (
                  <>
                    <p
                      className={`text-[35px] font-bold leading-[1] ${
                        isHighlighted ? 'text-white' : 'text-[#101828]'
                      }`}
                    >
                      {data.total}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[14px] font-semibold leading-none ${
                          isHighlighted
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FEECEC] text-[#F04438]'
                        }`}
                      >
                        +{data.thisMonth}
                      </span>
                      <span
                        className={`text-[14px] font-medium ${
                          isHighlighted ? 'text-[#EAF6FF]' : 'text-[#667085]'
                        }`}
                      >
                        This month
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Latest Companies Table ── */}
      <section className="rounded-[24px] border border-[#EAECF0] bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold text-primary">
            Latest Companies
          </h2>
          <span className="text-sm text-[#667085]">5 most recent</span>
        </div>

        {loading ? (
          <div className="space-y-3 py-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <DynamicTable
            columns={companyColumns}
            dataSource={companyRows}
            rowKey="id"
            showPagination={false}
            plain={true}
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
