import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { CATEGORIES, STATUSES, useLanguage } from '../context/LanguageContext.jsx';

const AdminPanel = () => {
  const { label, t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const loadComplaints = async () => {
    const { data } = await api.get(`/complaints${queryString ? `?${queryString}` : ''}`);
    setComplaints(data.complaints);
  };

  const loadStats = async () => {
    const { data } = await api.get('/dashboard/stats');
    setStats(data);
  };

  useEffect(() => {
    const load = async () => {
      setError('');
      setLoading(true);

      try {
        await Promise.all([loadComplaints(), loadStats()]);
      } catch (apiError) {
        setError(apiError.response?.data?.message || t('adminPanel.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [queryString]);

  const handleFilterChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const { data } = await api.patch(`/complaints/${complaintId}/status`, { status });
      setComplaints((current) => current.map((item) => (item._id === complaintId ? data.complaint : item)));
      await loadStats();
    } catch (apiError) {
      setError(apiError.response?.data?.message || t('adminPanel.statusUpdateFailed'));
    }
  };

  const statusCount = (status) =>
    stats?.byStatus?.find((item) => item._id === status)?.count ||
    complaints.filter((complaint) => complaint.status === status).length;

  const categoryCount = (category) =>
    stats?.byCategory?.find((item) => item._id === category)?.count ||
    complaints.filter((complaint) => complaint.category === category).length;

  const totalComplaints = stats?.total ?? complaints.length;
  const highPriorityCount = complaints.filter((complaint) => complaint.priority === 'High').length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-civic-700 via-civic-600 to-sky-500 p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-civic-100">{t('adminPanel.eyebrow')}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t('adminPanel.title')}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50">{t('adminPanel.subtitle')}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 text-sm backdrop-blur">
            <p className="font-semibold">{t('adminPanel.demoArea')}</p>
            <p className="mt-1 text-blue-50">{t('adminPanel.demoAreaValue')}</p>
          </div>
        </div>
      </section>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <section className="grid gap-4 md:grid-cols-5">
        <div className="card md:col-span-1">
          <p className="text-sm font-medium text-slate-500">{t('adminPanel.total')}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{totalComplaints}</p>
        </div>
        {STATUSES.map((status) => (
          <div key={status} className="card">
            <p className="text-sm font-medium text-slate-500">{label('status', status)}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{statusCount(status)}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{t('adminPanel.complaintQueue')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('adminPanel.queueSubtitle')}</p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
                {t('adminPanel.highPriority')}: {highPriorityCount}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
              <input
                className="input"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t('dashboard.searchPlaceholder')}
              />
              <select className="input" name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">{t('dashboard.allStatuses')}</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {label('status', status)}
                  </option>
                ))}
              </select>
              <select className="input" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">{t('dashboard.allCategories')}</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {label('category', category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card overflow-hidden p-0">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">{t('dashboard.loading')}</p>
            ) : complaints.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">{t('dashboard.empty')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">{t('dashboard.table.complaint')}</th>
                      <th className="px-5 py-3">{t('dashboard.table.category')}</th>
                      <th className="px-5 py-3">{t('dashboard.table.priority')}</th>
                      <th className="px-5 py-3">{t('dashboard.table.citizen')}</th>
                      <th className="px-5 py-3">{t('dashboard.table.status')}</th>
                      <th className="px-5 py-3">{t('dashboard.table.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {complaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td className="px-5 py-4">
                          <Link
                            to={`/complaints/${complaint._id}`}
                            className="font-semibold text-slate-950 hover:text-civic-700"
                          >
                            {complaint.title}
                          </Link>
                          <p className="mt-1 line-clamp-1 text-slate-500">{complaint.address || complaint.description}</p>
                        </td>
                        <td className="px-5 py-4">{label('category', complaint.category)}</td>
                        <td className="px-5 py-4">{label('priority', complaint.priority)}</td>
                        <td className="px-5 py-4">{complaint.createdBy?.name || t('complaint.unknown')}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td className="px-5 py-4">
                          <select
                            className="input min-w-36"
                            value={complaint.status}
                            onChange={(event) => handleStatusUpdate(complaint._id, event.target.value)}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {label('status', status)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-950">{t('adminPanel.categoryBreakdown')}</h2>
            <div className="mt-5 space-y-3">
              {CATEGORIES.map((category) => {
                const count = categoryCount(category);
                const percent = totalComplaints ? Math.round((count / totalComplaints) * 100) : 0;

                return (
                  <div key={category}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{label('category', category)}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-civic-600" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-slate-950">{t('adminPanel.workflowTitle')}</h2>
            <div className="mt-5 space-y-3">
              {STATUSES.map((status, index) => (
                <div key={status} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black text-civic-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{label('status', status)}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default AdminPanel;

