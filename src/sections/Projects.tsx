import React, { useState } from 'react';
import { Project } from '../types/portfolio';
import { ProjectModal } from '../components/ui/ProjectModal';
import { ExternalLink, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../components/ui/SocialIcons';

interface ProjectsProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsProps> = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectCategories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
  const defaultCategories = ['Software QA', 'Web Development', 'Vibe Code Using AI'];
  const categories = ['All', ...Array.from(new Set([...defaultCategories, ...projectCategories]))];

  const activeCategory = categories.some((c) => c.toLowerCase() === activeFilter.toLowerCase())
    ? activeFilter
    : 'All';

  const filteredProjects = activeCategory.toLowerCase() === 'all'
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="projects" className="section-spacing">
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            ENGINEERING SHOWCASE
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', textTransform: 'uppercase' }}>
            FEATURED <span className="text-cyan-glow">PROJECTS</span> & OPEN SOURCE
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '14px auto 0', fontSize: '0.95rem' }}>
            Verified repositories and live applications across AI systems, full-stack web platforms, and automated QA testing suites.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '48px'
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(11, 20, 44, 0.55)',
                  color: isActive ? 'var(--cyan-core)' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 0 16px rgba(0, 240, 255, 0.35)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects 3D Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '26px'
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card"
              style={{
                padding: '30px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedProject(project)}
            >
              <div>
                {/* Header & Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className="badge-neon" style={{ fontSize: '0.72rem' }}>
                    {project.category}
                  </span>
                  {project.featured && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: '#FCD34D',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(245, 158, 11, 0.25)'
                      }}
                    >
                      <Sparkles size={11} /> FEATURED
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.35rem',
                    color: '#FFFFFF',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <span>{project.title}</span>
                  <ArrowUpRight size={18} color="var(--cyan-core)" style={{ flexShrink: 0 }} />
                </h3>

                {/* Summary */}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {project.summary}
                </p>

                {/* Technologies Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="badge-tag">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="badge-tag" style={{ color: 'var(--cyan-core)' }}>
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyan"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <GithubIcon size={14} /> GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
