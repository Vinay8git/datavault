const Center = ({ children }) => {
  return (
    <main className="min-h-[72vh] w-full rounded-2xl border border-slate-400/20 bg-slate-950/30 p-3 md:p-4">
      {children}
    </main>
  );
};

export default Center;