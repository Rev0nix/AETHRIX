const ProductTable = ({
  products,
  onEdit,
  onDelete,
  selected,
  toggleSelect,
  toggleSelectAll,
}) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-[10px] tracking-[0.15em] uppercase text-white/25 border-b border-white/5">
        <th className="py-3 px-4">
          <input
            type="checkbox"
            checked={
              products.length > 0 && selected.length === products.length
            }
            onChange={toggleSelectAll}
          />
        </th>

        <th className="text-left py-3 px-6">Stock</th>
        <th className="text-center py-3 px-4">Featured</th>
        <th className="text-center py-3 px-4">Deal</th>
        <th className="text-center py-3 px-4">Flash</th>
        <th className="text-left py-3 px-6">Status</th>
        <th className="text-left py-3 px-6">Actions</th>
      </tr>
    </thead>

    <tbody>
      {products.map((p) => (
        <tr
          key={p._id}
          className="border-b border-white/[0.03] hover:bg-white/[0.02]"
        >
          {/* Checkbox */}
          <td className="py-3 px-4">
            <input
              type="checkbox"
              checked={selected.includes(p._id)}
              onChange={() => toggleSelect(p._id)}
            />
          </td>

          {/* Product */}
          <td className="py-3 px-6">
            <div className="flex items-center gap-4">
              <img
                src={p.images?.[0]?.url || "https://placehold.co/60x60"}
                alt={p.name}
                className="w-14 h-14 object-cover rounded-lg border border-white/10"
              />

              <div>
                <div className="font-medium">{p.name}</div>

                <div className="text-xs text-white/40">
                  SKU: {p._id.slice(-8).toUpperCase()}
                </div>

                {p.badge && (
                  <div className="mt-1">
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </td>

          {/* Category */}
          <td className="py-3 px-6 capitalize text-white/50">
            {p.category?.replace("-", " ")}
          </td>

          {/* Price */}
          <td className="py-3 px-6">
            ₹{p.price?.toLocaleString("en-IN")}
          </td>

          {/* Stock */}
          <td className="py-3 px-6">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${p.stock > 20
                ? "bg-green-500/20 text-green-400"
                : p.stock > 5
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
                }`}
            >
              {p.stock > 20
                ? `${p.stock} In Stock`
                : p.stock > 5
                  ? `${p.stock} Low Stock`
                  : `${p.stock} Out`}
            </span>
          </td>

          <td className="py-3 px-4 text-center">
            {p.isFeatured ? "⭐" : "—"}
          </td>

          <td className="py-3 px-4 text-center">
            {p.todaysDeal ? "🎯" : "—"}
          </td>

          <td className="py-3 px-4 text-center">
            {p.isFlashSale ? "🔥" : "—"}
          </td>

          {/* Status */}
          <td className="py-3 px-6">
            <span
              className={`text-[10px] uppercase px-2.5 py-1 rounded ${p.isActive
                ? "bg-green-500/10 text-green-400"
                : "bg-white/5 text-white/30"
                }`}
            >
              {p.isActive ? "🟢 Active" : "⚫ Inactive"}
            </span>
          </td>

          {/* Actions */}
          <td className="py-3 px-6">
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(p)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(p)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductTable;