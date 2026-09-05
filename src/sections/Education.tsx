import React from 'react';
import { Education, Achievement } from '../types/portfolio';
import { GraduationCap, Award, Calendar, MapPin, CheckCircle2, Trophy, Flame } from 'lucide-react';

interface EducationProps {
  education: Education[];
  achievements: Achievement[];
}

export const EducationSection: React.FC<EducationProps> = ({ education, achievements }) => {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'Award':
        return <Trophy size={22} color="#00F0FF" />;
      case 'Leadership':
        return <Flame size={22} color="#38BDF8" />;
      default:
        return <Award size={22} color="#818CF8" />;
    }
  };

  return (
    <section id="education" className="section-spacing">
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            ACADEMIC BACKGROUND & CREDENTIALS
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', textTransform: 'uppercase' }}>
            FORMAL <span className="text-cyan-glow">EDUCATION</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '14px auto 0', fontSize: '0.95rem' }}>
            Strong foundation in Computer Science, engineering principles, data structures, and database systems.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '960px',
            margin: '0 auto 80px'
          }}
        >
          {education.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(0, 240, 255, 0.22)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0, 240, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cyan-core)'
                    }}
                  >
                    <GraduationCap size={24} />
                  </div>
                  {/* Grade Badge */}
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(0, 240, 255, 0.12)',
                      border: '1px solid var(--cyan-core)',
                      color: 'var(--cyan-core)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    {item.gradeType}: {item.grade}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.3 }}>
                  {item.degree}
                </h3>

                <div style={{ fontSize: '0.92rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '6px' }}>
                  {item.institution}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    <span>{item.startDate} – {item.endDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} />
                    <span>{item.location}</span>
                  </div>
                </div>

                {item.description && (
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                )}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.78rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Verified Academic Degree
              </div>
            </div>
          ))}
        </div>

        {/* SUBSECTION: CERTIFICATIONS (Only 2 Certification Cards) */}
        <div id="certifications" style={{ paddingTop: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="badge-neon" style={{ marginBottom: '10px' }}>
              CERTIFICATIONS
            </div>
            <h3 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', textTransform: 'uppercase' }}>
              PROFESSIONAL <span className="text-cyan-glow">CERTIFICATIONS</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '580px', margin: '10px auto 0' }}>
              Verified industry credentials and accredited technical course completions.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              maxWidth: '840px',
              margin: '0 auto'
            }}
          >
            {achievements
              .filter((item) => item.type === 'Certification')
              .map((item) => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(0, 240, 255, 0.22)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 240, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getAchievementIcon(item.type)}
                      </div>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          padding: '3px 12px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(0, 240, 255, 0.08)',
                          border: '1px solid rgba(0, 240, 255, 0.25)',
                          color: 'var(--cyan-core)',
                          fontWeight: 600
                        }}
                      >
                        Certification
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.35 }}>
                      {item.title}
                    </h4>

                    <div style={{ fontSize: '0.86rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '10px' }}>
                      {item.organization}
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.78rem', fontWeight: 600 }}>
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
