type CaseFiltersProps = {
  currentFilter: 'all' | 'open' | 'closed';
  onFilterChange: (filter: 'all' | 'open' | 'closed') => void;
  totalCases: number;
  openCases: number;
  closedCases: number;
};

export function CaseFilters({
  currentFilter,
  onFilterChange,
  totalCases,
  openCases,
  closedCases,
}: CaseFiltersProps) {
  const filters = [
    { value: 'all' as const, label: 'All Cases', count: totalCases },
    { value: 'open' as const, label: 'Open', count: openCases },
    { value: 'closed' as const, label: 'Closed', count: closedCases },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentFilter === filter.value
              ? 'bg-brand-500 text-white'
              : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {filter.label}
          <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-xs">
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}
