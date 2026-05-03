import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  ShieldCheck,
  Globe2,
  Zap,
  ArrowRight,
  Lock,
  Server,
  HardDrive,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Why Us", href: "#why-us" },
  { label: "Architecture", href: "#architecture" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
];

const trustPoints = [
  "End-to-end encrypted object storage",
  "Multi-region distributed replication",
  "Enterprise-grade observability and access control",
];

const heroStats = [
  { value: "99.99%", label: "Platform Uptime" },
  { value: "<120ms", label: "Edge Access Latency" },
  { value: "14+", label: "Regions Replicated" },
  { value: "AES-256", label: "Encryption Standard" },
];

const whyChooseCards = [
  {
    title: "Distributed by Design",
    description:
      "Data is replicated across multiple regions with intelligent placement to reduce outage risk and improve global resilience.",
    stat: "14+ Regions",
  },
  {
    title: "Security First",
    description:
      "Encryption at rest and in transit, role-aware controls, and auditable access patterns built for enterprise trust.",
    stat: "AES-256 + TLS",
  },
  {
    title: "Performance at Scale",
    description:
      "Low-latency edge retrieval and optimized upload orchestration for high-throughput production workloads.",
    stat: "<120ms Avg",
  },
];

const featureGrid = [
  {
    icon: "🛡️",
    title: "Zero-Trust Access",
    text: "Session-aware authentication and strict policy enforcement for every storage interaction.",
  },
  {
    icon: "🧠",
    title: "Smart Replication",
    text: "Adaptive object replication strategy that prioritizes durability and regional performance.",
  },
  {
    icon: "⚡",
    title: "Fast Object Delivery",
    text: "Optimized read path for globally distributed users and latency-sensitive applications.",
  },
  {
    icon: "🔒",
    title: "Private by Default",
    text: "Security posture designed around least-privilege data access and protected transfer channels.",
  },
  {
    icon: "📈",
    title: "Elastic Scalability",
    text: "Seamlessly handle growth from early-stage teams to enterprise-grade traffic volumes.",
  },
  {
    icon: "📜",
    title: "Audit-Ready Operations",
    text: "Clear operational traceability and governance-friendly controls for regulated environments.",
  },
];

const workflowSteps = [
  {
    id: "01",
    title: "Ingest & Verify",
    description:
      "Client uploads are validated, encrypted, and session-tagged before entering the replication pipeline.",
  },
  {
    id: "02",
    title: "Distribute & Replicate",
    description:
      "Objects are distributed across multiple nodes/regions with policy-aware redundancy rules.",
  },
  {
    id: "03",
    title: "Index & Govern",
    description:
      "Metadata indexing, access controls, and audit events are attached for secure retrieval and compliance.",
  },
  {
    id: "04",
    title: "Serve & Observe",
    description:
      "Low-latency retrieval is routed through optimized access paths with operational telemetry in real time.",
  },
];

const reliabilityMetrics = [
  { label: "Durability Target", value: "11 9s" },
  { label: "Global Regions", value: "14+" },
  { label: "Peak Throughput", value: "11.8TB/hr" },
  { label: "Restore Success", value: "99.997%" },
];

const leadership = [
  {
    name: "Vinay Yadav",
    role: "Founder & CEO",
    blurb:
      "Leads product vision and business strategy with focus on trusted distributed storage for modern enterprises.",
    social: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Rudra",
    role: "Founder & CTO",
    blurb:
      "Architects the core distributed systems stack, storage pipeline reliability, and platform security foundations.",
    social: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Vinayak",
    role: "COO",
    blurb:
      "Drives operational excellence, delivery discipline, and customer onboarding across strategic accounts.",
    social: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Vibhor",
    role: "CMO",
    blurb:
      "Shapes brand narrative, market strategy, and category positioning for infrastructure-first teams.",
    social: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Akshat",
    role: "Leadership",
    blurb:
      "Supports cross-functional leadership initiatives spanning growth, product operations, and GTM execution.",
    social: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard", external: false },
      { label: "Upload", href: "/upload", external: false },
      { label: "Storage Security", href: "#security", external: false },
      { label: "Architecture", href: "#architecture", external: false },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about", external: false },
      { label: "Vision", href: "#about", external: false },
      { label: "Leadership", href: "#about", external: false },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#", external: false },
      { label: "Status", href: "#", external: false },
      { label: "Support", href: "#", external: false },
    ],
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "X / Twitter", href: "https://x.com/" },
];

