export default function Button({ children, variant = "default", onClick, type = "button", disabled = false }) {
  const className = variant === "primary" 
    ? "neu-button primary" 
    : "neu-button";

  return (
    <button 
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </button>
  );
}