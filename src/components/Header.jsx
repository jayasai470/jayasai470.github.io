import { useState } from 'react';
import { motion } from 'motion/react';
import { GitHubIcon, LinkedInIcon, MailIcon, MenuIcon, CloseIcon, ChevronDownIcon } from './Icons.jsx';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

const ICONS = { github: GitHubIcon, linkedin: LinkedInIcon, mail: MailIcon };

function Header({ main }) {
  const [menuOpen, setMenuOpen] = useState(false);
  if (!main) return null;

  const initials = `${main.firstName?.[0] ?? ''}${main.lastName?.[0] ?? ''}`;

  return (
    <header className="site-header" id="home">
      <nav className="navbar">
        <a href="#home" className="brand">
          {initials}
        </a>

        <ul className="nav-links nav-links--desktop">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <a className="button button--ghost" href={main.resumedownload} target="_blank" rel="noreferrer">
            Resume
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul className="nav-links nav-links--mobile">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="eyebrow">{main.address?.city} · {main.occupation}</p>
          <h1>{main.name}</h1>
          <p className="hero-tagline">{main.tagline}</p>

          <div className="hero-actions">
            <a className="button button--primary" href={main.resumedownload} target="_blank" rel="noreferrer">
              Download Résumé
            </a>
            <a className="button button--outline" href="#contact">
              Get in Touch
            </a>
          </div>

          <ul className="social-links">
            {main.social?.map((network) => {
              const Icon = ICONS[network.icon];
              return (
                <li key={network.name}>
                  <a href={network.url} target="_blank" rel="noreferrer" aria-label={network.name}>
                    {Icon ? <Icon /> : network.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      <a className="scroll-indicator" href="#about" aria-label="Scroll to About section">
        <ChevronDownIcon />
      </a>
    </header>
  );
}

export default Header;