const HomePage = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("dv-home-theme") || "dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-home-theme", theme);
    localStorage.setItem("dv-home-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextTheme = useMemo(() => (theme === "dark" ? "light" : "dark"), [theme]);

    const renderFooterLink = (link) => {
    if (!link.external && link.href.startsWith("/")) {
      return (
        <Link to={link.href} className="dv-footer-link">
          {link.label}
        </Link>
      );
    }

    return (
      <a href={link.href} className="dv-footer-link">
        {link.label}
      </a>
    );
  };

  return (
    <div className="dv-home min-h-screen w-full">
      {/* Ambient */}
      <div className="dv-home-ambient pointer-events-none" />

      {/* Navbar */}
      <header className={`dv-home-nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="dv-home-nav">
          <Link to="/" className="dv-home-brand" aria-label="DataVaultX Home">
            <span className="dv-home-brand-dot" />
            DataVault<span>X</span>
          </Link>

          <ul className="dv-home-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className="dv-home-actions">
            <button
              type="button"
              className="dv-theme-toggle"
              onClick={() => setTheme(nextTheme)}
              aria-label={`Switch to ${nextTheme} mode`}
              title={`Switch to ${nextTheme} mode`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            <Link to="/dashboard" className="dv-home-cta-secondary">
              Dashboard
            </Link>
            <Link to="/upload" className="dv-home-cta-primary">
              Start Upload
            </Link>

            <button
              type="button"
              className="dv-home-mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="dv-home-mobile-menu">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="dv-home-main">
        {/* HERO */}
        <section className="dv-home-hero">
          {/* Left 70% */}
          <div className="dv-hero-left">
            <div className="dv-home-eyebrow">Distributed Storage Infrastructure</div>

            <h1 className="dv-hero-title">
              Enterprise Cloud Vault Built for
              <span className="dv-hero-title-gradient"> Secure Distributed Data</span>
            </h1>

            <p className="dv-hero-subtitle">
              DataVaultX orchestrates encrypted uploads, geo-redundant replication, and low-latency retrieval
              in one premium platform designed for modern teams and mission-critical workloads.
            </p>

            <div className="dv-hero-cta-row">
              <Link to="/upload" className="dv-home-cta-primary dv-hero-primary">
                Start Secure Upload
                <ArrowRight size={16} />
              </Link>
              <a href="#architecture" className="dv-home-cta-secondary dv-hero-secondary">
                View Architecture
              </a>
            </div>

            <ul className="dv-hero-trust-list">
              {trustPoints.map((item) => (
                <li key={item}>
                  <ShieldCheck size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="dv-hero-stats-grid">
              {heroStats.map((stat) => (
                <article key={stat.label} className="dv-hero-stat-card">
                  <p className="dv-hero-stat-value">{stat.value}</p>
                  <p className="dv-hero-stat-label">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Right 30% */}
          <aside className="dv-hero-right" aria-label="Distributed storage visual">
            <div className="dv-hero-orb" />

            <div className="dv-node-core">
              <HardDrive size={28} />
              <span>DataVaultX Core</span>
            </div>

            <div className="dv-floating-card card-a">
              <Globe2 size={16} />
              <div>
                <p>Geo Replication</p>
                <small>14 regions synced</small>
              </div>
            </div>

            <div className="dv-floating-card card-b">
              <Lock size={16} />
              <div>
                <p>Encrypted Transit</p>
                <small>TLS + SIWE auth</small>
              </div>
            </div>

            <div className="dv-floating-card card-c">
              <Zap size={16} />
              <div>
                <p>Fast Retrieval</p>
                <small>Sub-120ms edge</small>
              </div>
            </div>

            <div className="dv-floating-card card-d">
              <Server size={16} />
              <div>
                <p>Node Reliability</p>
                <small>99.99% uptime</small>
              </div>
            </div>
          </aside>
        </section>

        {/* Anchors for next tasks */}
                {/* WHY US + ADVANTAGES */}
        <section id="why-us" className="dv-home-section dv-reveal">
          <div className="dv-home-section-head">
            <p className="dv-home-kicker">Why Choose DataVaultX</p>
            <h2>Infrastructure-grade storage without complexity.</h2>
            <p>
              We combine secure distributed architecture, enterprise trust controls, and high-speed data access
              into one cohesive platform engineered for modern cloud teams.
            </p>
          </div>

          <div className="dv-why-grid">
            {whyChooseCards.map((card) => (
              <article key={card.title} className="dv-why-card dv-card">
                <p className="dv-why-stat">{card.stat}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SECURITY + FEATURES */}
        <section id="security" className="dv-home-section dv-reveal">
          <div className="dv-home-section-head">
            <p className="dv-home-kicker">Enterprise Trust Layer</p>
            <h2>Security, privacy, and reliability engineered into every file operation.</h2>
            <p>
              From encrypted transfer pipelines to robust auditability, DataVaultX is designed
              for organizations where uptime, governance, and control are non-negotiable.
            </p>
          </div>

          <div className="dv-feature-grid">
            {featureGrid.map((feature) => (
              <article key={feature.title} className="dv-feature-card">
                <div className="dv-feature-icon" aria-hidden="true">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Keep anchors for next tasks */}
                {/* ARCHITECTURE / WORKFLOW */}
        <section id="architecture" className="dv-home-section dv-reveal">
          <div className="dv-home-section-head">
            <p className="dv-home-kicker">Architecture Workflow</p>
            <h2>Purpose-built distributed pipeline for resilient enterprise storage.</h2>
            <p>
              DataVaultX coordinates secure ingestion, policy-based replication, and fast global retrieval through
              a deterministic workflow designed for performance, durability, and governance.
            </p>
          </div>

          <div className="dv-architecture-layout">
            <div className="dv-architecture-diagram" aria-label="Distributed storage workflow diagram">
              <div className="dv-arch-node core">
                <strong>Core Orchestrator</strong>
                <span>Routing + policy engine</span>
              </div>

              <div className="dv-arch-line l1" />
              <div className="dv-arch-line l2" />
              <div className="dv-arch-line l3" />

              <div className="dv-arch-node n1">
                <strong>Region A</strong>
                <span>Primary write shard</span>
              </div>
              <div className="dv-arch-node n2">
                <strong>Region B</strong>
                <span>Replica + failover</span>
              </div>
              <div className="dv-arch-node n3">
                <strong>Edge Cache</strong>
                <span>Fast global reads</span>
              </div>

              <div className="dv-arch-pulse p1" />
              <div className="dv-arch-pulse p2" />
              <div className="dv-arch-pulse p3" />
            </div>

            <div className="dv-workflow-list">
              {workflowSteps.map((step) => (
                <article key={step.id} className="dv-workflow-item">
                  <div className="dv-workflow-id">{step.id}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Reliability band */}
          <div className="dv-reliability-band">
            {reliabilityMetrics.map((m) => (
              <article key={m.label} className="dv-reliability-metric">
                <p>{m.value}</p>
                <span>{m.label}</span>
              </article>
            ))}
          </div>

          {/* Promo CTA */}
          <div className="dv-home-inline-cta">
            <div>
              <p className="dv-home-kicker">Production Ready</p>
              <h3>Launch secure distributed storage for your team in minutes.</h3>
              <p>
                Deploy with confidence using a platform optimized for privacy, reliability, and performance at scale.
              </p>
            </div>
            <div className="dv-home-inline-cta-actions">
              <Link to="/upload" className="dv-home-cta-primary">Start Upload</Link>
              <Link to="/dashboard" className="dv-home-cta-secondary">Open Dashboard</Link>
            </div>
          </div>
        </section>
                {/* ABOUT + LEADERSHIP */}
        <section id="about" className="dv-home-section dv-reveal">
          <div className="dv-home-section-head">
            <p className="dv-home-kicker">About DataVaultX</p>
            <h2>Building the trust layer for distributed cloud storage.</h2>
            <p>
              DataVaultX was founded to make enterprise storage infrastructure secure, resilient, and operationally
              elegant. Our mission is to give teams confidence that every file operation is protected, observable,
              and globally reliable.
            </p>
          </div>

          <div className="dv-about-layout">
            <article className="dv-about-vision-card">
              <h3>Our Vision</h3>
              <p>
                Enable every organization to run mission-critical workloads on a storage platform
                that combines premium UX with deep infrastructure reliability.
              </p>

              <div className="dv-about-pill-row">
                <span>Enterprise Security</span>
                <span>Distributed by Default</span>
                <span>Operational Clarity</span>
              </div>
            </article>

            <article className="dv-about-story-card">
              <h3>What We Believe</h3>
              <ul>
                <li>Infrastructure products should feel intuitive and powerful.</li>
                <li>Trust is earned through transparency, uptime, and governance.</li>
                <li>Performance and security must scale together, not compete.</li>
              </ul>
            </article>
          </div>

          <div className="dv-team-grid">
            {leadership.map((member) => {
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <article key={member.name} className="dv-team-card">
                  <div className="dv-team-avatar" aria-hidden="true">
                    {initials}
                  </div>

                  <div className="dv-team-content">
                    <h3>{member.name}</h3>
                    <p className="dv-team-role">{member.role}</p>
                    <p className="dv-team-blurb">{member.blurb}</p>

                    <div className="dv-team-links">
                      <a href={member.social.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                      <a href={member.social.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
                {/* FINAL CTA */}
        <section className="dv-home-final-cta dv-reveal">
          <div className="dv-home-final-cta-bg" />
          <div className="dv-home-final-cta-content">
            <p className="dv-home-kicker">Ready to Deploy</p>
            <h2>Launch enterprise-grade distributed storage with confidence.</h2>
            <p>
              Secure uploads, global replication, and trusted access governance —
              all in one premium platform engineered for modern infrastructure teams.
            </p>

            <div className="dv-home-final-cta-actions">
              <Link to="/upload" className="dv-home-cta-primary">Start Secure Upload</Link>
              <Link to="/dashboard" className="dv-home-cta-secondary">Open Dashboard</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dv-home-footer">
          <div className="dv-home-footer-top">
            <div className="dv-home-footer-brand">
              <div className="dv-home-brand">
                <span className="dv-home-brand-dot" />
                DataVault<span>X</span>
              </div>
              <p>
                Premium distributed storage infrastructure for secure, scalable, and
                high-performance enterprise workloads.
              </p>

              <div className="dv-home-footer-social">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="dv-home-footer-columns">
              {footerColumns.map((col) => (
                <div key={col.title} className="dv-footer-col">
                  <h3>{col.title}</h3>
                  <ul>
                    {col.links.map((link) => (
                      <li key={`${col.title}-${link.label}`}>{renderFooterLink(link)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="dv-home-footer-bottom">
            <span>© {new Date().getFullYear()} DataVaultX. All rights reserved.</span>
            <div>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;