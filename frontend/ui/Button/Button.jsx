import clsx from "clsx";

const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white",

  secondary:
    "bg-white border border-gray-300 hover:bg-gray-100",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",

  ghost:
    "hover:bg-gray-100",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={clsx(
        "px-5 py-2.5 rounded-xl font-medium transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}