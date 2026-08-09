import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const ComplaintDetails = () => {
  const { id } = useParams();
  const { label, t } = useLanguage();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaint = async () => {
      setError('');
      setLoading(true);

      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data.complaint);
      } catch (apiError) {
        setError(apiError.response?.data?.message || t('complaint.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  if (loading) {
    return <p className="text-sm text-slate-500">{t('complaint.loading')}</p>;
  }

  if (error) {
    return <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/dashboard" className="text-sm font-semibold text-civic-700">
        {t('complaint.backToDashboard')}
      </Link>

      <article className="card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-civic-700">
              {label('category', complaint.category)}
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">{complaint.title}</h1>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <p className="mt-6 whitespace-pre-wrap leading-7 text-slate-700">{complaint.description}</p>

        {complaint.imageUrl && (
          <img
            className="mt-6 max-h-96 w-full rounded-2xl object-cover"
            src={complaint.imageUrl}
            alt={complaint.title}
          />
        )}

        <dl className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-500">{t('complaint.priority')}</dt>
            <dd className="mt-1 text-slate-950">{label('priority', complaint.priority)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">{t('complaint.reportedBy')}</dt>
            <dd className="mt-1 text-slate-950">{complaint.createdBy?.name || t('complaint.unknown')}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">{t('complaint.address')}</dt>
            <dd className="mt-1 text-slate-950">{complaint.address || t('complaint.notProvided')}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">{t('complaint.coordinates')}</dt>
            <dd className="mt-1 text-slate-950">
              {complaint.coordinates?.lat && complaint.coordinates?.lng
                ? `${complaint.coordinates.lat}, ${complaint.coordinates.lng}`
                : t('complaint.notProvided')}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  );
};

export default ComplaintDetails;

