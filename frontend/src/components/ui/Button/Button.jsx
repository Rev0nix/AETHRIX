export default function Button({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        bg-brand-black
        text-brand-white
        px-6
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        hover:bg-brand-gold
        hover:text-brand-black
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}