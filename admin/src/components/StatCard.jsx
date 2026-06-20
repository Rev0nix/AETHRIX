const StatCard = ({ label, value, change }) => (
  <div className="bg-base-900 border border-white/5 p-6">
    <div className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">{label}</div>
    <div className="font-display text-4xl mb-1">{value}</div>
    {change && <div className="text-xs text-green-400/70">{change}</div>}
  </div>
);

export default StatCard;
