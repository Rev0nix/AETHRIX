import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import SearchSuggestions from "./SearchSuggestions";

const trendingSearches = [
  "iPhone 16 Pro",
  "Samsung Galaxy S26",
  "MacBook Air M4",
  "Nike Air Max",
  "Gaming Laptop",
];

export default function SearchBar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (value) => {
    const search = value.trim();

    if (!search) return;

    navigate(`/shop?search=${encodeURIComponent(search)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative hidden lg:block w-[420px]">
      <div className="flex items-center bg-white rounded-xl overflow-hidden border border-gray-200">

        <TbSearch className="ml-4 text-gray-500" size={20} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() =>
            setTimeout(() => setShowSuggestions(false), 200)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
          placeholder="Search products, brands and more..."
          className="flex-1 px-3 py-3 outline-none text-gray-700"
        />
      </div>

      {showSuggestions && (
        <SearchSuggestions
          items={trendingSearches}
          onSelect={(item) => {
            setQuery(item);
            handleSearch(item);
          }}
        />
      )}
    </div>
  );
}