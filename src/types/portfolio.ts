export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'Software QA' | 'Web Development' | 'Vibe Code Using AI' | string;
  summary: string;
  description: string;
  features: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  status: 'Completed' | 'In Progress' | 'Production Live';
  stars?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  type: 'Full-time' | 'Internship' | 'Trainee';
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  gradeType: 'CGPA' | 'Percentage';
  description?: string;
}

export interface SoftSkill {
  name: string;
  desc: string;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: string;
    iconName?: string;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date?: string;
  type: 'Award' | 'Leadership' | 'Certification';
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  availableForHire: boolean;
  yearsExperience: string;
  projectsCount: string;
  technologiesCount: string;
  cgpa: string;
  bio: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  professionTags?: string[];
}
