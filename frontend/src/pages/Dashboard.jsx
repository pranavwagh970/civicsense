import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORIES, STATUSES, useLanguage } from '../context/LanguageContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const { label, t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

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
    if (!isAdmin) return;
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
        setError(apiError.response?.data?.message || t('dashboard.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [queryString, isAdmin]);

  const handleFilterChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const { data } = await api.patch(`/complaints/${complaintId}/status`, { status });
      setComplaints((current) => current.map((item) => (item._id === complaintId ? data.complaint : item)));
      await loadStats();
    } catch (apiError) {
      setError(apiError.response?.data?.message || t('dashboard.statusUpdateFailed'));
    }
  };

  const statusCount = (status) =>
    stats?.byStatus?.find((item) => item._id === status)?.count ||
    complaints.filter((complaint) => complaint.status === status).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-civic-700">
            {isAdmin ? t('dashboard.adminWorkspace') : t('dashboard.citizenWorkspace')}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">
            {isAdmin ? t('dashboard.adminTitle') : t('dashboard.citizenTitle')}
          </h1>
        </div>
        {!isAdmin && (
          <Link to="/complaints/new" className="btn-primary">
            {t('dashboard.submitComplaint')}
          </Link>
        )}
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-4">
        {STATUSES.map((status) => (
          <div key={status} className="card">
            <p className="text-sm font-medium text-slate-500">{label('status', status)}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{statusCount(status)}</p>
          </div>
        ))}
      </div>

      <div className="card">
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
                  <th className="px-5 py-3">{t('dashboard.table.status')}</th>
                  <th className="px-5 py-3">{t('dashboard.table.priority')}</th>
                  {isAdmin && <th className="px-5 py-3">{t('dashboard.table.citizen')}</th>}
                  <th className="px-5 py-3">{t('dashboard.table.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td className="px-5 py-4">
                      <Link to={`/complaints/${complaint._id}`} className="font-semibold text-slate-950 hover:text-civic-700">
                        {complaint.title}
                      </Link>
                      <p className="mt-1 line-clamp-1 text-slate-500">{complaint.address || complaint.description}</p>
                    </td>
                    <td className="px-5 py-4">{label('category', complaint.category)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-5 py-4">{label('priority', complaint.priority)}</td>
                    {isAdmin && <td className="px-5 py-4">{complaint.createdBy?.name || t('complaint.unknown')}</td>}
                    <td className="px-5 py-4">
                      {isAdmin ? (
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
                      ) : (
                        <Link to={`/complaints/${complaint._id}`} className="font-semibold text-civic-700">
                          {t('dashboard.table.view')}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

