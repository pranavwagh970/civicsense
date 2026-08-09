import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-civic-100 text-civic-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { language, label, t, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-civic-700">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-civic-600 text-white">CS</span>
          <span>
            {t('appName')}
            <span className="hidden text-xs font-semibold text-slate-500 sm:block">{t('appSubtitle')}</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            aria-label={t('nav.languageLabel')}
          >
            {language === 'mr' ? 'English' : 'मराठी'}
          </button>

          {isAuthenticated ? (
            <>
              <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} className={navLinkClass}>
                {user?.role === 'admin' ? t('nav.adminPanel') : t('nav.dashboard')}
              </NavLink>
              {user?.role === 'citizen' && (
                <NavLink to="/complaints/new" className={navLinkClass}>
                  {t('nav.newComplaint')}
                </NavLink>
              )}
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user?.name} · {label('roles', user?.role)}
              </span>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                {t('nav.login')}
              </NavLink>
              <Link to="/register" className="btn-primary">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
