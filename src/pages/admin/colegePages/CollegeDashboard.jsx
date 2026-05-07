import { useEffect, useState } from 'react';
import DynamicTable from '../../../common/DynamicTable';
import { assets } from '../../../assets/assets';
import { apiGetCollegeDashboard } from '../../../services/collegeServices';
import { useTitle } from '../../../context/AdminTitle';

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ─── Component ───────────────────────────────────────────────────────────────
const CollegeDashboard = () => {
  const [stats, setStats]                   = useState(null);
  const [lastRegistrations, setLastRegistrations] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
 const {setTitle}=useTitle()
  useEffect(()=>{
setTitle("Dashboard")
  },[])
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await apiGetCollegeDashboard();
        console.log(res);
        if (!res.status) throw new Error(res.message);
        setStats(res?.data?.stats);
        setLastRegistrations(res?.data?.lastRegistrations);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ── Metric card config ────────────────────────────────────────────────────
  const metricCards = [
    { key: 'conferences',  title: 'Total Conferences',  highlighted: true },
    { key: 'competitions', title: 'Total Competitions' },
    { key: 'seminars',     title: 'Total Seminars' },
    { key: 'events',       title: 'Total Events' },
  ];

  // ── Table columns ─────────────────────────────────────────────────────────
  const registrationColumns = [
    { title: '#',           dataIndex: 'index',       key: 'index' },
    {
      title: 'Student',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => (
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {text?.[0] ?? '?'}
          </span>
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    { title: 'Department',  dataIndex: 'department',  key: 'department' },
    { title: 'College',     dataIndex: 'collegeName', key: 'collegeName' },
    { title: 'Year',        dataIndex: 'year',        key: 'year' },
    { title: 'Event Type',  dataIndex: 'eventType',   key: 'eventType',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${v === 'Conference'  ? 'bg-blue-100 text-blue-700'   :
            v === 'Competition' ? 'bg-orange-100 text-orange-700' :
            v === 'Seminar'     ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'}`}>
          {v}
        </span>
      ),
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) =>
        v
          ? new Date(v).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
          : '—',
    },
  ];

  // ── Table rows ────────────────────────────────────────────────────────────
  const registrationRows = lastRegistrations.map((r, i) => ({
    ...r,
    index: `0${i + 1}`,
    id: r._id,
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
                <h3 className={`text-[20px] font-semibold leading-[100%] ${
                  isHighlighted ? 'text-white' : 'text-primary'
                }`}>
                  {card.title}
                </h3>
                <span className={`w-9 h-9 rounded-[12px] inline-flex items-center justify-center ${
                  isHighlighted ? 'bg-white/20' : 'bg-[#F2F4F7]'
                }`}>
                  <img src={isHighlighted ? assets.up_i : assets.down_i} alt="" />
                </span>
              </div>

              {/* Value + active badge */}
              <div className="mt-2">
                {loading || !data ? (
                  <>
                    <Skeleton className="h-9 w-16 mb-3" />
                    <Skeleton className="h-6 w-28" />
                  </>
                ) : (
                  <>
                    <p className={`text-[35px] font-bold leading-[1] ${
                      isHighlighted ? 'text-white' : 'text-[#101828]'
                    }`}>
                      {data.total}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[14px] font-semibold leading-none ${
                        isHighlighted
                          ? 'bg-white/20 text-white'
                          : 'bg-[#ECFDF3] text-[#027A48]'
                      }`}>
                        {data.active} Active
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Latest Registrations Table ── */}
      <section className="rounded-[24px] border border-[#EAECF0] bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[20px] font-semibold text-primary">
            Latest Registrations
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
            columns={registrationColumns}
            dataSource={registrationRows}
            rowKey="id"
            showPagination={false}
            plain={true}
          />
        )}
      </section>
    </div>
  );
};

export default CollegeDashboard;