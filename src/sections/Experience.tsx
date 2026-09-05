import React from 'react';
import { Experience } from '../types/portfolio';
import { Briefcase, Calendar, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

interface ExperienceProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <section id="experience" className="section-spacing">
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            CAREER PROGRESSION
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', textTransform: 'uppercase' }}>
            WORK EXPERIENCE & <span className="text-cyan-glow">ENGINEERING TIMELINE</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '14px auto 0', fontSize: '0.95rem' }}>
            Hands-on production track record in QA engineering, automated testing, and scalable full-stack web applications.
          </p>
        </div>

        {/* Vertical Glowing Timeline */}
        <div className="timeline-container">
          {/* Glowing Center-Left Line */}
          <div className="timeline-spine" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '42px' }}>
            {experiences.map((item) => {
              return (
                <div key={item.id} className="timeline-item">
                  {/* Timeline Pulse Node */}
                  <div className="timeline-node">
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                  {/* Card Container */}
                  <div
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '28px',
                      border: '1px solid rgba(0, 240, 255, 0.22)',
                      boxShadow: '0 12px 35px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.12)'
                    }}
                  >
                    {/* Header info */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                      <span className="badge-neon" style={{ fontSize: '0.72rem' }}>
                        {item.type}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <Calendar size={13} />
                        <span>{item.startDate} – {item.endDate}</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginTop: '6px' }}>
                      {item.role}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-core)', fontSize: '0.9rem', fontWeight: 600, marginTop: '2px', marginBottom: '14px' }}>
                      <Briefcase size={14} />
                      <span>{item.company}</span>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.location}</span>
                    </div>

                    {/* Responsibilities list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                      {item.responsibilities.map((resp, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <CheckCircle2 size={14} color="#00F0FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {resp}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.technologies.map((tech) => (
                        <span key={tech} className="badge-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
