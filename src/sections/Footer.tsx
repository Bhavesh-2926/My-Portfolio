import React from 'react';
import { ArrowUp, Mail, Terminal, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import { ProfileData } from '../types/portfolio';

interface FooterProps {
  profile: ProfileData;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(0, 240, 255, 0.15)',
        backgroundColor: '#040711',
        paddingTop: '60px',
        paddingBottom: '40px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container-custom">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '40px'
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00F0FF 0%, #0070F3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#040817'
                }}
              >
                <Terminal size={17} strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>
                {(profile.name || 'Bhavesh Gupta').toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>
              {profile.title} - {profile.tagline}
            </p>
          </div>

          {/* Quick Nav Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <a href="#home" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Home</a>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>About</a>
            <a href="#skills" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Skills</a>
            <a href="#experience" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Experience</a>
            <a href="#projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Projects</a>
            <a href="#education" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Education</a>
            <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Contact</a>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              color: 'var(--cyan-core)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.1)')}
            aria-label="Scroll back to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} {profile.name || 'Bhavesh Gupta'}. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              title="GitHub"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              title="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
