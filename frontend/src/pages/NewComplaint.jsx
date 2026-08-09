import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { CATEGORIES, PRIORITIES, useLanguage } from '../context/LanguageContext.jsx';

const NewComplaint = () => {
  const navigate = useNavigate();
  const { label, t } = useLanguage();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Road',
    priority: 'Medium',
    address: '',
    lat: '',
    lng: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/complaints', form);
      navigate(`/complaints/${data.complaint._id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || t('complaint.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-civic-700">{t('complaint.citizenReport')}</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">{t('complaint.submitTitle')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('complaint.submitSubtitle')}</p>
        </div>

        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <label className="block space-y-1.5">
          <span className="label">{t('complaint.title')}</span>
          <input
            className="input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={t('complaint.titlePlaceholder')}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="label">{t('complaint.description')}</span>
          <textarea
            className="input min-h-36"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={t('complaint.descriptionPlaceholder')}
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="label">{t('complaint.category')}</span>
            <select className="input" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {label('category', category)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="label">{t('complaint.priority')}</span>
            <select className="input" name="priority" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {label('priority', priority)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="label">{t('complaint.address')}</span>
          <input
            className="input"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder={t('complaint.addressPlaceholder')}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="label">{t('complaint.latitude')}</span>
            <input className="input" name="lat" value={form.lat} onChange={handleChange} placeholder={t('complaint.optional')} />
          </label>
          <label className="block space-y-1.5">
            <span className="label">{t('complaint.longitude')}</span>
            <input className="input" name="lng" value={form.lng} onChange={handleChange} placeholder={t('complaint.optional')} />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="label">{t('complaint.imageUrl')}</span>
          <input
            className="input"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder={t('complaint.imageUrlPlaceholder')}
          />
        </label>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? t('complaint.submitting') : t('complaint.submitButton')}
        </button>
      </form>
    </div>
  );
};

export default NewComplaint;

