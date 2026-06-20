import { AnimatePresence, motion } from 'framer-motion';
import { TbX } from 'react-icons/tb';

const SIZES = [
  { size: 'S', chest: '36-38', length: '27' },
  { size: 'M', chest: '39-41', length: '28' },
  { size: 'L', chest: '42-44', length: '29' },
  { size: 'XL', chest: '45-47', length: '30' },
  { size: 'XXL', chest: '48-50', length: '31' },
];

const SizeGuide = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[210]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[211] bg-base-900 border border-white/10 p-8 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-display text-2xl tracking-wider">SIZE GUIDE</span>
              <button onClick={onClose} className="text-white/50 hover:text-white text-xl">
                <TbX />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/10">
                  <th className="text-left py-2">Size</th>
                  <th className="text-left py-2">Chest (in)</th>
                  <th className="text-left py-2">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row) => (
                  <tr key={row.size} className="border-b border-white/5">
                    <td className="py-3 font-semibold">{row.size}</td>
                    <td className="py-3 text-white/60">{row.chest}</td>
                    <td className="py-3 text-white/60">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-white/30 mt-4">Measurements are approximate. For the best fit, compare with a similar garment you own.</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeGuide;
