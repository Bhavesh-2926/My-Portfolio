import React from 'react';
import { Hero3DCanvas } from '../components/3d/Hero3DCanvas';
import { ProfileData } from '../types/portfolio';
import { ArrowUpRight, Download, Mail, Sparkles, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/SocialIcons';

interface HeroProps {
  profile: ProfileData;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '120px',
        paddingBottom: '60px',
        overflow: 'hidden'
      }}
    >
      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-two-col">
          {/* Left Section - All Written Content & 3 Metric Boxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Availability Badge */}
            <div>
              <div
                className="badge-neon animate-pulse-glow"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--cyan-core)',
                    boxShadow: '0 0 10px var(--cyan-core)'
                  }}
                />
                AVAILABLE FOR HIGH-IMPACT ROLES
              </div>
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase'
              }}
            >
              <span className="text-gradient">{profile.name}</span>
            </h1>

            {/* Profession Title */}
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)',
                fontWeight: 700,
                color: 'var(--cyan-core)',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Terminal size={19} />
              {profile.title}
            </div>

            {/* Professional Tagline */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.15vw, 1.08rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '520px'
              }}
            >
              {profile.tagline}
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '14px',
                marginTop: '6px'
              }}
            >
              <a href="#projects" className="btn-cyan">
                <span>Explore Projects</span>
                <ArrowUpRight size={18} />
              </a>

              <a
                href={profile.resumeUrl || '/resume/Bhavesh_Gupta_Resume.pdf'}
                download={profile.resumeFileName || 'Bhavesh_Gupta_Resume.pdf'}
                className="btn-glass"
              >
                <Download size={18} />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Social Links */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '4px'
              }}
            >
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(11, 20, 44, 0.7)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-core)';
                  e.currentTarget.style.color = 'var(--cyan-core)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title="GitHub Profile"
              >
                <GithubIcon size={18} />
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(11, 20, 44, 0.7)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-core)';
                  e.currentTarget.style.color = 'var(--cyan-core)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title="LinkedIn Profile"
              >
                <LinkedinIcon size={18} />
              </a>

              <a
                href={`mailto:${profile.email}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(11, 20, 44, 0.7)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-core)';
                  e.currentTarget.style.color = 'var(--cyan-core)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title="Send Direct Email"
              >
                <Mail size={18} />
              </a>
            </div>

            {/* 3 Metric Boxes inside Left Half - Single Line Layout */}
            <div className="hero-stats-row">
              <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(0, 240, 255, 0.22)' }}>
                <div style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 900, color: 'var(--cyan-core)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {profile.yearsExperience}
                </div>
                <div style={{ fontSize: 'clamp(0.68rem, 0.85vw, 0.75rem)', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px' }}>
                  Years Experience
                </div>
              </div>

              <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(0, 240, 255, 0.22)' }}>
                <div style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 900, color: 'var(--cyan-core)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {profile.projectsCount}
                </div>
                <div style={{ fontSize: 'clamp(0.68rem, 0.85vw, 0.75rem)', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px' }}>
                  Verified Projects
                </div>
              </div>

              <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(0, 240, 255, 0.22)' }}>
                <div style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', fontWeight: 900, color: 'var(--cyan-core)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {profile.cgpa}
                </div>
                <div style={{ fontSize: 'clamp(0.68rem, 0.85vw, 0.75rem)', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '6px' }}>
                  B.Tech CGPA Score
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Cybernetic Profession Showcase (QA · Software Eng · AI Dev) */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              className="glass-panel"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.2)',
                background: 'linear-gradient(145deg, rgba(6, 16, 42, 0.92) 0%, rgba(3, 7, 18, 0.98) 100%)',
                overflow: 'hidden'
              }}
            >
              {/* Telemetry Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px 14px',
                  borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginLeft: '6px' }}>
                    ROLE_MATRIX // HUD_v2.6
                  </span>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    color: 'var(--cyan-core)',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan-core)', boxShadow: '0 0 8px var(--cyan-core)' }} />
                  SYS_ACTIVE
                </div>
              </div>

              {/* Profession Showcase Graphic */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  maxHeight: '480px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#020617'
                }}
              >
                <img
                  src="/images/hero_tech_showcase.jpg"
                  alt="Software QA Tester | Software Engineer | AI Developer Holographic Workspace"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'contrast(1.08) brightness(1.04)'
                  }}
                />

                {/* Subtle Scanline Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 240, 255, 0.04) 51%)',
                    backgroundSize: '100% 4px',
                    pointerEvents: 'none'
                  }}
                />

                {/* Cybernetic Floating Chips - Dynamic from profile.professionTags */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center'
                  }}
                >
                  {(profile.professionTags || ['QA Test Automation', 'Software Engineering', 'AI Development']).map((tag, idx) => {
                    const colors = [
                      { border: 'rgba(0, 240, 255, 0.4)', text: 'var(--cyan-core)', icon: '🛡️' },
                      { border: 'rgba(56, 189, 248, 0.4)', text: '#38BDF8', icon: '⚡' },
                      { border: 'rgba(129, 140, 248, 0.4)', text: '#818CF8', icon: '🧠' },
                      { border: 'rgba(52, 211, 153, 0.4)', text: '#34D399', icon: '🚀' }
                    ];
                    const c = colors[idx % colors.length];
                    return (
                      <div
                        key={tag}
                        style={{
                          background: 'rgba(3, 7, 18, 0.88)',
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${c.border}`,
                          borderRadius: 'var(--radius-full)',
                          padding: '5px 12px',
                          fontSize: '0.72rem',
                          color: c.text,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                        }}
                      >
                        <span>{c.icon}</span> {tag}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ambient Glow behind panel */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '360px',
                  height: '360px',
                  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(0, 112, 243, 0.08) 50%, transparent 70%)',
                  filter: 'blur(45px)',
                  pointerEvents: 'none',
                  zIndex: -1
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
