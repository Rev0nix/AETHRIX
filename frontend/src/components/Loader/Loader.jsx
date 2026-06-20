const Loader = ({ full = false }) => {
  if (full) {
    return (
      <div className="fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center gap-5">
        <div className="font-display text-3xl tracking-[0.3em]">AETHRIX</div>
        <div className="w-40 h-px bg-white/10 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-accent animate-[loadbar_1.2s_ease-in-out_infinite]" style={{ width: '40%' }} />
        </div>
        <style>{`@keyframes loadbar{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}`}</style>
      </div>
    );
  }
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
