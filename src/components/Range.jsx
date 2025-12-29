export default function Range(props) {
  const { value, total, color = "bg-neutral-800 dark:bg-neutral-50" } = props;
  const percent = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="w-full h-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
      <div
        className={`h-full ${color} rounded-xl`}
        style={{ width: `${percent}%`, transition: "width 0.3s ease-in-out" }}
      />
    </div>
  );
}