import { TbSearch } from "react-icons/tb";

export default function SearchSuggestions({
  items,
  onSelect,
}) {
  return (
    <div className="absolute top-full left-0 mt-2 w-full rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden z-50">
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-400 mb-2">
          Trending Searches
        </p>

        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <TbSearch className="text-gray-400" />
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}