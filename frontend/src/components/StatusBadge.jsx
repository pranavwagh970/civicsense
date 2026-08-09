import { useLanguage } from '../context/LanguageContext.jsx';

const styles = {
  Pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  'In Review': 'bg-blue-100 text-blue-800 ring-blue-200',
  Resolved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Rejected: 'bg-rose-100 text-rose-800 ring-rose-200',
};

const StatusBadge = ({ status }) => {
  const { label } = useLanguage();

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] || styles.Pending}`}>
      {label('status', status)}
    </span>
  );
};

export default StatusBadge;

