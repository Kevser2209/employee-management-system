import { LEAVE_STATUS_FILTERS } from "../../utils/managementFilters";

function StatusFilter({ value, onChange, options = LEAVE_STATUS_FILTERS }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value || "all"}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            value === option.value
              ? "bg-slate-900 text-white"
              : "border border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default StatusFilter;
