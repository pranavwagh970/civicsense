import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const features = t('home.features');
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <section className="grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="mb-4 inline-flex rounded-full bg-civic-100 px-4 py-1 text-sm font-semibold text-civic-700">
          {t('home.eyebrow')}
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{t('home.title')}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t('home.description')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={isAuthenticated ? dashboardPath : '/register'} className="btn-primary">
            {isAuthenticated ? t('home.primaryLoggedIn') : t('home.primaryLoggedOut')}
          </Link>
          <Link to="/login" className="btn-secondary">
            {t('home.secondary')}
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-slate-950">{t('home.cardTitle')}</h2>
        <div className="mt-5 grid gap-4">
          {features.map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
