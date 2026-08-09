import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      const loggedInUser = await login(form);
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">{t('auth.loginTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('auth.loginSubtitle')}</p>
        </div>

        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

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
            required
          />
        </label>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.loginButton')}
        </button>

        <p className="text-center text-sm text-slate-500">
          {t('auth.newHere')}{' '}
          <Link to="/register" className="font-semibold text-civic-700">
            {t('auth.createAccount')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
