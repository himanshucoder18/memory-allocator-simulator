export default function Card({ children, className = "" }) {
  return (
    <div className={`neu-card ${className}`}>
      {children}
    </div>
  );
}