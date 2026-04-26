import logo2 from "./assets/logo2.png";
import birLogo from "./assets/BIR.png";
import secLogo from "./assets/sec.jpg";

const companyProfileAboutUrl = "http://localhost:3000/#about-us";
const companyProfileServicesUrl = "http://localhost:3000/#services";
const companyProfileHomeUrl = "http://localhost:3000/";

const binaryPatterns = [
  "0101011010010110",
  "1010010101101001",
  "0011010110101101",
  "1100101001011010",
  "0101101001100101",
  "1010110010101011",
  "<1<1<1<1<1<1<1<1",
  "<1<1<1<1<1<1<1<1",
  "<1<1<1<1<1<1<1<1",
  "0110010101101001",
  "1001011010010110",
  "0100101101011001",
  "<1<1<1<1<1<1<1<1",
  "<1<1<1<1<1<1<1<1",
  "<1<1<1<1<1<1<1<1",
  "1011010010101100",
  "1011010010101100",
  "0110100101101010",
  "1001101010010101",
  "1001101010010101",
  "1001101010010101",
  "1001101010010101",
  "1001101010010101",
  "1001101010010101",
  "<1<1<1<1<1<1<1<1",
  "<1<1<1<1<1<1<1<1",
  "<1<1<1<1<1<1<1<1",
];

const binaryColumns = Array.from({ length: 24 }, (_, index) => ({
  pattern: binaryPatterns[index % binaryPatterns.length],
  duration: 10 + (index % 5) * 1.8,
  delay: index * 0.65,
  segments: Array.from({ length: 9 }, (_, segmentIndex) => ({
    text: binaryPatterns[(index + segmentIndex) % binaryPatterns.length].slice(
      0,
      5 + ((index + segmentIndex) % 8),
    ),
    active:
      segmentIndex === 1 ||
      segmentIndex === 4 ||
      (index + segmentIndex) % 5 === 0,
    gap: 18 + ((index * 7 + segmentIndex * 11) % 34),
  })),
}));

const heroCards = [
  {
    title: "Build smarter digital systems for your business.",
    subtitle: "",
    className: "hero-card-centered hero-card-message",
  },
  {
    title: "We design and build custom software and SaaS platforms that grow with your business.",
    subtitle: "",
    className: "hero-card-centered hero-card-message",
  },
  {
    title: "Don’t adapt your business to software. Build software that adapts to you.",
    subtitle: "",
    className: "hero-card-centered hero-card-message",
  },
];

const footerLinks = [
  { label: "Services", href: companyProfileServicesUrl },
  { label: "Solutions", href: companyProfileServicesUrl },
  { label: "About", href: companyProfileAboutUrl },
  { label: "Contact", href: "mailto:hello@zeroone-apps.com" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/zeroone.it.inc" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/112718341/admin/dashboard/",
  },
  { label: "Instagram", href: "https://www.instagram.com/zerooneit.inc/" },
];

const registrationBadges = [
  { label: "SEC Registered", logo: secLogo, alt: "SEC logo" },
  { label: "BIR Registered", logo: birLogo, alt: "BIR logo" },
];

export default function App() {
  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <div className="binary-rain" aria-hidden="true">
        {binaryColumns.map((column, index) => (
          <div
            className="binary-column"
            key={`${column.pattern}-${index}`}
            style={{
              "--column-duration": `${column.duration}s`,
              "--column-delay": `-${column.delay}s`,
            }}
          >
            {column.segments.map((segment, segmentIndex) => (
              <span
                className={segment.active ? "binary-segment is-active" : "binary-segment"}
                key={`${index}-${segmentIndex}`}
                style={{ marginBottom: `${segment.gap}px` }}
              >
                {segment.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      <main className="hero-shell">
        <section className="hero-copy">
          <div className="hero-header">
            <div className="hero-heading-block">
              <p className="hero-eyebrow">ZeroOne | Information Technology Inc.</p>
              <h1 className="hero-title">Welcome.</h1>
              <p className="hero-lead">
                We build modern websites, internal systems, and custom software that
                fit the way your business actually operates.
              </p>
            </div>

            <div className="hero-brand-panel">
              <img className="hero-copy-logo" src={logo2} alt="ZeroOne logo" />
            </div>
          </div>

          <div className="hero-card-grid">
            {heroCards.map((card, index) => (
              <article
                className={card.className ? `hero-card ${card.className}` : "hero-card"}
                key={card.title}
              >
                <h2 className="hero-card-title">{card.title}</h2>
                {card.subtitle ? <p className="hero-card-subtitle">{card.subtitle}</p> : null}
              </article>
            ))}
          </div>

          <div className="hero-actions">
            <a
              className="hero-button hero-button-primary"
              href={companyProfileHomeUrl}
            >
              Learn More
            </a>
            <a className="hero-button hero-button-secondary" href="mailto:contact@zeroone-apps.com">
              Talk to Us
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-intro">
            <p className="footer-kicker">ZeroOne IT Inc.</p>
            <h2 className="footer-title">Build software that fits the way your business works.</h2>
            <p className="footer-copy">
              We create modern websites, internal systems, and custom digital tools
              for teams that need reliable technology built around real operations.
            </p>
            <div className="footer-trustmarks" aria-label="Registration badges">
              {registrationBadges.map((badge) => (
                <span className="footer-trustmark" key={badge.label}>
                  <img className="footer-trustmark-logo" src={badge.logo} alt={badge.alt} />
                  <span className="footer-trustmark-text">{badge.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="footer-panel">
            <div className="footer-panel-section">
              <p className="footer-label">Email</p>
              <a className="footer-value" href="mailto:contact@zeroone-apps.com">
                contact@zeroone-apps.com
              </a>
            </div>
            <div className="footer-panel-section">
              <p className="footer-label">Phone</p>
              <a className="footer-value" href="tel:+639190797137">
                +63 919 079 7137
              </a>
            </div>
            <div className="footer-panel-section">
              <p className="footer-label">Based In</p>
              <p className="footer-value">Philippines</p>
            </div>
            <div className="footer-panel-section">
              <p className="footer-label">What We Build</p>
              <p className="footer-value">
                Custom software, SaaS platforms, websites, and workflow systems
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <nav className="footer-nav" aria-label="Footer">
            {footerLinks.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <nav className="footer-social-nav" aria-label="Social links">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </nav>
          <p className="footer-copyright">© 2026 ZeroOne IT Inc. All rights reserved.</p>
          <a className="footer-cta" href="mailto:hello@zeroone-apps.com">
            Start a Project
          </a>
        </div>
      </footer>
    </div>
  );
}
