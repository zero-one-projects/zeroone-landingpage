import { useState } from "react";
import logo2 from "./assets/logo2.png";
import birLogo from "./assets/BIR.png";
import secLogo from "./assets/sec.jpg";
import zeroOneLogo from "./assets/zeroone-logo.png";

const companyProfileAboutUrl = "/#about-us";
const companyProfileServicesUrl = "/#services";
const companyProfileHomeUrl = "/";

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

const contactMethods = [
  {
    title: "Email us",
    value: "contact@zeroone-apps.com",
    href: "mailto:contact@zeroone-apps.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
        <path d="m5.5 7 6.5 5 6.5-5" />
      </svg>
    ),
  },
  {
    title: "Call us",
    value: "+63 919 079 7137",
    href: "tel:+639190797137",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 4.8c.5-.5 1.4-.5 1.9 0l1.7 1.7c.5.5.5 1.2.1 1.8l-1.4 1.8a13.6 13.6 0 0 0 4.4 4.4l1.8-1.4c.5-.4 1.3-.4 1.8.1l1.7 1.7c.5.5.5 1.4 0 1.9l-1.2 1.2c-.8.8-2 1.1-3.1.7A18.3 18.3 0 0 1 4.5 8.9c-.4-1.1-.1-2.3.7-3.1z" />
        <path d="M14.5 5.5a5 5 0 0 1 4 4" />
        <path d="M14.5 2.5a8 8 0 0 1 7 7" />
      </svg>
    ),
  },
  {
    title: "Our location",
    value: "Philippines",
    href: "https://maps.google.com/?q=Philippines",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" />
        <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </svg>
    ),
  },
];

export default function App() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState({
    status: "idle",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({
      status: "submitting",
      message: "Sending your message...",
    });

    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message || "Unable to submit form");
      }

      setSubmitState({
        status: "success",
        message: "Thanks. Your message has been sent.",
      });
      setFormState({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please email us directly at contact@zeroone-apps.com.",
      });
    }
  }

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
              <h1 className="hero-title">Welcome</h1>
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
        <section className="contact-section" id="contact">
          <div className="contact-grid">
            <div className="contact-copy">
              <div className="contact-chip">
                <span className="contact-chip-icon">
                  <img src={zeroOneLogo} alt="ZeroOne logo" className="contact-chip-logo" />
                </span>
                <span>Start a Project</span>
              </div>

              <p className="footer-kicker">ZeroOne IT Inc.</p>
              <h2 className="contact-title">Get in touch</h2>
              <p className="contact-copy-text">
                Have questions or ready to transform your business with AI automation,
                custom software, or internal systems?
              </p>

              <div className="contact-card-list">
                {contactMethods.map((item) => (
                  <a
                    className="contact-card"
                    key={item.title}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span className="contact-card-icon">{item.icon}</span>
                    <span className="contact-card-body">
                      <span className="contact-card-title">{item.title}</span>
                      <span className="contact-card-value">{item.value}</span>
                    </span>
                    <span className="contact-card-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>

              <div className="footer-trustmarks" aria-label="Registration badges">
                {registrationBadges.map((badge) => (
                  <span className="footer-trustmark" key={badge.label}>
                    <img className="footer-trustmark-logo" src={badge.logo} alt={badge.alt} />
                    <span className="footer-trustmark-text">{badge.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="contact-form-column">
              <div className="contact-form-copy">
                <p className="contact-form-heading">
                  Build software that fits the way your business works.
                </p>
              </div>

              <form className="contact-form-panel" onSubmit={handleSubmit}>
                <label className="contact-field">
                  <span className="sr-only">Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contact-field">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contact-field contact-field-textarea">
                  <span className="sr-only">Message</span>
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="8"
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </label>
                <button
                  className="contact-submit"
                  type="submit"
                  disabled={submitState.status === "submitting"}
                >
                  {submitState.status === "submitting" ? "Sending..." : "Submit"}
                </button>
                <p
                  className={
                    submitState.status === "error"
                      ? "contact-submit-message is-error"
                      : "contact-submit-message"
                  }
                  role="status"
                >
                  {submitState.message}
                </p>
              </form>
            </div>
          </div>
        </section>

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
