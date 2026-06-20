const Topbar = ({ title, action }) => {
  return (
    <div className="flex justify-between items-center mb-9">
      <div className="font-display text-4xl tracking-wider">{title}</div>
      {action}
    </div>
  );
};

export default Topbar;
