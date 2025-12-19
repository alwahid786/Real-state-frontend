const Button = ({
  text,
  icon,
  color,
  bg,
  cn,
  onClick,
  children,
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full
        flex items-center justify-center gap-2 cursor-pointer
        rounded-md
        font-medium
        transition-all duration-200
        ${bg || "bg-primary"}
        ${color || "text-white"}
        hover:opacity-90
        ${cn}
      `}
      {...rest}
    >
      {icon && (
        <span className="text-lg leading-none flex items-center">{icon}</span>
      )}
      {children ? (
        children
      ) : (
        <span className="text-sm sm:text-base">{text}</span>
      )}
    </button>
  );
};

export default Button;
