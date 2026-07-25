import { Wordmark } from "./Navbar";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#download", label: "Download" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "License" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <Wordmark />
            <p className="lp-footer-tag">
              A quiet clipboard history for your desktop. No cloud, no accounts — everything
              stays on your machine.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="lp-footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 PersonaBoard. All rights reserved.</span>
          <span>Made for people who copy and paste for a living.</span>
        </div>
      </div>
    </footer>
  );
}
