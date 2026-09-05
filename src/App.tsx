import React, { useState, useEffect } from 'react';
import { getStoredData } from './lib/supabaseClient';
import { Cursor } from './components/ui/Cursor';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { ExperienceSection } from './sections/Experience';
import { ProjectsSection } from './sections/Projects';
import { EducationSection } from './sections/Education';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { AdminPanel } from './admin/AdminPanel';

const isPathAdmin = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    hash.startsWith('#recovery') ||
    search.includes('recovery_token')
  );
};

export const App: React.FC = () => {
  const [data, setData] = useState(getStoredData());
  const [isAdminView, setIsAdminView] = useState<boolean>(isPathAdmin());

  useEffect(() => {
    const handleUpdate = () => {
      setData(getStoredData());
    };

    const handleLocation = () => {
      setIsAdminView(isPathAdmin());
    };

    window.addEventListener('portfolio-data-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);

    // Optional owner hotkey: Ctrl + Shift + A to open /admin without typing in address bar
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.history.pushState({}, '', '/admin');
        setIsAdminView(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('portfolio-data-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Magnetic Desktop Cursor */}
      <Cursor />

      {/* When on /admin route, display Admin Control Center */}
      {isAdminView ? (
        <AdminPanel
          onClose={handleCloseAdmin}
          profile={data.profile}
          projects={data.projects}
          experiences={data.experiences}
          skills={data.skills}
          softSkills={data.softSkills}
          education={data.education}
          achievements={data.achievements}
          messages={data.messages}
        />
      ) : (
        <>
          {/* Floating Glass Navigation */}
          <Navbar
            resumeUrl={data.profile.resumeUrl}
            resumeFileName={data.profile.resumeFileName}
            name={data.profile.name}
            title={data.profile.title}
          />

          {/* Main Portfolio Sections */}
          <main>
            <Hero profile={data.profile} />
            <About profile={data.profile} achievements={data.achievements} />
            <Skills skills={data.skills} softSkills={data.softSkills} />
            <ExperienceSection experiences={data.experiences} />
            <ProjectsSection projects={data.projects} />
            <EducationSection education={data.education} achievements={data.achievements} />
            <Contact profile={data.profile} />
          </main>

          {/* Clean Footer without any public admin link */}
          <Footer profile={data.profile} />
        </>
      )}
    </div>
  );
};

export default App;
