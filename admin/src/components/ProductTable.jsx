const ProductTable = ({ products, onEdit, onDelete }) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-[10px] tracking-[0.15em] uppercase text-white/25 border-b border-white/5">
        <th className="text-left py-3 px-6">Product</th>
        <th className="text-left py-3 px-6">Category</th>
        <th className="text-left py-3 px-6">Price</th>
        <th className="text-left py-3 px-6">Stock</th>
        <th className="text-left py-3 px-6">Status</th>
        <th className="text-left py-3 px-6">Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((p) => (
        <tr key={p._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
          <td className="py-3 px-6">{p.name}</td>
          <td className="py-3 px-6 capitalize text-white/50">{p.category?.replace('-', ' ')}</td>
          <td className="py-3 px-6">₹{p.price?.toLocaleString('en-IN')}</td>
          <td className="py-3 px-6">{p.stock}</td>
          <td className="py-3 px-6">
            <span className={`text-[10px] uppercase px-2.5 py-1 rounded ${p.isActive ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
              {p.isActive ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="py-3 px-6 flex gap-3">
            <button onClick={() => onEdit(p)} className="text-accent-glow text-xs">Edit</button>
            <button onClick={() => onDelete(p)} className="text-red-400/70 text-xs">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductTable;
