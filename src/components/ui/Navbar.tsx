import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin?: () => void;
  resumeUrl?: string;
  resumeFileName?: string;
  name?: string;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ resumeUrl, resumeFileName, name, title }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'EDUCATION', href: '#education' },
    { name: 'CONTACT', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.substring(1));
      const scrollPosition = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: scrolled ? '16px' : '24px',
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          transition: 'all 0.3s ease'
        }}
      >
        <nav
          className="glass-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '28px',
            padding: '8px 20px',
            width: '100%',
            maxWidth: '1100px',
            boxShadow: '0 10px 35px -5px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(0, 240, 255, 0.2)'
          }}
        >
          {/* Logo / Personal Brand */}
          <a
            href="#home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#FFFFFF'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00F0FF 0%, #0070F3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#040817',
                boxShadow: '0 0 14px rgba(0, 240, 255, 0.5)'
              }}
            >
              <Terminal size={18} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                {name ? (
                  <>
                    {name.split(' ')[0].toUpperCase()}
                    <span style={{ color: 'var(--cyan-core)' }}>
                      {name.split(' ').length > 1 ? `.${name.split(' ')[1][0].toUpperCase()}` : ''}
                    </span>
                  </>
                ) : (
                  <>BHAVESH<span style={{ color: 'var(--cyan-core)' }}>.G</span></>
                )}
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--cyan-core)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                {title ? title.split('|')[0].trim() : 'QA • DEV • AI'}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            className="desktop-nav-links"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    color: isActive ? '#00F0FF' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                    boxShadow: isActive ? '0 0 12px rgba(0, 240, 255, 0.2)' : 'none'
                  }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={resumeUrl || '/resume/Bhavesh_Gupta_Resume.pdf'}
              download={resumeFileName || 'Bhavesh_Gupta_Resume.pdf'}
              className="btn-cyan"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              title="Download Verified Resume PDF"
            >
              <Download size={15} />
              <span className="nav-btn-text">Resume</span>
            </a>

            {/* Mobile Hamburger Toggle (Visible ONLY on Mobile & Tablet <= 960px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-pure)',
                cursor: 'pointer',
                padding: '6px'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 20, 0.96)',
            backdropFilter: 'blur(24px)',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            padding: '24px'
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: activeSection === link.href.substring(1) ? 'var(--cyan-core)' : '#FFFFFF',
                textDecoration: 'none'
              }}
            >
              {link.name}
            </a>
          ))}

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
            <a
              href={resumeUrl || '/resume/Bhavesh_Gupta_Resume.pdf'}
              download={resumeFileName || 'Bhavesh_Gupta_Resume.pdf'}
              className="btn-cyan"
              style={{ width: '100%', textAlign: 'center' }}
            >
              <Download size={16} /> Download Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
};
