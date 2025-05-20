export default function Spinner({ size = "md" }) {
  const sizeClass = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg"
  }[size];

  return (
    <div className={`spinner-border ${sizeClass}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}