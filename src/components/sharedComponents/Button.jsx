
const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";

  const variants = {
    primary: "bg-red-700 text-white hover:bg-red-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border-2 border-red-700 text-red-700 hover:bg-red-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
