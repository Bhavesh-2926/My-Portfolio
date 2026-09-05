import React from 'react';
import { Project } from '../../types/portfolio';
import { X, ExternalLink, CheckCircle2, Layers, Cpu } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 240, 255, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          aria-label="Close project modal"
        >
          <X size={20} />
        </button>

        {/* Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span className="badge-neon">{project.category}</span>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#38BDF8',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            {project.status}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.85rem', marginBottom: '16px', lineHeight: 1.25 }}>
          {project.title}
        </h2>

        {/* Summary */}
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          {project.description || project.summary}
        </p>

        {/* Technologies Badge Group */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--cyan-core)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            <Cpu size={16} /> CORE ARCHITECTURE & TECHNOLOGIES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  color: '#BAE6FD',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Architectural Features */}
        {project.features && project.features.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--cyan-core)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              <Layers size={16} /> ENGINEERING HIGHLIGHTS & CAPABILITIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={17} color="#00F0FF" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan"
            >
              <ExternalLink size={16} /> Open Live Production
            </a>
          )}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass"
          >
            <GithubIcon size={16} /> View Source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
