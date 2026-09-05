import React, { useState } from 'react';
import { SkillCategory, SoftSkill } from '../types/portfolio';
import { softSkillsList } from '../lib/defaultData';
import { Shield, Layout, Database, Wrench, Bot, Zap, CheckCircle2 } from 'lucide-react';

interface SkillsProps {
  skills: SkillCategory[];
  softSkills?: SoftSkill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills, softSkills = softSkillsList }) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'QA & Testing':
        return <Shield size={18} />;
      case 'Frontend Development':
        return <Layout size={18} />;
      case 'Backend & Database':
        return <Database size={18} />;
      case 'Tools & Platforms':
        return <Wrench size={18} />;
      case 'AI Tools':
        return <Bot size={18} />;
      default:
        return <Wrench size={18} />;
    }
  };

  const dynamicCategories = Array.from(new Set(skills.map((s) => s.category)));
  const filterTabs = ['ALL', ...dynamicCategories];

  const currentTab = filterTabs.includes(activeTab) ? activeTab : 'ALL';
  const filteredCategories = currentTab === 'ALL'
    ? skills
    : skills.filter((s) => s.category === currentTab);

  return (
    <section id="skills" className="section-spacing">
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            TECHNICAL EXPERTISE
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', textTransform: 'uppercase' }}>
            SKILL-SET & <span className="text-cyan-glow">VERIFIED TECHNOLOGIES</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '12px auto 0', fontSize: '0.95rem' }}>
            Directly sourced from verified resume competencies spanning QA testing, frontend engineering, backend databases, modern developer tools, and AI toolchains.
          </p>
        </div>

        {/* Category Buttons Matching Resume Sections Exactly */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '40px'
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--cyan-core)' : '1px solid rgba(0, 240, 255, 0.15)',
                  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.18)' : 'rgba(11, 20, 44, 0.6)',
                  color: isActive ? 'var(--cyan-core)' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 0 18px rgba(0, 240, 255, 0.35)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Skills Constellation Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '26px'
          }}
        >
          {filteredCategories.map((catGroup) => (
            <div
              key={catGroup.category}
              className="glass-panel"
              style={{
                padding: '26px',
                border: '1px solid rgba(0, 240, 255, 0.22)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                  color: 'var(--cyan-core)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.04em'
                }}
              >
                <span
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 240, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getCategoryIcon(catGroup.category)}
                </span>
                {catGroup.category.toUpperCase()}
              </div>

              {/* Skill Nodes Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {catGroup.skills.map((skill) => {
                  const isHovered = hoveredSkill === skill.name;
                  return (
                    <div
                      key={skill.name}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isHovered ? 'rgba(0, 240, 255, 0.14)' : 'rgba(7, 14, 32, 0.7)',
                        border: isHovered ? '1px solid var(--cyan-core)' : '1px solid rgba(0, 240, 255, 0.12)',
                        boxShadow: isHovered ? '0 0 14px rgba(0, 240, 255, 0.3)' : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isHovered ? '#FFFFFF' : 'var(--text-primary)' }}>
                        {skill.name}
                      </span>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isHovered ? 'var(--cyan-core)' : '#38BDF8',
                          boxShadow: isHovered ? '0 0 8px var(--cyan-core)' : 'none',
                          flexShrink: 0
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills Subsection: 2 Lines, 3 Cards Per Line */}
        <div style={{ marginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="badge-neon" style={{ marginBottom: '10px' }}>
              PROFESSIONAL WORK ETHIC
            </div>
            <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', textTransform: 'uppercase' }}>
              SOFT SKILLS & <span className="text-cyan-glow">COLLABORATION MINDSET</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
              Core behavioral strengths documented in resume.
            </p>
          </div>

          {/* 6 Cards Strictly in 2 Rows of 3 on Desktop / Laptop */}
          <div className="soft-skills-container">
            {softSkills.map((skill) => (
              <div
                key={skill.name}
                className="glass-card"
                style={{ padding: '24px 22px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 240, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cyan-core)'
                    }}
                  >
                    <Zap size={16} />
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#FFFFFF' }}>{skill.name}</h4>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
