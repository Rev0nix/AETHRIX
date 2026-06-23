import { useState } from "react";
import api from "../services/api";

export default function AutoImport() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/search-import/amazon?q=${encodeURIComponent(query)}`
      );

      setResults(res.data.data);

    } catch (err) {
      alert("Search failed");
      console.log(err);
    }

    setLoading(false);
  };

  const importProduct = async (asin) => {
    try {

      await api.post("/import/amazon", {
        url: `https://www.amazon.in/dp/${asin}`
      });

      alert("Product Imported Successfully!");

    } catch (err) {

      alert("Import Failed");

    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Amazon Auto Import
      </h1>

      <div className="flex gap-3 mb-8">

        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Search product..."
          className="bg-black border border-white/20 p-3 rounded w-96"
        />

        <button
          onClick={searchProducts}
          className="bg-blue-600 px-5 rounded"
        >
          Search
        </button>

      </div>

      {loading && <p>Loading...</p>}

      <div className="grid md:grid-cols-3 gap-6">

        {results.map((item) => (

          <div
            key={item.asin}
            className="border border-white/10 rounded-xl p-4 bg-white/5"
          >

            <img
              src={item.image}
              alt=""
              className="h-56 w-full object-cover rounded"
            />

            <h2 className="mt-4 font-bold">
              {item.title}
            </h2>

            <p className="text-green-400 mt-2">
              ₹{item.price?.value}
            </p>

            <button
              onClick={() => importProduct(item.asin)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-4"
            >
              Import Product
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}