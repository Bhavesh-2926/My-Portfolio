import { ProfileData, Project, Experience, Education, SkillCategory, Achievement, ContactMessage } from '../types/portfolio';

export const defaultProfile: ProfileData = {
  name: 'Bhavesh Gupta',
  title: 'Software QA Tester | Software Engineer | AI Developer',
  tagline: 'Bridging rigorous QA test automation, modern full-stack web engineering, and intelligent AI application development.',
  email: 'bhaveshgupta901@gmail.com',
  phone: '+91 9079300045',
  location: 'Kota, Rajasthan, India',
  github: 'https://github.com/Bhavesh-2926',
  linkedin: 'https://www.linkedin.com/in/bhavesh-gupta-13378531a/',
  portfolio: 'https://bhaveshgupta.dev',
  availableForHire: true,
  yearsExperience: '1+',
  projectsCount: '7+',
  technologiesCount: '15+',
  cgpa: '8.5',
  bio: [
    'Software QA Tester, Software Engineer, and AI Developer with hands-on experience across full-stack quality assurance, responsive web development, and AI-assisted engineering.',
    'Expertise in manual and automation testing (Selenium, Rest Assured), thorough test case planning, and defect tracking with Jira across STLC/SDLC workflows to ship defect-free web applications.',
    'Skilled in building clean, accessible user interfaces with HTML5, CSS3, JavaScript (ES6), TypeScript, React, and Python, coupled with AI integration using Groq Cloud LLMs (LLaMA 3.3 70B) and modern generative AI tools.'
  ],
  resumeUrl: '/resume/Bhavesh_Gupta_Resume.pdf',
  resumeFileName: 'Bhavesh_Gupta_Resume.pdf',
  professionTags: ['QA Test Automation', 'Software Engineering', 'AI Development']
};

