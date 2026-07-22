import { useState } from "react";
import api from "../services/api";

export default function AutoImport() {

  const [query, setQuery] = useState("");
  const [productUrl, setProductUrl] = useState("");
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

  const importProduct = async (url) => {
    try {

      await api.post("/products/import-product", {
        url,
      });

      alert("Product Imported Successfully!");

    } catch (err) {

      alert("Import Failed");

    }
  };

  return (
    <div className="p-8">

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Universal Product Import
        </h1>

        <p className="text-white/60 mt-2">
          Import products from supported shopping websites.
        </p>

      </div>

      <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">

        <h2 className="text-xl font-semibold mb-5">
          Import Using Product URL
        </h2>

        <div className="flex gap-4">

          <input
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="Paste Amazon, Flipkart, Myntra, Ajio, Apple, Samsung URL..."
            className="flex-1 rounded-lg border border-white/10 bg-black px-4 py-3"
          />

          <button
            onClick={() => importProduct(productUrl)}
            className="bg-blue-600 hover:bg-blue-700 px-6 rounded-lg"
          >
            Import
          </button>

        </div>

        <div className="flex flex-wrap gap-3 mt-5 text-sm text-white/60">

          <span>🟡 Amazon</span>
          <span>🔵 Flipkart</span>
          <span>🟣 Myntra</span>
          <span>⚫ Ajio</span>
          <span>🍎 Apple</span>
          <span>📱 Samsung</span>

        </div>

      </div>

      <div className="flex gap-3 mb-8">

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
              onClick={() =>
                importProduct(`https://www.amazon.in/dp/${item.asin}`)
              }
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