import { Link } from "react-router-dom";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Upload", to: "/upload" },
      { label: "Status", to: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Security", to: "/" },
      { label: "Compliance", to: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", to: "/" },
      { label: "Support", to: "/" },
      { label: "Contact", to: "/" },
    ],
  },
];

const SiteFooter = () => {
  return (
    <footer className="mx-auto mt-8 w-full max-w-7xl rounded-2xl border border-slate-300/20 bg-slate-950/45 p-5 md:p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-lg font-extrabold text-slate-50">
            DataVault<span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">X</span>
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-blue-100/75">
            Premium distributed storage infrastructure for secure, high-performance enterprise workloads.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200/70">{group.title}</h3>
            <ul className="mt-2 space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-blue-100/80 transition hover:text-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-3 text-xs text-blue-200/65">
        © {new Date().getFullYear()} DataVaultX. All rights reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;