export const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'SwiftSite - AI Website Builder SaaS',
    slug: 'ai-website-builder',
    category: 'Vibe Code Using AI',
    summary: 'A production-ready SaaS application allowing users to generate complete business landing websites in seconds using a collaborative swarm of three specialized AI engines.',
    description: 'SwiftSite orchestrates a Requirement Engine, Content Copywriting Engine, and Design System Engine. Features a live split-panel visual editor, deep styling customizers (glass blur, glowing borders, animation styles), and a standalone static HTML code exporter.',
    features: [
      'Multi-agent collaborative generation engines (Requirement, Content, Design System)',
      'Live split-panel sandbox with real-time CSS token rendering',
      'Dynamic layout switching (Centered Gradient, Split-Screen, Minimal Left)',
      'Standalone static HTML/CSS/JS compiler with one-click code download',
      'Supabase PostgreSQL database with Row Level Security and Auth'
    ],
    technologies: ['React 19', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'OpenAI GPT', 'Supabase', 'Framer Motion'],
    githubUrl: 'https://github.com/Bhavesh-2926/AI_Website_Builder',
    featured: true,
    status: 'Production Live'
  },
  {
    id: 'proj-2',
    title: 'AI Medical Report Analyzer',
    slug: 'ai-medical-report-analyzer',
    category: 'Vibe Code Using AI',
    summary: 'Clinical diagnostic intelligence application parsing PDF lab reports to extract vital markers, predict potential conditions, classify health risks, and provide an interactive AI Medical Chatbot.',
    description: 'Engineered with Python, MySQL, and Groq Cloud AI running LLaMA 3.3 70B for sub-second inference. Features full patient and administrator portals, ReportLab PDF clinical summary generation, audit logging, and side-by-side historical lab comparison.',
    features: [
      'Automated text & biomarker extraction from digital PDF medical reports',
      'Ultra-fast Groq Cloud AI inference with structured clinical risk assessment (Low/Med/High)',
      'In-app context-aware AI Medical Chatbot for symptom queries and drug explanations',
      'Comprehensive Admin portal with metrics, audit logs, and user access oversight',
      'Branded PDF export using ReportLab for clinical documentation'
    ],
    technologies: ['Python 3.10+', 'Groq Cloud AI', 'LLaMA 3.3 70B', 'Tkinter', 'MySQL', 'ReportLab', 'PyPDF'],
    githubUrl: 'https://github.com/Bhavesh-2926/ai-medical-report-analyzer',
    featured: true,
    status: 'Production Live'
  },
  {
    id: 'proj-3',
    title: 'CineMatch – Movie Recommender Web App',
    slug: 'cinematch-movie-recommender',
    category: 'Web Development',
    summary: 'A full-stack movie recommendation platform utilizing content-based machine learning with text embedding and cosine similarity, backed by live TMDB API metadata.',
    description: 'Features a hybrid architecture dynamically switching between Live Mode (querying TMDB for official cover art and metadata) and Offline ML Mode (using Scikit-Learn vectorization on pre-trained Kaggle datasets). Styled with dark cinema glassmorphism.',
    features: [
      'Content-based recommendation engine using CountVectorizer and cosine similarity',
      'Dynamic hybrid architecture with live TMDB API integration and local ML fallback',
      'Fuzzy input matching and real-time autocomplete suggestions',
      'Responsive cinema dark-theme with glassmorphic cards and loading skeletons',
      'FastAPI microservice backend deployed on Render with React/Vite frontend on Vercel'
    ],
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'Scikit-Learn', 'TMDB API', 'Vercel'],
    githubUrl: 'https://github.com/Bhavesh-2926/CineMatch_Movie_Recommender',
    liveUrl: 'https://cinematchmovierecommender.vercel.app',
    featured: true,
    status: 'Production Live'
  },
  {
    id: 'proj-4',
    title: 'Hype Rooftop Cafe & Digital Menu',
    slug: 'hype-cafe-website',
    category: 'Web Development',
    summary: 'An interactive, responsive single-page digital experience designed with cozy watercolor aesthetics, swinging rope navigation planks, and 3D polaroid tilt physics.',
    description: 'Built for Hype Rooftop Cafe in Kota. Features GPU-accelerated custom star cursor, GSAP ScrollTrigger entrance transitions, single-screen desktop fold optimization, and an interactive glassmorphic QR Code menu modal.',
    features: [
      'Swinging wooden plank navigation with realistic physics keyframes',
      '3D polaroid photo tilt effect responding dynamically to mouse coordinates',
      'GSAP ScrollTrigger and ScrollToPlugin for fluid section transitions',
      'Interactive QR Code digital menu modal with background scroll locking',
      'Responsive design adapting from desktop columns to compact mobile layout'
    ],
    technologies: ['HTML5', 'Vanilla CSS', 'JavaScript ES6+', 'GSAP v3', 'ScrollTrigger', 'Vercel'],
    githubUrl: 'https://github.com/Bhavesh-2926/Hype_Cafe_Website',
    liveUrl: 'https://hypecafewebsite.vercel.app',
    featured: true,
    status: 'Production Live'
  },
  {
    id: 'proj-5',
    title: 'Food Delivery Responsive Platform',
    slug: 'food-delivery-landing-page',
    category: 'Web Development',
    summary: 'A modern, high-performance food delivery landing page with interactive menu catalog, customer review testimonials, and client-side form validation.',
    description: 'Engineered with clean semantic markup, flexible CSS Grid/Flexbox layouts, sticky navigation bar, and real-time form validation with error reporting.',
    features: [
      'Sticky navigation header with mobile hamburger drawer navigation',
      'Popular dishes catalog with price badges and order call-to-actions',
      'Real-time client-side form validation for email, phone, and messages',
      'Optimized lightweight asset delivery without bulky third-party dependencies'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript ES6', 'Flexbox', 'Responsive Design'],
    githubUrl: 'https://github.com/Bhavesh-2926/Food_Delivery_landing_page',
    featured: false,
    status: 'Completed'
  },
  {
    id: 'proj-6',
    title: 'House Price Prediction Regression Model',
    slug: 'house-price-prediction',
    category: 'Vibe Code Using AI',
    summary: 'Supervised machine learning regression model built with Python to estimate residential property valuations based on location, amenities, and furnishings.',
    description: 'Employs exploratory data analysis (EDA), feature engineering, outlier detection, and regression algorithms (Linear Regression, Decision Trees) to predict accurate property price valuations.',
    features: [
      'Data preprocessing, handling missing values, and categorical feature encoding',
      'Statistical correlation analysis between property square footage, bedrooms, and price',
      'Evaluation metrics using RMSE, MAE, and R-squared scoring',
      'Comprehensive Jupyter notebook documentation with Seaborn data visualizations'
    ],
    technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Jupyter'],
    githubUrl: 'https://github.com/Bhavesh-2926/House_Price_Prediction_Regression_Model',
    featured: false,
    status: 'Completed'
  },
  {
    id: 'proj-7',
    title: 'QA Test Automation & Verification Suites',
    slug: 'qa-manual-testing-projects',
    category: 'Software QA',
    summary: 'Comprehensive testing and defect verification suites covering e-commerce, online banking (ParaBank), cross-browser platforms (Sauce Labs), and Shopify demo stores.',
    description: 'Includes detailed test plans, boundary value analysis, regression suites, and bug tracking reports. Built basic automation scripts using Selenium for UI and Rest Assured for API validation.',
    features: [
      'Detailed test plans, test scenarios, and traceability matrices',
      'Execution of Smoke, Sanity, Regression, Performance, and Cross-Browser tests',
      'Bug reporting and defect lifecycle tracking in Jira with reproducible steps',
      'Automated UI validation scripts using Selenium and API testing with Rest Assured'
    ],
    technologies: ['Selenium', 'Rest Assured', 'Jira', 'Agile/Scrum', 'SDLC/STLC', 'Manual Testing'],
    githubUrl: 'https://github.com/Bhavesh-2926/QA-Manual-Testing-Projects',
    featured: true,
    status: 'Completed'
  }
];

