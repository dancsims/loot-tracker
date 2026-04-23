export function ThemeToggle({
  mode,
  onToggle,
}: {
  mode: "light" | "dark";
  onToggle: () => void;
}) {
  return (
    <button
      className="btn sm"
      title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{ minWidth: 36 }}
      onClick={onToggle}
      aria-label="Toggle light/dark mode"
    >
      {mode === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
