export default function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label style={{ 
          display: "block", 
          marginBottom: "6px", 
          fontWeight: 500,
          color: "var(--text-secondary)",
          fontSize: "14px"
        }}>
          {label}
        </label>
      )}
      <select className="neu-select" {...props}>
        {children}
      </select>
    </div>
  );
}