export const defaultExperiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Software Engineer',
    company: 'ASP OL Media Pvt. Ltd.',
    location: 'Pune, Maharashtra',
    startDate: 'May 2025',
    endDate: 'Jan 2026',
    type: 'Full-time',
    responsibilities: [
      'Wrote detailed test plans, test cases, and test scenarios to ensure thorough coverage of website functionality.',
      'Performed Smoke, Sanity, Regression, and Performance testing to validate features and catch issues after updates.',
      'Identified and logged software bugs in Jira with clear, reproducible reports; collaborated with developers to track fixes through resolution.',
      'Built basic automation scripts using Selenium for UI testing and Rest Assured for API testing.',
      'Created bug reports and quality summaries to keep stakeholders informed on release readiness.'
    ],
    technologies: ['Selenium', 'Rest Assured', 'Jira', 'Regression Testing', 'API Testing', 'SDLC/STLC'],
    achievements: [
      'Streamlined bug triage cycle by establishing standardized defect reporting templates in Jira.',
      'Authored automated regression test suites covering key customer authentication and checkout flows.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Software Intern',
    company: 'Internshala Edutech Pvt. Ltd.',
    location: 'Jaipur, Rajasthan',
    startDate: 'Aug 2024',
    endDate: 'Oct 2024',
    type: 'Internship',
    responsibilities: [
      'Built two live projects — a Voice Assistant Model and an E-commerce website — using Python and the Django framework.',
      'Applied Python libraries and SQL queries to implement core application features and data handling.',
      'Participated in code reviews, database schema design, and frontend template integration.'
    ],
    technologies: ['Python', 'Django', 'SQL', 'REST API', 'JavaScript', 'HTML5/CSS3'],
    achievements: [
      'Successfully delivered a fully functional voice assistant prototype integrated with speech recognition modules.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Intern / Industrial Trainee',
    company: 'Bharat Intern Pvt. Ltd.',
    location: 'Jaipur, Rajasthan',
    startDate: 'Aug 2024',
    endDate: 'Sep 2024',
    type: 'Trainee',
    responsibilities: [
      'Learned Machine Learning fundamentals using Python, key ML libraries (Scikit-Learn, Pandas, NumPy), and SQL for data queries.',
      'Built a Movie Recommendation System using content-based filtering, similar to recommendation engines used by OTT platforms.',
      'Built a House Price Prediction Model to estimate property prices based on locality, furnishing, and amenities.'
    ],
    technologies: ['Python', 'Machine Learning', 'Scikit-Learn', 'Pandas', 'NumPy', 'Data Analysis'],
    achievements: [
      'Trained and evaluated content-based filtering algorithms with cosine similarity scoring.'
    ]
  }
];

export const defaultEducation: Education[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology, Computer Science',
    institution: 'Gurukul Institute of Engineering & Technology',
    location: 'Kota, Rajasthan',
    startDate: 'Aug 2022',
    endDate: 'May 2025',
    grade: '8.5',
    gradeType: 'CGPA',
    description: 'Coursework covering Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Software Engineering, and Web Technologies.'
  },
  {
    id: 'edu-2',
    degree: 'Diploma, Computer Science',
    institution: 'Government Polytechnic College',
    location: 'Jhalawar, Rajasthan',
    startDate: 'Sep 2020',
    endDate: 'Apr 2022',
    grade: '62%',
    gradeType: 'Percentage',
    description: 'Foundational computer programming (C/C++), computer architecture, hardware diagnostics, and relational databases.'
  }
];

