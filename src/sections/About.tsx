import React from 'react';
import { ProfileData, Achievement } from '../types/portfolio';
import { BrainCircuit, CheckCircle, Code2, Cpu, Eye, ShieldCheck, Terminal, Users, Bug, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  profile: ProfileData;
  achievements?: Achievement[];
}

export const About: React.FC<AboutProps> = ({ profile, achievements }) => {
  const leadershipAchievements = achievements !== undefined
    ? achievements.filter((a) => a.type !== 'Certification')
    : [
        {
          id: 'ach-1',
          title: 'Core Team Member',
          organization: 'College Technical Club (GIET Kota)',
          type: 'Leadership',
          description: 'Active core organizer leading technical events, workshops, and mentoring students.'
        },
        {
          id: 'ach-2',
          title: 'Coordinator',
          organization: '"Showcase Your Technical Skills" Challenge Event',
          type: 'Leadership',
          description: 'Coordinated event structure, challenge guidelines, and participant evaluations.'
        },
        {
          id: 'ach-3',
          title: 'Volunteer',
          organization: 'Technical Master Club',
          type: 'Leadership',
          description: 'Volunteered in organizing technical learning sessions and collaborative meetups.'
        }
      ];
  return (
    <section id="about" className="section-spacing">
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            ABOUT ME
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', textTransform: 'uppercase' }}>
            ENGINEERING MINDSET & <span className="text-cyan-glow">CAREER STORY</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0', fontSize: '0.95rem' }}>
            A triple-threat profile combining rigorous Quality Assurance, modern Software Engineering, and AI-driven development.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          {/* Left Column - Cybernetic Engineering Blueprint / Telemetry Terminal (NO face photo) */}
          <div
            className="glass-panel"
            style={{
              padding: '30px',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Terminal Title Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cyan-core)', fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>
                SYSTEM_TELEMETRY // BHAVESH_GUPTA
              </div>
            </div>

            {/* Architecture Telemetry Matrix representing the 3 Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Pillar 1: Software QA Testing */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cyan-core)',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Software QA Tester
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    SDLC · STLC · Manual Testing · Selenium · Rest Assured · Jira
                  </div>
                </div>
              </div>

              {/* Pillar 2: Software Engineer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38BDF8',
                    flexShrink: 0
                  }}
                >
                  <Code2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Software Engineer
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    HTML5 · CSS3 · JavaScript (ES6) · TypeScript · React.js · Python
                  </div>
                </div>
              </div>

              {/* Pillar 3: AI Developer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(129, 140, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818CF8',
                    flexShrink: 0
                  }}
                >
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF' }}>
                    AI Developer
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Groq Cloud LLMs (LLaMA 3.3 70B) · ChatGPT · Claude · Gemini · ML Models
                  </div>
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(5, 8, 20, 0.75)',
                border: '1px solid rgba(0, 240, 255, 0.12)',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#BAE6FD',
                lineHeight: 1.5
              }}
            >
              <div style={{ color: '#64748B' }}>// Professional Identity Matrix</div>
              <div><span style={{ color: '#F43F5E' }}>const</span> candidate = &#123;</div>
              <div style={{ paddingLeft: '16px' }}>name: <span style={{ color: '#34D399' }}>"{profile.name}"</span>,</div>
              <div style={{ paddingLeft: '16px' }}>roles: [{(profile.professionTags && profile.professionTags.length > 0 ? profile.professionTags : ["QA Tester", "Software Engineer", "AI Developer"]).map(r => `"${r}"`).join(', ')}],</div>
              <div style={{ paddingLeft: '16px' }}>defectResolutionRate: <span style={{ color: 'var(--cyan-core)' }}>"High"</span>,</div>
              <div style={{ paddingLeft: '16px' }}>readyForProduction: <span style={{ color: 'var(--cyan-core)' }}>true</span></div>
              <div>&#125;;</div>
            </div>
          </div>

          {/* Right Column - Career Narrative & Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.75rem', lineHeight: 1.3 }}>
              Ensuring software quality, building scalable code, and harnessing <span className="text-cyan-glow">AI intelligence</span>.
            </h3>

            {profile.bio.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: '0.98rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7
                }}
              >
                {paragraph}
              </p>
            ))}

            {/* 3 Core Highlight Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginTop: '12px'
              }}
            >
              <div className="glass-card" style={{ padding: '18px 16px' }}>
                <div style={{ color: 'var(--cyan-core)', marginBottom: '8px' }}>
                  <ShieldCheck size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: '#FFFFFF' }}>
                  Quality Assurance
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Comprehensive test coverage (Smoke, Sanity, Regression) and bug tracking in Jira.
                </div>
              </div>

              <div className="glass-card" style={{ padding: '18px 16px' }}>
                <div style={{ color: 'var(--cyan-core)', marginBottom: '8px' }}>
                  <Code2 size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: '#FFFFFF' }}>
                  Software Engineering
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Building responsive, maintainable web products using React, TypeScript, and Python.
                </div>
              </div>

              <div className="glass-card" style={{ padding: '18px 16px' }}>
                <div style={{ color: 'var(--cyan-core)', marginBottom: '8px' }}>
                  <BrainCircuit size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: '#FFFFFF' }}>
                  AI Development
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Integrating LLMs, Groq Cloud, AI chatbots, and predictive ML models into applications.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSECTION: ACHIEVEMENTS (Moved under About Me per user request) */}
        <div id="about-achievements" style={{ marginTop: '70px', paddingTop: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="badge-neon" style={{ marginBottom: '10px' }}>
              ACHIEVEMENTS
            </div>
            <h3 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', textTransform: 'uppercase' }}>
              KEY <span className="text-cyan-glow">ACHIEVEMENTS</span> & LEADERSHIP
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '580px', margin: '10px auto 0' }}>
              Leadership responsibilities, technical event coordination, and community club organizing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {leadershipAchievements.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '26px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(0, 240, 255, 0.2)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0, 240, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Flame size={22} color="#38BDF8" />
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.3 }}>
                    {item.title}
                  </h4>

                  <div style={{ fontSize: '0.84rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '10px' }}>
                    {item.organization}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.76rem', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Verified Credential
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
