import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const { label, t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    adminSecret: '',
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
      const registeredUser = await register(form);
      navigate(registeredUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">{t('auth.registerTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('auth.registerSubtitle')}</p>
        </div>

        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <label className="block space-y-1.5">
          <span className="label">{t('auth.name')}</span>
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label className="block space-y-1.5">
          <span className="label">{t('auth.email')}</span>
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className="block space-y-1.5">
          <span className="label">{t('auth.password')}</span>
          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="label">{t('auth.role')}</span>
          <select className="input" name="role" value={form.role} onChange={handleChange}>
            <option value="citizen">{label('roles', 'citizen')}</option>
            <option value="admin">{label('roles', 'admin')}</option>
          </select>
        </label>

        {form.role === 'admin' && (
          <label className="block space-y-1.5">
            <span className="label">{t('auth.adminCode')}</span>
            <input
              className="input"
              name="adminSecret"
              value={form.adminSecret}
              onChange={handleChange}
              placeholder={t('auth.adminCodePlaceholder')}
            />
          </label>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? t('auth.creating') : t('auth.createButton')}
        </button>

        <p className="text-center text-sm text-slate-500">
          {t('auth.alreadyRegistered')}{' '}
          <Link to="/login" className="font-semibold text-civic-700">
            {t('auth.loginButton')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