// EXACT skills matching user's resume verbatim
export const defaultSkills: SkillCategory[] = [
  {
    category: 'QA & Testing',
    skills: [
      { name: 'SDLC', level: 'Core' },
      { name: 'STLC', level: 'Core' },
      { name: 'Manual Testing', level: 'Core' },
      { name: 'Smoke Testing', level: 'Core' },
      { name: 'Sanity Testing', level: 'Core' },
      { name: 'Regression Testing', level: 'Core' },
      { name: 'Performance Testing', level: 'Core' },
      { name: 'Selenium', level: 'Automation' },
      { name: 'Rest Assured', level: 'API Testing' },
      { name: 'Agile', level: 'Methodology' },
      { name: 'Jira', level: 'Defect Tracking' }
    ]
  },
  {
    category: 'Frontend Development',
    skills: [
      { name: 'HTML5', level: 'Core' },
      { name: 'CSS3', level: 'Core' },
      { name: 'JavaScript (ES6)', level: 'Language' },
      { name: 'TypeScript', level: 'Language' },
      { name: 'React.js', level: 'Framework' },
      { name: 'WordPress', level: 'CMS' },
      { name: 'Responsive Web Design', level: 'Design' },
      { name: 'REST API Integration', level: 'Integration' },
      { name: 'UI/UX', level: 'Design' }
    ]
  },
  {
    category: 'Backend & Database',
    skills: [
      { name: 'Python', level: 'Language' },
      { name: 'Django', level: 'Framework' },
      { name: 'MySQL', level: 'Database' },
      { name: 'Firebase', level: 'Cloud DB' },
      { name: 'Supabase', level: 'Cloud DB' }
    ]
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 'Version Control' },
      { name: 'GitHub', level: 'Platform' },
      { name: 'Antigravity', level: 'IDE' },
      { name: 'VS Code', level: 'IDE' },
      { name: 'Cursor', level: 'IDE' },
      { name: 'Vercel', level: 'Deployment' },
      { name: 'Netlify', level: 'Deployment' },
      { name: 'Render', level: 'Deployment' },
      { name: 'MS Excel', level: 'Tool' },
      { name: 'MS Word', level: 'Tool' },
      { name: 'MS PowerPoint', level: 'Tool' },
      { name: 'Google Sheets', level: 'Tool' },
      { name: 'Google Forms', level: 'Tool' }
    ]
  },
  {
    category: 'AI Tools',
    skills: [
      { name: 'ChatGPT', level: 'GenAI' },
      { name: 'Claude', level: 'GenAI' },
      { name: 'Gemini', level: 'GenAI' },
      { name: 'Google Stitch', level: 'Design AI' },
      { name: 'Loveable', level: 'Development AI' }
    ]
  }
];

export const softSkillsList = [
  { name: 'Time Management', desc: 'Prioritizing deliverables and meeting deadlines with structured sprints.' },
  { name: 'Attention to Detail', desc: 'Meticulous verification of UI pixel perfection and defect detection.' },
  { name: 'Multi-Tasking', desc: 'Seamlessly balancing QA test suites, frontend development, and AI tools.' },
  { name: 'Problem Solving', desc: 'Analyzing software bugs and engineering scalable, reliable solutions.' },
  { name: 'Quick Learner', desc: 'Rapidly adopting new frameworks, AI toolchains, and testing methodologies.' },
  { name: 'Communication', desc: 'Clear documentation, reproducible bug logs, and collaborative team alignment.' }
];

export const defaultAchievements: Achievement[] = [
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
  },
  {
    id: 'ach-4',
    title: 'HTML, CSS, JavaScript, Bootstrap – Full Stack Course',
    organization: 'Udemy Certified',
    type: 'Certification',
    description: 'Completed comprehensive full-stack web development certification.'
  },
  {
    id: 'ach-5',
    title: 'Programming in Python with AI',
    organization: 'Certified Course',
    type: 'Certification',
    description: 'Certified in Python programming, machine learning fundamentals, and AI development.'
  }
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techscale.io',
    subject: 'Software Engineer & QA Role Inquiry',
    message: 'Hi Bhavesh, I saw your CineMatch and AI Medical Report Analyzer projects. We have an opening for a Software Engineer with QA testing experience on our product team.',
    createdAt: '2026-09-01 10:30 AM',
    read: true
  },
  {
    id: 'msg-2',
    name: 'Rahul Sharma',
    email: 'rahul@innovatehub.in',
    subject: 'AI Web Platform Consultation',
    message: 'Loved your SwiftSite AI builder architecture! Would love to discuss collaboration for an AI dashboard we are developing.',
    createdAt: '2026-09-03 04:15 PM',
    read: false
  }
];
