interface ButtonProps {
  className?: string;
  onClick: () => unknown;
  text: string;
  color?: "success" | "danger" | "primary" | "disabled";
  disabled?: boolean;
}

const Button = ({ className, onClick, text, color, disabled }: ButtonProps) => {
  if (disabled === undefined || disabled === null) disabled = false;
  if (!className) className = "";
  let colorClass;
  if (color === "success")
    colorClass = "bg-green-200 shadow-md hover:bg-green-300";
  else if (color === "danger")
    colorClass = "bg-red-200 shadow-md hover:bg-red-300";
  else if (color === "primary")
    colorClass = "bg-purple-200 shadow-md hover:bg-purple-300";
  else if (color === "disabled")
    colorClass = "bg-slate-300 shadow-md hover:bg-slate-300";
  else colorClass = "bg-purple-200 shadow-md hover:bg-purple-300";

  return (
    <button
      className={`p-2 mt-1 mb-1 rounded-md shadow-md ${colorClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
