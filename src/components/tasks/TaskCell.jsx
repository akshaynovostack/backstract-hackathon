export default function TaskCell({ value, data }) {
  return (
    <div className="flex items-center gap-2 p-2">
      <input type="checkbox" className="rounded" />
      <div>
        <div className="font-medium">{value}</div>
        {data.description && (
          <div className="text-sm text-gray-500 truncate">
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
}
