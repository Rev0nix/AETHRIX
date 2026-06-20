const ITEMS = [
  'FREE SHIPPING ABOVE ₹999',
  'PREMIUM QUALITY GUARANTEED',
  '7 DAY RETURNS',
  'NEW DROPS WEEKLY',
  'WORLDWIDE DELIVERY',
];

const Marquee = () => {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="bg-accent py-3 overflow-hidden">
      <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white">{item}</span>
            <span className="text-white/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
