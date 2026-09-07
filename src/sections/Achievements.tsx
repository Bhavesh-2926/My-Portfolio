import React from 'react';
import { Achievement } from '../types/portfolio';
import { Award, CheckCircle, Flame, Shield, Trophy } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Award':
        return <Trophy size={24} color="#00F0FF" />;
      case 'Leadership':
        return <Flame size={24} color="#38BDF8" />;
      default:
        return <Award size={24} color="#818CF8" />;
    }
  };

  return (
    <section className="section-spacing" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            MILESTONES & RECOGNITION
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', textTransform: 'uppercase' }}>
            KEY <span className="text-cyan-glow">ACHIEVEMENTS</span> & CERTIFICATIONS
          </h2>
        </div>

        <div className="cards-grid-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
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
                      justifyContent: 'center'
                    }}
                  >
                    {getIcon(item.type)}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
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

                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                <div style={{ fontSize: '0.82rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '12px' }}>
                  {item.organization}
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.78rem', fontWeight: 600 }}>
                <CheckCircle size={14} /> Verified Credential
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
