import React, { useState, useEffect } from 'react';
import {
  Project,
  Experience,
  Education,
  SkillCategory,
  ContactMessage,
  ProfileData,
  Achievement,
  SoftSkill
} from '../types/portfolio';
import {
  KEYS,
  saveItem,
  getStoredData,
  resetToDefaults,
  isAdminAuthenticated,
  setAdminAuth,
  syncSupabaseMessages,
  getSupabaseConfig,
  saveSupabaseConfig,
  getSupabase,
  getAdminCredentials,
  saveAdminCredentials,
  verifyAdminLogin,
  verifyOldCredentials,
  changeAdminPasswordWithOldVerification,
  syncAdminCredentialsFromSupabase,
  pushAllContentToSupabase,
  syncPortfolioContentFromSupabase,
  requestPasswordReset,
  verifyResetToken,
  completePasswordReset,
  uploadResumeFile,
  AdminCredentials
} from '../lib/supabaseClient';
import { softSkillsList } from '../lib/defaultData';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Wrench,
  Mail,
  FileText,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ExternalLink,
  Shield,
  Upload,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  Home,
  User,
  GraduationCap,
  Award,
  Phone,
  MessageSquare,
  Flame,
  Zap,
  CheckCircle2,
  Database,
  Copy,
  ChevronRight,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Send,
  Lock,
  Unlock
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  profile: ProfileData;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  softSkills?: SoftSkill[];
  education: Education[];
  achievements: Achievement[];
  messages: ContactMessage[];
}

type AdminTab =
  | 'overview'
  | 'messages'
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'contact'
  | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  profile: initialProfile,
  projects: initialProjects,
  experiences: initialExperiences,
  skills: initialSkills,
  softSkills: initialSoftSkills = softSkillsList,
  education: initialEducation,
  achievements: initialAchievements,
  messages: initialMessages
}) => {
  // ALWAYS require authentication when opening admin panel (do not auto-authenticate)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentialsState] = useState<AdminCredentials>(getAdminCredentials());

  // Determine initial mode based on recovery parameters in URL
  const [authMode, setAuthMode] = useState<'login' | 'forgot' | 'reset'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState(adminCredentials.email || 'bhaveshgupta901@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState(adminCredentials.email || 'bhaveshgupta901@gmail.com');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [resetTokenInfo, setResetTokenInfo] = useState<{ token?: string; confirmUrl?: string } | null>(null);

  // Set New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Account Settings inside Admin Panel - Old-to-New Password Verification & Update
  const [oldCredEmail, setOldCredEmail] = useState(adminCredentials.email || 'bhaveshgupta901@gmail.com');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [isOldVerified, setIsOldVerified] = useState(false);
  const [verifyOldLoading, setVerifyOldLoading] = useState(false);
  const [verifyOldError, setVerifyOldError] = useState<string | null>(null);

  // New Password generation fields (strictly locked until old credentials verified)
  const [newAdminEmail, setNewAdminEmail] = useState(adminCredentials.email || 'bhaveshgupta901@gmail.com');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState('');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);

  // Settings Forgotten Password Recovery State
  const [settingsRecoverySent, setSettingsRecoverySent] = useState<string | null>(null);
  const [settingsRecoveryInfo, setSettingsRecoveryInfo] = useState<{ token?: string; confirmUrl?: string; email?: string } | null>(null);
  const [settingsRecoveryLoading, setSettingsRecoveryLoading] = useState(false);

  // Profession Tags & Identity State
  const [newProfessionTagInput, setNewProfessionTagInput] = useState('');
  const [saveIdentitySuccess, setSaveIdentitySuccess] = useState(false);

  // Resume Upload State
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState<string | null>(null);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if entered with recovery token or hash
    const params = new URLSearchParams(window.location.search);
    const token = params.get('recovery_token');
    const hash = window.location.hash;
    if (token) {
      if (verifyResetToken(token)) {
        setResetTokenInfo({ token, confirmUrl: window.location.href });
        setAuthMode('reset');
      }
    } else if (hash.includes('recovery') || hash.includes('type=recovery')) {
      setAuthMode('reset');
    }

    // Sync admin credentials from Supabase if connected
    syncAdminCredentialsFromSupabase().then((creds) => {
      setAdminCredentialsState(creds);
      setOldCredEmail(creds.email);
      setNewAdminEmail(creds.email);
    });

    const handleCredsUpdate = () => {
      const current = getAdminCredentials();
      setAdminCredentialsState(current);
      setOldCredEmail(current.email);
      setNewAdminEmail(current.email);
    };

    const handleDataUpdate = () => {
      const latest = getStoredData();
      setProfile(latest.profile);
      setProjects(latest.projects);
      setExperiences(latest.experiences);
      setSkills(latest.skills);
      setSoftSkills(latest.softSkills);
      setEducation(latest.education);
      setAchievements(latest.achievements);
      setMessages(latest.messages);
    };

    window.addEventListener('portfolio-admin-creds-updated', handleCredsUpdate);
    window.addEventListener('portfolio-data-updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener('portfolio-admin-creds-updated', handleCredsUpdate);
      window.removeEventListener('portfolio-data-updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Sub-tab toggles
  const [aboutSubTab, setAboutSubTab] = useState<'main' | 'achievements'>('main');
  const [skillsSubTab, setSkillsSubTab] = useState<'technical' | 'soft'>('technical');
  const [educationSubTab, setEducationSubTab] = useState<'degrees' | 'certifications'>('degrees');

  // Master State
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>(initialSoftSkills);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // Modals & Editors
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isNewExperience, setIsNewExperience] = useState(false);

  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isNewEducation, setIsNewEducation] = useState(false);

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isNewAchievement, setIsNewAchievement] = useState(false);

  const [editingSoftSkill, setEditingSoftSkill] = useState<{ index: number; item: SoftSkill } | null>(null);
  const [isNewSoftSkill, setIsNewSoftSkill] = useState(false);

  // Search & Filter in Messages
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase Config State
  const [supabaseConfig, setSupabaseConfigState] = useState(getSupabaseConfig());
  const [saveConfigSuccess, setSaveConfigSuccess] = useState(false);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  // Unread messages count
  const unreadCount = messages.filter((m) => !m.read).length;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await verifyAdminLogin(loginEmail, loginPassword);
      if (res.success) {
        setIsAuthenticated(true);
        setLoginPassword('');
      } else {
        setLoginError(res.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication error.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess(null);
    try {
      const res = await requestPasswordReset(forgotEmail);
      if (res.success) {
        setForgotSuccess(res.message);
        setResetTokenInfo({ token: res.token, confirmUrl: res.confirmUrl });
      } else {
        setForgotError(res.message);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send confirmation email.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Confirm Token & Open New Password Creation
  const handleConfirmTokenAndOpenReset = (token?: string) => {
    const activeToken = token || resetTokenInfo?.token;
    if (activeToken && verifyResetToken(activeToken)) {
      setResetTokenInfo({ token: activeToken, confirmUrl: `${window.location.origin}/admin?recovery_token=${activeToken}` });
    }
    setAuthMode('reset');
    setIsAuthenticated(false);
    setResetError('');
    setResetSuccess('');
  };

  // Set New Password (STRICT: from now on, only this new password will open Admin Panel)
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match. Please re-enter.');
      return;
    }

    setResetLoading(true);
    setResetError('');
    try {
      const res = await completePasswordReset(newPassword, resetTokenInfo?.token);
      if (res.success) {
        setResetSuccess('New password activated successfully! The admin panel will now open ONLY with this new password. Redirecting to login...');
        window.history.replaceState({}, '', '/admin');
        const fresh = getAdminCredentials();
        setAdminCredentialsState(fresh);
        setTimeout(() => {
          setAuthMode('login');
          setLoginEmail(fresh.email);
          setLoginPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setResetSuccess('');
          setForgotSuccess(null);
          setResetTokenInfo(null);
        }, 2000);
      } else {
        setResetError(res.message);
      }
    } catch (err: any) {
      setResetError(err.message || 'Failed to update password.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    onClose();
  };

  // Verify Old Credentials in Settings
  const handleVerifyOldCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyOldLoading(true);
    setVerifyOldError(null);
    try {
      const res = await verifyOldCredentials(oldCredEmail, oldPasswordInput);
      if (res.success) {
        setIsOldVerified(true);
        setNewAdminEmail(oldCredEmail);
        setVerifyOldError(null);
      } else {
        setIsOldVerified(false);
        setVerifyOldError(res.message || 'Verification failed. Registered email or old password is incorrect.');
      }
    } catch (err: any) {
      setIsOldVerified(false);
      setVerifyOldError(err.message || 'Verification check error.');
    } finally {
      setVerifyOldLoading(false);
    }
  };

  // Save New Password with Old Password Verification
  const handleSaveNewPasswordWithOldVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);
    setChangePasswordSuccess(null);

    if (!newAdminPassword || newAdminPassword.length < 6) {
      setChangePasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newAdminPassword !== newAdminConfirmPassword) {
      setChangePasswordError('New password and password confirmation do not match.');
      return;
    }

    if (newAdminPassword === oldPasswordInput) {
      setChangePasswordError('New password must be different from your old password.');
      return;
    }

    setChangePasswordLoading(true);
    try {
      const res = await changeAdminPasswordWithOldVerification(
        oldCredEmail,
        oldPasswordInput,
        newAdminPassword,
        newAdminEmail
      );

      if (res.success) {
        setChangePasswordSuccess(res.message);
        const latest = getAdminCredentials();
        setAdminCredentialsState(latest);
        setOldCredEmail(latest.email);
        setOldPasswordInput('');
        setNewAdminPassword('');
        setNewAdminConfirmPassword('');
        setIsOldVerified(false); // Relock generator after success
        setTimeout(() => setChangePasswordSuccess(null), 6000);
      } else {
        setChangePasswordError(res.message);
      }
    } catch (err: any) {
      setChangePasswordError(err.message || 'Failed to update password.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Trigger Recovery from Settings (Sends Gmail with confirmation button)
  const handleTriggerRecoveryFromSettings = async () => {
    setSettingsRecoveryLoading(true);
    setSettingsRecoverySent(null);
    setSettingsRecoveryInfo(null);
    setVerifyOldError(null);
    try {
      const targetEmail = oldCredEmail.trim() || adminCredentials.email;
      const res = await requestPasswordReset(targetEmail);
      if (res.success) {
        setSettingsRecoverySent(res.message);
        setSettingsRecoveryInfo({ token: res.token, confirmUrl: res.confirmUrl, email: targetEmail });
      } else {
        setVerifyOldError(res.message);
      }
    } catch (err: any) {
      setVerifyOldError(err.message || 'Failed to trigger password reset.');
    } finally {
      setSettingsRecoveryLoading(false);
    }
  };

  const handleAddProfessionTag = () => {
    if (newProfessionTagInput.trim()) {
      const currentTags = profile.professionTags || ['QA Test Automation', 'Software Engineering', 'AI Development'];
      if (!currentTags.includes(newProfessionTagInput.trim())) {
        const updatedTags = [...currentTags, newProfessionTagInput.trim()];
        const updatedProfile = { ...profile, professionTags: updatedTags };
        setProfile(updatedProfile);
        saveItem(KEYS.PROFILE, updatedProfile);
      }
      setNewProfessionTagInput('');
    }
  };

  const handleRemoveProfessionTag = (tagToRemove: string) => {
    const currentTags = profile.professionTags || ['QA Test Automation', 'Software Engineering', 'AI Development'];
    const updatedTags = currentTags.filter((t) => t !== tagToRemove);
    const updatedProfile = { ...profile, professionTags: updatedTags };
    setProfile(updatedProfile);
    saveItem(KEYS.PROFILE, updatedProfile);
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    saveItem(KEYS.PROFILE, profile);
    setSaveIdentitySuccess(true);
    setTimeout(() => setSaveIdentitySuccess(false), 3000);
  };

  // Resume Upload Handlers
  const handleResumeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedResumeFile(e.target.files[0]);
      setResumeUploadError(null);
      setResumeUploadSuccess(null);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedResumeFile) {
      setResumeUploadError('Please select a resume file (.pdf, .docx, or .doc) to upload.');
      return;
    }

    setResumeUploading(true);
    setResumeUploadError(null);
    setResumeUploadSuccess(null);

    try {
      const res = await uploadResumeFile(selectedResumeFile);
      if (res.success) {
        const updated: ProfileData = {
          ...profile,
          resumeUrl: res.url,
          resumeFileName: res.fileName
        };
        setProfile(updated);
        saveItem(KEYS.PROFILE, updated);
        setSelectedResumeFile(null);
        setResumeUploadSuccess(
          `Resume updated successfully (${res.source === 'supabase' ? 'Stored in Supabase Cloud Storage' : 'Cached in Local Storage'})! All download buttons across your portfolio have been updated.`
        );
        setTimeout(() => setResumeUploadSuccess(null), 7000);
      } else {
        setResumeUploadError(res.error || 'Failed to process resume file.');
      }
    } catch (err: any) {
      setResumeUploadError(err.message || 'Failed to upload resume.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResetResumeToDefault = () => {
    const updated: ProfileData = {
      ...profile,
      resumeUrl: '/resume/Bhavesh_Gupta_Resume.pdf',
      resumeFileName: 'Bhavesh_Gupta_Resume.pdf'
    };
    setProfile(updated);
    saveItem(KEYS.PROFILE, updated);
    setResumeUploadSuccess('Reverted back to default resume document.');
    setTimeout(() => setResumeUploadSuccess(null), 4000);
  };

  // --- SAVE HANDLERS ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveItem(KEYS.PROFILE, profile);
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 3000);
  };

  // Project CRUD
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updated: Project[];
    if (isNewProject) {
      updated = [editingProject, ...projects];
    } else {
      updated = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    }

    setProjects(updated);
    saveItem(KEYS.PROJECTS, updated);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveItem(KEYS.PROJECTS, updated);
    }
  };

  // Experience CRUD
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    let updated: Experience[];
    if (isNewExperience) {
      updated = [editingExperience, ...experiences];
    } else {
      updated = experiences.map((exp) => (exp.id === editingExperience.id ? editingExperience : exp));
    }

    setExperiences(updated);
    saveItem(KEYS.EXPERIENCES, updated);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('Delete this experience entry?')) {
      const updated = experiences.filter((exp) => exp.id !== id);
      setExperiences(updated);
      saveItem(KEYS.EXPERIENCES, updated);
    }
  };

  // Education CRUD
  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEducation) return;

    let updated: Education[];
    if (isNewEducation) {
      updated = [editingEducation, ...education];
    } else {
      updated = education.map((edu) => (edu.id === editingEducation.id ? editingEducation : edu));
    }

    setEducation(updated);
    saveItem(KEYS.EDUCATION, updated);
    setEditingEducation(null);
  };

  const handleDeleteEducation = (id: string) => {
    if (window.confirm('Delete this education entry?')) {
      const updated = education.filter((edu) => edu.id !== id);
      setEducation(updated);
      saveItem(KEYS.EDUCATION, updated);
    }
  };

  // Achievement & Certification CRUD
  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement) return;

    let updated: Achievement[];
    if (isNewAchievement) {
      updated = [editingAchievement, ...achievements];
    } else {
      updated = achievements.map((a) => (a.id === editingAchievement.id ? editingAchievement : a));
    }

    setAchievements(updated);
    saveItem(KEYS.ACHIEVEMENTS, updated);
    setEditingAchievement(null);
  };

  const handleDeleteAchievement = (id: string) => {
    if (window.confirm('Delete this item?')) {
      const updated = achievements.filter((a) => a.id !== id);
      setAchievements(updated);
      saveItem(KEYS.ACHIEVEMENTS, updated);
    }
  };

  // Soft Skills CRUD
  const handleSaveSoftSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoftSkill) return;

    let updated: SoftSkill[];
    if (isNewSoftSkill) {
      updated = [...softSkills, editingSoftSkill.item];
    } else {
      updated = softSkills.map((s, idx) => (idx === editingSoftSkill.index ? editingSoftSkill.item : s));
    }

    setSoftSkills(updated);
    saveItem(KEYS.SOFT_SKILLS, updated);
    setEditingSoftSkill(null);
  };

  const handleDeleteSoftSkill = (index: number) => {
    if (window.confirm('Delete this soft skill card?')) {
      const updated = softSkills.filter((_, idx) => idx !== index);
      setSoftSkills(updated);
      saveItem(KEYS.SOFT_SKILLS, updated);
    }
  };

  // Messages CRUD & Supabase Sync
  const handleToggleRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m));
    setMessages(updated);
    saveItem(KEYS.MESSAGES, updated);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Delete this message?')) {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      saveItem(KEYS.MESSAGES, updated);
    }
  };

  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to Supabase...');
    const result = await syncSupabaseMessages();
    setIsSyncing(false);
    if (result) {
      setMessages(result);
      setSyncStatus(`Successfully synchronized ${result.length} messages.`);
    } else {
      setSyncStatus('Using local storage messages (Supabase table not reachable or empty).');
    }
    setTimeout(() => setSyncStatus(null), 5000);
  };

  const [pushLoading, setPushLoading] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pullLoading, setPullLoading] = useState(false);
  const [pullResult, setPullResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePushAllContent = async () => {
    setPushLoading(true);
    setPushResult(null);
    try {
      const res = await pushAllContentToSupabase();
      setPushResult(res);
      setTimeout(() => setPushResult(null), 8000);
    } catch (err: any) {
      setPushResult({ success: false, message: err.message || 'Error pushing content.' });
    } finally {
      setPushLoading(false);
    }
  };

  const handlePullContent = async () => {
    setPullLoading(true);
    setPullResult(null);
    try {
      const ok = await syncPortfolioContentFromSupabase();
      if (ok) {
        const latest = getStoredData();
        setProfile(latest.profile);
        setProjects(latest.projects);
        setExperiences(latest.experiences);
        setSkills(latest.skills);
        setSoftSkills(latest.softSkills);
        setEducation(latest.education);
        setAchievements(latest.achievements);
        setPullResult({ success: true, message: 'Successfully refreshed all portfolio sections from Supabase cloud database!' });
      } else {
        setPullResult({ success: false, message: 'No content found in Supabase portfolio_content table yet. Use "Push All Content" to upload your data first.' });
      }
      setTimeout(() => setPullResult(null), 8000);
    } catch (err: any) {
      setPullResult({ success: false, message: err.message || 'Error pulling content.' });
    } finally {
      setPullLoading(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseConfig);
    setSaveConfigSuccess(true);
    setTimeout(() => setSaveConfigSuccess(false), 3000);
  };

  const copySqlToClipboard = () => {
    const sql = `-- 1. Contact Form Visitor Inquiries Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- 2. Portfolio Website Content Table (Syncs All Sections: Home, About, Skills, Projects, Experience, Education)
CREATE TABLE IF NOT EXISTS portfolio_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Admin Authentication Credentials Table (Stores Email & Password in Supabase)
CREATE TABLE IF NOT EXISTS admin_auth (
  id TEXT PRIMARY KEY DEFAULT 'admin_primary',
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed for admin_auth
INSERT INTO admin_auth (id, email, password)
VALUES ('admin_primary', 'bhaveshgupta901@gmail.com', 'Admin@Secure2026')
ON CONFLICT (id) DO UPDATE SET email = 'bhaveshgupta901@gmail.com';

-- 4. Password Reset Tokens Table (Stores Password Reset Requests in Supabase)
CREATE TABLE IF NOT EXISTS admin_password_resets (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_password_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin access messages" ON messages FOR ALL USING (true);
CREATE POLICY "Public read portfolio_content" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Admin access portfolio_content" ON portfolio_content FOR ALL USING (true);
CREATE POLICY "Admin auth access" ON admin_auth FOR ALL USING (true);
CREATE POLICY "Admin reset tokens access" ON admin_password_resets FOR ALL USING (true);`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // If not authenticated, render Login / Forgot Password / Set New Password Screen
  if (!isAuthenticated) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.97)',
          backdropFilter: 'blur(24px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '36px 32px',
            border: '1px solid rgba(0, 240, 255, 0.35)',
            boxShadow: '0 0 60px rgba(0, 240, 255, 0.22), 0 20px 40px rgba(0,0,0,0.8)'
          }}
        >
          {/* ================= MODE 1: LOGIN ================= */}
          {authMode === 'login' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #00F0FF 0%, #0070F3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    color: '#040817',
                    boxShadow: '0 0 24px rgba(0, 240, 255, 0.5)'
                  }}
                >
                  <Shield size={28} />
                </div>
                <h2 style={{ fontSize: '1.45rem', color: '#FFFFFF', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.02em' }}>
                  ADMIN CONTROL CENTER
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Protected Administration & Portfolio Management
                </p>
              </div>

              {resetSuccess && (
                <div style={{ color: '#34D399', fontSize: '0.82rem', padding: '10px 14px', backgroundColor: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.06em', fontWeight: 600 }}>
                    ADMIN EMAIL ADDRESS
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="bhaveshgupta901@gmail.com"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-glass-input)',
                        border: '1px solid rgba(0, 240, 255, 0.25)',
                        color: '#FFFFFF',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--cyan-core)',
                        opacity: 0.7
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 600 }}>
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setForgotError('');
                        setForgotSuccess(null);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--cyan-core)',
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'underline'
                      }}
                    >
                      <KeyRound size={12} />
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter admin password"
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 38px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-glass-input)',
                        border: '1px solid rgba(0, 240, 255, 0.25)',
                        color: '#FFFFFF',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                    <Shield
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--cyan-core)',
                        opacity: 0.7
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div
                    style={{
                      color: '#EF4444',
                      fontSize: '0.8rem',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <AlertCircle size={15} />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-cyan"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
                >
                  {loginLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Shield size={16} />
                  )}
                  <span>{loginLoading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('bhaveshgupta901@gmail.com');
                      setLoginPassword('Admin@123');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Quick-fill Admin (Demo)
                  </button>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                    🔒 Authentication required every visit
                  </span>
                </div>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
                <button
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={14} />
                  Return to Public Portfolio
                </button>
              </div>
            </>
          )}

          {/* ================= MODE 2: FORGOT PASSWORD ================= */}
          {authMode === 'forgot' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #00F0FF 0%, #0070F3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    color: '#040817',
                    boxShadow: '0 0 24px rgba(0, 240, 255, 0.5)'
                  }}
                >
                  <KeyRound size={28} />
                </div>
                <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '6px', fontWeight: 800 }}>
                  PASSWORD RECOVERY
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Enter your registered Admin email. We will send you an authentication confirmation message to set your new password.
                </p>
              </div>

              {!forgotSuccess ? (
                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.06em', fontWeight: 600 }}>
                      REGISTERED ADMIN EMAIL
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="bhaveshgupta901@gmail.com"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-glass-input)',
                          border: '1px solid rgba(0, 240, 255, 0.25)',
                          color: '#FFFFFF',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                        required
                      />
                      <Mail
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--cyan-core)',
                          opacity: 0.7
                        }}
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div
                      style={{
                        color: '#EF4444',
                        fontSize: '0.8rem',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <AlertCircle size={15} />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-cyan"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
                  >
                    {forgotLoading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{forgotLoading ? 'Dispatching Confirmation...' : 'Send Confirmation Email'}</span>
                  </button>
                </form>
              ) : (
                /* Confirmation Dispatched State - Gmail Simulation with Confirmation Button */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      backgroundColor: '#0B132B',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {/* Gmail Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EA4335', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>
                          M
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                            Gmail Dispatch Notification
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            To: <span style={{ color: 'var(--cyan-core)' }}>{forgotEmail}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontWeight: 600 }}>
                        DELIVERED
                      </span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                        Subject: 🔒 Action Required: Confirm Password Reset for Portfolio Admin
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Hello Bhavesh, a request was received to reset your password. Click the confirmation button below to verify your request and create your new password:
                      </p>
                    </div>

                    {/* Prominent Confirmation Button */}
                    <button
                      type="button"
                      onClick={() => handleConfirmTokenAndOpenReset(resetTokenInfo?.token)}
                      className="btn-cyan"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '12px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
                      }}
                    >
                      <CheckCircle2 size={18} />
                      <span>CONFIRM PASSWORD RESET & CREATE NEW PASSWORD</span>
                    </button>

                    <div style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Secure token verified • Valid for 30 minutes
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
                <button
                  onClick={() => setAuthMode('login')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--cyan-core)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={14} />
                  Back to Admin Sign In
                </button>
              </div>
            </>
          )}

          {/* ================= MODE 3: SET NEW PASSWORD ================= */}
          {authMode === 'reset' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10B981 0%, #00F0FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    color: '#040817',
                    boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '6px', fontWeight: 800 }}>
                  SET NEW PASSWORD
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Email confirmation accepted for{' '}
                  <span style={{ color: 'var(--cyan-core)' }}>{adminCredentials.email}</span>. Create your new admin password.
                </p>
              </div>

              <form onSubmit={handleSetNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.06em', fontWeight: 600 }}>
                    NEW PASSWORD
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-glass-input)',
                        border: '1px solid rgba(0, 240, 255, 0.25)',
                        color: '#FFFFFF',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.06em', fontWeight: 600 }}>
                    CONFIRM NEW PASSWORD
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-glass-input)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      color: '#FFFFFF',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                    required
                    minLength={6}
                  />
                  {newPassword && confirmNewPassword && (
                    <div style={{ marginTop: '6px', fontSize: '0.76rem' }}>
                      {newPassword === confirmNewPassword ? (
                        <span style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={13} /> Passwords match perfectly
                        </span>
                      ) : (
                        <span style={{ color: '#EF4444' }}>✕ Passwords do not match yet</span>
                      )}
                    </div>
                  )}
                </div>

                {resetError && (
                  <div
                    style={{
                      color: '#EF4444',
                      fontSize: '0.8rem',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <AlertCircle size={15} />
                    <span>{resetError}</span>
                  </div>
                )}

                {resetSuccess && (
                  <div
                    style={{
                      color: '#34D399',
                      fontSize: '0.82rem',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(52, 211, 153, 0.12)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="btn-cyan"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
                >
                  {resetLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>{resetLoading ? 'Setting New Password...' : 'Save New Password & Log In'}</span>
                </button>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
                <button
                  onClick={() => setAuthMode('login')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel and Return to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Filtered messages list
  const filteredMessages = messages.filter((m) => {
    if (messageFilter === 'unread') return !m.read;
    if (messageFilter === 'read') return m.read;
    return true;
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-deep)',
        zIndex: 100,
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '270px',
          borderRight: '1px solid rgba(0, 240, 255, 0.15)',
          backgroundColor: 'rgba(6, 11, 26, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          overflowY: 'auto'
        }}
        className="admin-sidebar"
      >
        <div>
          {/* Logo & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00F0FF 0%, #0070F3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040817' }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>CONTROL CENTER</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--cyan-core)', fontWeight: 600 }}>BHAVESH GUPTA</div>
            </div>
          </div>

          {/* Navigation Links in requested order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'overview' as AdminTab, name: 'Dashboard', icon: <LayoutDashboard size={17} /> },
              {
                id: 'messages' as AdminTab,
                name: 'Messages Inbox',
                icon: <Mail size={17} />,
                badge: unreadCount > 0 ? unreadCount : undefined
              },
              { id: 'home' as AdminTab, name: 'Home Section', icon: <Home size={17} /> },
              { id: 'about' as AdminTab, name: 'About Section', icon: <User size={17} />, sub: '+ Achievements' },
              { id: 'skills' as AdminTab, name: 'Skills Section', icon: <Wrench size={17} />, sub: '+ Soft Skills' },
              { id: 'experience' as AdminTab, name: 'Experience Section', icon: <Briefcase size={17} /> },
              { id: 'projects' as AdminTab, name: 'Projects Section', icon: <FolderGit2 size={17} /> },
              { id: 'education' as AdminTab, name: 'Education Section', icon: <GraduationCap size={17} />, sub: '+ Certifications' },
              { id: 'contact' as AdminTab, name: 'Contact Section', icon: <Phone size={17} /> },
              { id: 'settings' as AdminTab, name: 'Database & Settings', icon: <Database size={17} /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--cyan-core)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {tab.icon}
                    <div>
                      <div>{tab.name}</div>
                      {tab.sub && (
                        <div style={{ fontSize: '0.68rem', color: isActive ? '#38BDF8' : 'var(--text-muted)', fontWeight: 400 }}>
                          {tab.sub}
                        </div>
                      )}
                    </div>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '6px',
              color: '#F87171',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Logout
          </button>

          <button
            onClick={onClose}
            className="btn-cyan"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            <Eye size={16} /> Exit to Portfolio
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header
          style={{
            height: '68px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
            backgroundColor: 'rgba(4, 8, 22, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.15rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activeTab.toUpperCase()} MANAGER
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                color: 'var(--cyan-core)'
              }}
            >
              LIVE SYNC ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={resetToDefaults}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--text-secondary)',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              title="Reset all sections to verified default resume data"
            >
              <RefreshCw size={14} /> Reset Defaults
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        </header>

        {/* Dynamic Section Views */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {/* 1. OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  PORTFOLIO CONTROL OVERVIEW
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Manage and customize all 8 core sections of the website with Supabase database integration.
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                  marginBottom: '36px'
                }}
              >
                <div
                  className="glass-card"
                  onClick={() => setActiveTab('messages')}
                  style={{ padding: '22px', cursor: 'pointer', border: '1px solid rgba(0, 240, 255, 0.25)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>INBOX INQUIRIES</span>
                    <Mail size={20} color="var(--cyan-core)" />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                    {messages.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: unreadCount > 0 ? '#EF4444' : '#34D399', marginTop: '6px', fontWeight: 600 }}>
                    {unreadCount > 0 ? `${unreadCount} Unread Message(s)` : 'All Messages Handled'}
                  </div>
                </div>

                <div
                  className="glass-card"
                  onClick={() => setActiveTab('projects')}
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>FEATURED PROJECTS</span>
                    <FolderGit2 size={20} color="#38BDF8" />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                    {projects.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    QA, Web & AI Repositories
                  </div>
                </div>

                <div
                  className="glass-card"
                  onClick={() => setActiveTab('skills')}
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>SKILL CATEGORIES</span>
                    <Wrench size={20} color="#818CF8" />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                    {skills.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {softSkills.length} Soft Skill Cards
                  </div>
                </div>

                <div
                  className="glass-card"
                  onClick={() => setActiveTab('experience')}
                  style={{ padding: '22px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>WORK EXPERIENCE</span>
                    <Briefcase size={20} color="#34D399" />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                    {experiences.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Production Timeline Nodes
                  </div>
                </div>
              </div>

              {/* Quick Section Navigator Grid */}
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '16px' }}>
                DIRECT SECTION EDITORS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {[
                  { tab: 'messages' as AdminTab, title: 'Messages Inbox', desc: 'Read visitor messages & sync with Supabase database' },
                  { tab: 'home' as AdminTab, title: 'Home Section', desc: 'Edit title, availability, metric stats, & hero text' },
                  { tab: 'about' as AdminTab, title: 'About + Achievements', desc: 'Edit narrative, telemetry pillars & 3 leadership cards' },
                  { tab: 'skills' as AdminTab, title: 'Skills + Soft Skills', desc: 'Manage resume skills categories and 6 soft skills cards' },
                  { tab: 'experience' as AdminTab, title: 'Experience Section', desc: 'Update software engineering & intern roles' },
                  { tab: 'projects' as AdminTab, title: 'Projects Section', desc: 'Add/edit QA, Web Dev, and Vibe Code AI projects' },
                  { tab: 'education' as AdminTab, title: 'Education + Certifications', desc: 'Manage college degrees & professional course certificates' },
                  { tab: 'contact' as AdminTab, title: 'Contact Section', desc: 'Manage email, phone, location & Supabase database key' }
                ].map((item) => (
                  <div
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className="glass-card"
                    style={{
                      padding: '18px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(0, 240, 255, 0.15)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.desc}</div>
                    </div>
                    <ChevronRight size={18} color="var(--cyan-core)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    INBOX & CONTACT INQUIRIES
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Inquiries submitted through your portfolio contact form. Persisted in Supabase & LocalStorage.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={handleSyncSupabase}
                    disabled={isSyncing}
                    className="btn-cyan"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
                  </button>

                  <button
                    onClick={() => setShowSqlGuide(!showSqlGuide)}
                    className="btn-glass"
                    style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    <Database size={14} />
                    <span>Supabase SQL Guide</span>
                  </button>
                </div>
              </div>

              {syncStatus && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--cyan-core)', color: 'var(--cyan-core)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {syncStatus}
                </div>
              )}

              {/* Supabase SQL Setup Modal / Card */}
              {showSqlGuide && (
                <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(0, 240, 255, 0.3)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                      SUPABASE TABLE SETUP (ONE-TIME SQL)
                    </div>
                    <button onClick={copySqlToClipboard} className="btn-cyan" style={{ padding: '4px 10px', fontSize: '0.74rem' }}>
                      <Copy size={13} /> {copiedSql ? 'Copied!' : 'Copy SQL'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Run this in your <strong>Supabase Dashboard → SQL Editor</strong> to enable instant cloud storage:
                  </p>
                  <pre style={{ backgroundColor: '#030712', padding: '12px', borderRadius: '6px', fontSize: '0.76rem', color: '#38BDF8', overflowX: 'auto' }}>
{`CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);`}
                  </pre>
                </div>
              )}

              {/* Message Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {(['all', 'unread', 'read'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMessageFilter(filter)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: messageFilter === filter ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: messageFilter === filter ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: messageFilter === filter ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    {filter.toUpperCase()} ({messages.filter((m) => filter === 'all' ? true : filter === 'unread' ? !m.read : m.read).length})
                  </button>
                ))}
              </div>

              {/* Messages List */}
              {filteredMessages.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Mail size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <div>No messages found matching this filter.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="glass-card"
                      style={{
                        padding: '20px 24px',
                        border: msg.read ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 240, 255, 0.35)',
                        backgroundColor: msg.read ? 'rgba(6, 12, 28, 0.6)' : 'rgba(8, 20, 50, 0.85)'
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>{msg.name}</span>
                            {!msg.read && (
                              <span style={{ backgroundColor: '#EF4444', color: '#FFF', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                                NEW
                              </span>
                            )}
                          </div>
                          <a href={`mailto:${msg.email}`} style={{ fontSize: '0.82rem', color: 'var(--cyan-core)', textDecoration: 'none' }}>
                            {msg.email}
                          </a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{msg.createdAt}</span>
                          <button
                            onClick={() => handleToggleRead(msg.id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'var(--text-secondary)',
                              padding: '5px 10px',
                              borderRadius: '4px',
                              fontSize: '0.74rem',
                              cursor: 'pointer'
                            }}
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="btn-cyan"
                            style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                          >
                            Reply
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '8px' }}>
                        Subject: {msg.subject}
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. HOME SECTION MANAGER */}
          {activeTab === 'home' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                  HOME / HERO SECTION SETTINGS
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Customize the main hero title, roles, metric cards, and personal tagline.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      ROLE TITLE
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    PROFESSIONAL TAGLINE / HERO PARAGRAPH
                  </label>
                  <textarea
                    rows={3}
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff', lineHeight: 1.5 }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      YEARS EXPERIENCE
                    </label>
                    <input
                      type="text"
                      value={profile.yearsExperience}
                      onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      VERIFIED PROJECTS
                    </label>
                    <input
                      type="text"
                      value={profile.projectsCount}
                      onChange={(e) => setProfile({ ...profile, projectsCount: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      B.TECH CGPA SCORE
                    </label>
                    <input
                      type="text"
                      value={profile.cgpa}
                      onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn-cyan" style={{ padding: '10px 24px' }}>
                    <Check size={16} /> Save Home Section Updates
                  </button>
                  {saveProfileSuccess && (
                    <span style={{ marginLeft: '12px', color: '#34D399', fontSize: '0.85rem' }}>
                      ✓ Successfully saved and synced!
                    </span>
                  )}
                </div>
              </form>

              {/* Resume Document & Download Button Control */}
              <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid rgba(0, 240, 255, 0.2)', maxWidth: '800px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} style={{ color: 'var(--cyan-core)' }} />
                    RESUME DOCUMENT & DOWNLOAD BUTTON SETTINGS
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                    Upload or change your resume. When replaced, all "Download Resume" buttons on the portfolio (Navbar & Hero) immediately serve the new document.
                  </p>
                </div>

                {/* Current Active Resume Card */}
                <div
                  className="glass-card"
                  style={{
                    padding: '20px',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    marginBottom: '20px',
                    backgroundColor: 'rgba(4, 8, 24, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(0, 240, 255, 0.1)',
                          border: '1px solid rgba(0, 240, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--cyan-core)'
                        }}
                      >
                        <FileText size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#FFFFFF' }}>
                          {profile.resumeFileName || 'Bhavesh_Gupta_Resume.pdf'}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Current active file linked to all public download buttons
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a
                        href={profile.resumeUrl || '/resume/Bhavesh_Gupta_Resume.pdf'}
                        download={profile.resumeFileName || 'Bhavesh_Gupta_Resume.pdf'}
                        className="btn-glass"
                        style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                        title="Download / Test Current Resume"
                      >
                        <Download size={14} /> Preview Download
                      </a>
                      <button
                        type="button"
                        onClick={handleResetResumeToDefault}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 12px',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                        title="Reset back to initial verified default resume document"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Form */}
                <div
                  style={{
                    padding: '24px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 240, 255, 0.03)',
                    border: '1px dashed rgba(0, 240, 255, 0.3)'
                  }}
                >
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.04em' }}>
                    UPLOAD NEW RESUME FILE (.PDF OR .DOCX)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleResumeFileSelect}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-glass-input)',
                        border: '1px solid rgba(0, 240, 255, 0.25)',
                        color: '#fff',
                        fontSize: '0.84rem',
                        flex: 1,
                        minWidth: '240px'
                      }}
                    />
                    <button
                      type="button"
                      disabled={!selectedResumeFile || resumeUploading}
                      onClick={handleUploadResume}
                      className="btn-cyan"
                      style={{ padding: '10px 20px', fontSize: '0.84rem' }}
                    >
                      {resumeUploading ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Upload size={15} />
                      )}
                      <span>{resumeUploading ? 'Uploading & Replacing...' : 'Upload & Replace Resume'}</span>
                    </button>
                  </div>

                  {selectedResumeFile && (
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--cyan-core)' }}>
                      Selected File: <strong>{selectedResumeFile.name}</strong> ({(selectedResumeFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}

                  {resumeUploadSuccess && (
                    <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34D399', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} />
                      <span>{resumeUploadSuccess}</span>
                    </div>
                  )}

                  {resumeUploadError && (
                    <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} />
                      <span>{resumeUploadError}</span>
                    </div>
                  )}

                  <div style={{ marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    💡 <strong>Storage Sync:</strong> The uploaded resume is saved to Supabase Cloud Storage (bucket: <code>resumes</code>) and stored client-side so all visitors immediately download the updated resume.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ABOUT SECTION (+ ACHIEVEMENTS SUBSECTION) */}
          {activeTab === 'about' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    ABOUT SECTION MANAGER
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Manage engineering narrative, bio paragraphs, and leadership achievements.
                  </p>
                </div>

                {/* Sub-tab Switcher */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setAboutSubTab('main')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: aboutSubTab === 'main' ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: aboutSubTab === 'main' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: aboutSubTab === 'main' ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    Main Bio Narrative
                  </button>
                  <button
                    onClick={() => setAboutSubTab('achievements')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: aboutSubTab === 'achievements' ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: aboutSubTab === 'achievements' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: aboutSubTab === 'achievements' ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    Achievements Subsection ({achievements.filter((a) => a.type !== 'Certification').length})
                  </button>
                </div>
              </div>

              {aboutSubTab === 'main' ? (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '800px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      CAREER BIO PARAGRAPHS
                    </label>
                    {profile.bio.map((paragraph, idx) => (
                      <div key={idx} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--cyan-core)' }}>
                          <span>Paragraph #{idx + 1}</span>
                          {profile.bio.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newBio = profile.bio.filter((_, i) => i !== idx);
                                setProfile({ ...profile, bio: newBio });
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={paragraph}
                          onChange={(e) => {
                            const newBio = [...profile.bio];
                            newBio[idx] = e.target.value;
                            setProfile({ ...profile, bio: newBio });
                          }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff', lineHeight: 1.5 }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, bio: [...profile.bio, ''] })}
                      style={{
                        background: 'transparent',
                        border: '1px dashed rgba(0, 240, 255, 0.3)',
                        color: 'var(--cyan-core)',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Another Paragraph
                    </button>
                  </div>

                  <div>
                    <button type="submit" className="btn-cyan" style={{ padding: '10px 24px' }}>
                      <Check size={16} /> Save About Me Updates
                    </button>
                  </div>
                </form>
              ) : (
                /* Achievements Subsection in About */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      These cards appear in the <strong>About Me → Achievements</strong> subsection.
                    </p>
                    <button
                      onClick={() => {
                        setEditingAchievement({
                          id: `ach-${Date.now()}`,
                          title: '',
                          organization: '',
                          type: 'Leadership',
                          description: ''
                        });
                        setIsNewAchievement(true);
                      }}
                      className="btn-cyan"
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    >
                      <Plus size={15} /> Add Achievement Card
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {achievements
                      .filter((a) => a.type !== 'Certification')
                      .map((ach) => (
                        <div key={ach.id} className="glass-card" style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span className="badge-neon" style={{ fontSize: '0.7rem' }}>{ach.type}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setEditingAchievement(ach);
                                  setIsNewAchievement(false);
                                }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAchievement(ach.id)}
                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '4px' }}>{ach.title}</h4>
                          <div style={{ fontSize: '0.82rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '8px' }}>
                            {ach.organization}
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {ach.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. SKILLS SECTION (+ SOFT SKILLS SUBSECTION) */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    SKILLS & COMPETENCIES MANAGER
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Manage technical skill stacks and the 6 soft skills collaboration cards.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSkillsSubTab('technical')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: skillsSubTab === 'technical' ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: skillsSubTab === 'technical' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: skillsSubTab === 'technical' ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    Technical Categories ({skills.length})
                  </button>
                  <button
                    onClick={() => setSkillsSubTab('soft')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: skillsSubTab === 'soft' ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: skillsSubTab === 'soft' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: skillsSubTab === 'soft' ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    Soft Skills Subsection ({softSkills.length})
                  </button>
                </div>
              </div>

              {skillsSubTab === 'technical' ? (
                /* Technical Categories */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {skills.map((cat, catIdx) => (
                    <div key={cat.category} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--cyan-core)', fontSize: '1rem' }}>
                            {cat.category}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            ({cat.skills.length} skills)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const skillName = prompt('Enter new skill name:');
                            if (skillName && skillName.trim()) {
                              const level = prompt('Enter proficiency tag (e.g. Core, Automation, Advanced):') || 'Core';
                              const updated = [...skills];
                              updated[catIdx].skills.push({ name: skillName.trim(), level: level.trim() });
                              setSkills(updated);
                              saveItem(KEYS.SKILLS, updated);
                            }
                          }}
                          className="btn-cyan"
                          style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                        >
                          <Plus size={13} /> Add Skill
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {cat.skills.map((skill, sIdx) => (
                          <div
                            key={skill.name}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              fontSize: '0.78rem'
                            }}
                          >
                            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{skill.name}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--cyan-core)' }}>({skill.level})</span>
                            <button
                              onClick={() => {
                                const updated = [...skills];
                                updated[catIdx].skills.splice(sIdx, 1);
                                setSkills(updated);
                                saveItem(KEYS.SKILLS, updated);
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 2px' }}
                              title="Delete skill"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Soft Skills Subsection (6 Cards) */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      These cards render in the <strong>2×3 Soft Skills & Collaboration Mindset</strong> grid.
                    </p>
                    <button
                      onClick={() => {
                        setEditingSoftSkill({
                          index: softSkills.length,
                          item: { name: '', desc: '' }
                        });
                        setIsNewSoftSkill(true);
                      }}
                      className="btn-cyan"
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    >
                      <Plus size={15} /> Add Soft Skill Card
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {softSkills.map((item, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={16} color="var(--cyan-core)" />
                            <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.96rem' }}>{item.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setEditingSoftSkill({ index: idx, item: { ...item } });
                                setIsNewSoftSkill(false);
                              }}
                              style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', cursor: 'pointer' }}
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteSoftSkill(idx)}
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. EXPERIENCE SECTION MANAGER */}
          {activeTab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    WORK EXPERIENCE & TIMELINE
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Manage engineering roles, dates, responsibilities, and technologies.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingExperience({
                      id: `exp-${Date.now()}`,
                      role: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: 'Present',
                      type: 'Full-time',
                      responsibilities: [''],
                      technologies: []
                    });
                    setIsNewExperience(true);
                  }}
                  className="btn-cyan"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <Plus size={16} /> Add Position
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="glass-card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{exp.role}</span>
                          <span className="badge-neon" style={{ fontSize: '0.7rem' }}>{exp.type}</span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--cyan-core)', fontWeight: 600, marginTop: '2px' }}>
                          {exp.company} • {exp.location}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {exp.startDate} – {exp.endDate}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingExperience(exp);
                            setIsNewExperience(false);
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', cursor: 'pointer' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '12px' }}>
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {exp.technologies.map((t) => (
                        <span key={t} className="badge-tag" style={{ fontSize: '0.7rem' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PROJECTS SECTION MANAGER */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    PROJECTS & OPEN SOURCE REPOSITORIES
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Categories: <strong>Software QA</strong>, <strong>Web Development</strong>, and <strong>Vibe Code Using AI</strong>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      title: '',
                      slug: '',
                      category: 'Vibe Code Using AI',
                      summary: '',
                      description: '',
                      features: [],
                      technologies: [],
                      githubUrl: 'https://github.com/Bhavesh-2926',
                      featured: false,
                      status: 'Production Live'
                    });
                    setIsNewProject(true);
                  }}
                  className="btn-cyan"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <Plus size={16} /> Add New Project
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {projects.map((proj) => (
                  <div key={proj.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span className="badge-neon" style={{ fontSize: '0.72rem' }}>{proj.category}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setIsNewProject(false);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', cursor: 'pointer' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '6px' }}>{proj.title}</h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {proj.summary}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {proj.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="badge-tag" style={{ fontSize: '0.68rem' }}>{tech}</span>
                      ))}
                      {proj.technologies.length > 4 && (
                        <span className="badge-tag" style={{ fontSize: '0.68rem' }}>+{proj.technologies.length - 4}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. EDUCATION SECTION (+ CERTIFICATIONS SUBSECTION) */}
          {activeTab === 'education' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    EDUCATION & CERTIFICATIONS MANAGER
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Manage formal degrees and professional certified training.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEducationSubTab('degrees')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: educationSubTab === 'degrees' ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: educationSubTab === 'degrees' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: educationSubTab === 'degrees' ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    Academic Degrees ({education.length})
                  </button>
                  <button
                    onClick={() => setEducationSubTab('certifications')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: educationSubTab === 'certifications' ? '1px solid var(--cyan-core)' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: educationSubTab === 'certifications' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      color: educationSubTab === 'certifications' ? 'var(--cyan-core)' : 'var(--text-secondary)'
                    }}
                  >
                    Certifications Subsection ({achievements.filter((a) => a.type === 'Certification').length})
                  </button>
                </div>
              </div>

              {educationSubTab === 'degrees' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Formal academic credentials (B.Tech, Polytechnic Diploma).
                    </p>
                    <button
                      onClick={() => {
                        setEditingEducation({
                          id: `edu-${Date.now()}`,
                          degree: '',
                          institution: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          grade: '',
                          gradeType: 'CGPA',
                          description: ''
                        });
                        setIsNewEducation(true);
                      }}
                      className="btn-cyan"
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    >
                      <Plus size={15} /> Add Degree
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {education.map((edu) => (
                      <div key={edu.id} className="glass-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--cyan-core)', fontWeight: 700 }}>
                            {edu.gradeType}: {edu.grade}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setEditingEducation(edu);
                                setIsNewEducation(false);
                              }}
                              style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', cursor: 'pointer' }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEducation(edu.id)}
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '4px' }}>{edu.degree}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{edu.institution} • {edu.location}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{edu.startDate} – {edu.endDate}</div>
                        {edu.description && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Professional Certifications */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      These cards render in the <strong>Education → Professional Certifications</strong> subsection.
                    </p>
                    <button
                      onClick={() => {
                        setEditingAchievement({
                          id: `ach-${Date.now()}`,
                          title: '',
                          organization: '',
                          type: 'Certification',
                          description: ''
                        });
                        setIsNewAchievement(true);
                      }}
                      className="btn-cyan"
                      style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                    >
                      <Plus size={15} /> Add Certification
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {achievements
                      .filter((a) => a.type === 'Certification')
                      .map((cert) => (
                        <div key={cert.id} className="glass-card" style={{ padding: '22px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="badge-neon" style={{ fontSize: '0.7rem' }}>Certification</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setEditingAchievement(cert);
                                  setIsNewAchievement(false);
                                }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAchievement(cert.id)}
                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '4px' }}>{cert.title}</h4>
                          <div style={{ fontSize: '0.84rem', color: 'var(--cyan-core)', fontWeight: 600, marginBottom: '8px' }}>
                            {cert.organization}
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {cert.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. CONTACT SECTION MANAGER */}
          {activeTab === 'contact' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '4px' }}>
                  CONTACT SECTION SETTINGS
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Manage direct contact credentials, location, and social media handles.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '800px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      DIRECT EMAIL
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      CONTACT PHONE
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      LOCATION
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      GITHUB PROFILE URL
                    </label>
                    <input
                      type="url"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    LINKEDIN PROFILE URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  />
                </div>

                <div>
                  <button type="submit" className="btn-cyan" style={{ padding: '10px 24px' }}>
                    <Check size={16} /> Save Contact Details
                  </button>
                  {saveProfileSuccess && (
                    <span style={{ marginLeft: '12px', color: '#34D399', fontSize: '0.85rem' }}>
                      ✓ Successfully saved!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* 10. SETTINGS & PROFILE IDENTITY & SUPABASE */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '850px' }}>
              {/* SECTION 1: PROFILE IDENTITY & PROFESSION TAGS */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={22} style={{ color: 'var(--cyan-core)' }} />
                    PROFILE IDENTITY & PROFESSION TAGS
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                    Manage your personal brand details and cybernetic floating tags displayed across the portfolio.
                  </p>
                </div>

                <form onSubmit={handleSaveIdentity} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Bhavesh Gupta"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                        PROFESSION TITLE
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        placeholder="Software QA Tester | Software Engineer | AI Developer"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Profession Tags Manager */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                      HOMEPAGE PROFESSION TAGS (CYBERNETIC FLOATING BADGES)
                    </label>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {(profile.professionTags || ['QA Test Automation', 'Software Engineering', 'AI Development']).map((tag) => (
                        <div
                          key={tag}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(0, 240, 255, 0.12)',
                            border: '1px solid rgba(0, 240, 255, 0.35)',
                            color: 'var(--cyan-core)',
                            fontSize: '0.82rem',
                            fontWeight: 600
                          }}
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProfessionTag(tag)}
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title={`Remove ${tag}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={newProfessionTagInput}
                        onChange={(e) => setNewProfessionTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddProfessionTag();
                          }
                        }}
                        placeholder="Type new profession tag (e.g. Test Automation, API Testing)"
                        style={{ flex: 1, padding: '9px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff', fontSize: '0.84rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddProfessionTag}
                        className="btn-cyan"
                        style={{ padding: '9px 16px', fontSize: '0.82rem' }}
                      >
                        <Plus size={15} /> Add Tag
                      </button>
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn-cyan" style={{ padding: '10px 24px' }}>
                      <Check size={16} /> Save Profile Identity
                    </button>
                    {saveIdentitySuccess && (
                      <span style={{ marginLeft: '12px', color: '#34D399', fontSize: '0.85rem' }}>
                        ✓ Profile identity & tags updated! Live on public website.
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* SECTION 2: CHANGE PASSWORD (OLD TO NEW) & UPDATE ADMIN EMAIL */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={22} style={{ color: 'var(--cyan-core)' }} />
                    CHANGE PASSWORD (OLD TO NEW) & ADMIN CREDENTIALS
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                    To change your password or update your registered email, you must first verify your registered email and old password. Only when both are correct will the new password option be unlocked.
                  </p>
                </div>

                {/* STEP 1: OLD CREDENTIALS VERIFICATION FORM */}
                {!isOldVerified ? (
                  <form onSubmit={handleVerifyOldCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Lock size={18} color="var(--cyan-core)" />
                      <span style={{ fontSize: '0.84rem', color: '#FFFFFF', fontWeight: 600 }}>
                        STEP 1: Verify Registered Email & Current (Old) Password [Locked]
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                          CURRENT REGISTERED ADMIN EMAIL ID
                        </label>
                        <input
                          type="email"
                          value={oldCredEmail}
                          onChange={(e) => setOldCredEmail(e.target.value)}
                          placeholder="bhaveshgupta901@gmail.com"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                          required
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            CURRENT (OLD) PASSWORD
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {showOldPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                            {showOldPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          value={oldPasswordInput}
                          onChange={(e) => setOldPasswordInput(e.target.value)}
                          placeholder="Enter current old password"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                          required
                        />
                      </div>
                    </div>

                    {verifyOldError && (
                      <div style={{ color: '#EF4444', fontSize: '0.82rem', padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        <span>{verifyOldError}</span>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={verifyOldLoading}
                        className="btn-cyan"
                        style={{ padding: '10px 24px', fontSize: '0.86rem' }}
                      >
                        {verifyOldLoading ? <RefreshCw size={15} className="animate-spin" /> : <Lock size={15} />}
                        <span>{verifyOldLoading ? 'Verifying Old Credentials...' : 'Verify Old Credentials & Unlock New Password'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* STEP 2: NEW PASSWORD GENERATOR (UNLOCKED ONLY WHEN BOTH EMAIL & OLD PASSWORD MATCH) */
                  <form onSubmit={handleSaveNewPasswordWithOldVerification} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ padding: '14px 16px', borderRadius: '8px', backgroundColor: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Unlock size={18} color="#34D399" />
                        <span style={{ fontSize: '0.84rem', color: '#34D399', fontWeight: 700 }}>
                          ✓ Verification Passed! Old credentials matched. You can now set your new password.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOldVerified(false);
                          setOldPasswordInput('');
                        }}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer' }}
                      >
                        Relock
                      </button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                        REGISTERED ADMIN EMAIL (UPDATE IF DESIRED)
                      </label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="bhaveshgupta901@gmail.com"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            NEW ADMIN PASSWORD
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--cyan-core)', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {showNewAdminPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                            {showNewAdminPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <input
                          type={showNewAdminPassword ? 'text' : 'password'}
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="Type your new password (min 6 chars)"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.35)', color: '#fff' }}
                          minLength={6}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                          CONFIRM NEW PASSWORD
                        </label>
                        <input
                          type={showNewAdminPassword ? 'text' : 'password'}
                          value={newAdminConfirmPassword}
                          onChange={(e) => setNewAdminConfirmPassword(e.target.value)}
                          placeholder="Re-enter your new password"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.35)', color: '#fff' }}
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    {changePasswordError && (
                      <div style={{ color: '#EF4444', fontSize: '0.82rem', padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        <span>{changePasswordError}</span>
                      </div>
                    )}

                    {changePasswordSuccess && (
                      <div style={{ color: '#34D399', fontSize: '0.84rem', padding: '12px 16px', backgroundColor: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.35)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18} />
                        <span>{changePasswordSuccess}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={changePasswordLoading}
                        className="btn-cyan"
                        style={{ padding: '10px 24px', fontSize: '0.86rem' }}
                      >
                        {changePasswordLoading ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
                        <span>{changePasswordLoading ? 'Activating New Password...' : 'Save & Activate New Password'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* FORGOTTEN PASSWORD RECOVERY SECTION (GMAIL NOTIFICATION PREVIEW) */}
                <div
                  style={{
                    marginTop: '28px',
                    padding: '22px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 240, 255, 0.04)',
                    border: '1px dashed rgba(0, 240, 255, 0.35)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-core)', fontWeight: 700, fontSize: '0.95rem' }}>
                      <KeyRound size={18} />
                      <span>FORGOTTEN PASSWORD RECOVERY TOOL</span>
                    </div>
                    <button
                      type="button"
                      disabled={settingsRecoveryLoading}
                      onClick={handleTriggerRecoveryFromSettings}
                      className="btn-glass"
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      {settingsRecoveryLoading ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      <span>Send Recovery Gmail to {oldCredEmail || adminCredentials.email}</span>
                    </button>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                    If you don't remember your current password, trigger a secure password recovery message to your registered Gmail address (<strong>{oldCredEmail || adminCredentials.email}</strong>). Click the confirmation button inside the dispatched notification to immediately set your new password.
                  </p>

                  {/* Dispatched Gmail Confirmation Card */}
                  {settingsRecoveryInfo && (
                    <div
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#0B132B',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        borderRadius: '10px',
                        padding: '18px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '5px', backgroundColor: '#EA4335', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.74rem' }}>
                            M
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                              Gmail Notification Dispatched
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              To: <span style={{ color: 'var(--cyan-core)' }}>{settingsRecoveryInfo.email}</span>
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontWeight: 600 }}>
                          CONFIRMATION READY
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                        Subject: <strong style={{ color: '#fff' }}>🔒 Action Required: Confirm Password Reset for Portfolio Admin</strong>
                        <p style={{ margin: '6px 0 0' }}>
                          Hello Bhavesh, click the confirmation button below to verify your identity and set your new password:
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConfirmTokenAndOpenReset(settingsRecoveryInfo.token)}
                        className="btn-cyan"
                        style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.02em' }}
                      >
                        <CheckCircle2 size={16} />
                        <span>CONFIRM PASSWORD RESET & CREATE NEW PASSWORD</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: SUPABASE DATABASE & STORAGE CONFIGURATION */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={22} style={{ color: 'var(--cyan-core)' }} />
                    SUPABASE DATABASE & CLOUD STORAGE CONNECTION
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                    Connect your Supabase cloud backend to synchronize all contact inquiries and store uploaded resume files.
                  </p>
                </div>

                <form onSubmit={handleSaveSupabaseConfig} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                      SUPABASE PROJECT URL
                    </label>
                    <input
                      type="text"
                      value={supabaseConfig.url}
                      onChange={(e) => setSupabaseConfigState({ ...supabaseConfig, url: e.target.value })}
                      placeholder="https://your-project-id.supabase.co"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                      SUPABASE ANON / PUBLIC API KEY
                    </label>
                    <input
                      type="password"
                      value={supabaseConfig.anonKey}
                      onChange={(e) => setSupabaseConfigState({ ...supabaseConfig, anonKey: e.target.value })}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn-cyan" style={{ padding: '10px 24px' }}>
                      <Check size={16} /> Save Supabase Connection
                    </button>
                    {saveConfigSuccess && (
                      <span style={{ color: '#34D399', fontSize: '0.85rem' }}>
                        ✓ Supabase credentials saved!
                      </span>
                    )}
                  </div>
                </form>

                {/* DIRECT CLOUD SYNCHRONIZATION CONTROLS */}
                <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={16} color="var(--cyan-core)" />
                    PORTFOLIO CONTENT CLOUD SYNCHRONIZATION
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Push all your local portfolio sections (Profile, Projects, Experience, Skills, Education, Certifications) to your Supabase database in one click, or pull and refresh the latest content from the cloud.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={pushLoading}
                      onClick={handlePushAllContent}
                      className="btn-cyan"
                      style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                    >
                      {pushLoading ? <RefreshCw size={15} className="animate-spin" /> : <Upload size={15} />}
                      <span>{pushLoading ? 'Pushing Content...' : 'Push All Content to Supabase Cloud'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={pullLoading}
                      onClick={handlePullContent}
                      className="btn-glass"
                      style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                    >
                      {pullLoading ? <RefreshCw size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                      <span>{pullLoading ? 'Pulling Content...' : 'Pull / Refresh from Supabase'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={copySqlToClipboard}
                      className="btn-glass"
                      style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                    >
                      <Copy size={15} />
                      <span>{copiedSql ? 'SQL Copied to Clipboard!' : 'Copy Supabase SQL Setup'}</span>
                    </button>
                  </div>

                  {pushResult && (
                    <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '6px', backgroundColor: pushResult.success ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: pushResult.success ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)', color: pushResult.success ? '#34D399' : '#EF4444', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {pushResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      <span>{pushResult.message}</span>
                    </div>
                  )}

                  {pullResult && (
                    <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '6px', backgroundColor: pullResult.success ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: pullResult.success ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)', color: pullResult.success ? '#34D399' : '#EF4444', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {pullResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      <span>{pullResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL: EDIT PROJECT --- */}
      {editingProject && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                {isNewProject ? 'Add New Project' : 'Edit Project'}
              </h3>
              <button onClick={() => setEditingProject(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PROJECT TITLE</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>CATEGORY</label>
                <select
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#070E20', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                >
                  <option value="Software QA">Software QA</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Vibe Code Using AI">Vibe Code Using AI</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SUMMARY (CARD DISPLAY)</label>
                <textarea
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GITHUB URL</label>
                <input
                  type="url"
                  value={editingProject.githubUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>LIVE DEMO URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Save Project
                </button>
                <button type="button" onClick={() => setEditingProject(null)} className="btn-glass">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT EXPERIENCE --- */}
      {editingExperience && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                {isNewExperience ? 'Add Career Position' : 'Edit Position'}
              </h3>
              <button onClick={() => setEditingExperience(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>JOB ROLE</label>
                  <input
                    type="text"
                    value={editingExperience.role}
                    onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>COMPANY</label>
                  <input
                    type="text"
                    value={editingExperience.company}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>START DATE</label>
                  <input
                    type="text"
                    value={editingExperience.startDate}
                    onChange={(e) => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>END DATE</label>
                  <input
                    type="text"
                    value={editingExperience.endDate}
                    onChange={(e) => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>TYPE</label>
                  <select
                    value={editingExperience.type}
                    onChange={(e) => setEditingExperience({ ...editingExperience, type: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#070E20', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>LOCATION</label>
                <input
                  type="text"
                  value={editingExperience.location}
                  onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Save Position
                </button>
                <button type="button" onClick={() => setEditingExperience(null)} className="btn-glass">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT ACHIEVEMENT OR CERTIFICATION --- */}
      {editingAchievement && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', padding: '28px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                {isNewAchievement ? 'Add Entry' : 'Edit Entry'}
              </h3>
              <button onClick={() => setEditingAchievement(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>TITLE</label>
                <input
                  type="text"
                  value={editingAchievement.title}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ORGANIZATION / ISSUER</label>
                <input
                  type="text"
                  value={editingAchievement.organization}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, organization: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ENTRY TYPE</label>
                <select
                  value={editingAchievement.type}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, type: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#070E20', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                >
                  <option value="Leadership">Leadership (About Subsection)</option>
                  <option value="Award">Award (About Subsection)</option>
                  <option value="Certification">Certification (Education Subsection)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingAchievement.description}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Save Entry
                </button>
                <button type="button" onClick={() => setEditingAchievement(null)} className="btn-glass">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT SOFT SKILL --- */}
      {editingSoftSkill && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '28px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                {isNewSoftSkill ? 'Add Soft Skill Card' : 'Edit Soft Skill Card'}
              </h3>
              <button onClick={() => setEditingSoftSkill(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSoftSkill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SKILL NAME</label>
                <input
                  type="text"
                  value={editingSoftSkill.item.name}
                  onChange={(e) => setEditingSoftSkill({ ...editingSoftSkill, item: { ...editingSoftSkill.item, name: e.target.value } })}
                  placeholder="e.g. Attention to Detail"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DESCRIPTION / CORE MINDSET</label>
                <textarea
                  rows={3}
                  value={editingSoftSkill.item.desc}
                  onChange={(e) => setEditingSoftSkill({ ...editingSoftSkill, item: { ...editingSoftSkill.item, desc: e.target.value } })}
                  placeholder="e.g. Meticulous verification of UI pixel perfection and defect detection."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Save Soft Skill
                </button>
                <button type="button" onClick={() => setEditingSoftSkill(null)} className="btn-glass">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT EDUCATION --- */}
      {editingEducation && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '28px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                {isNewEducation ? 'Add Degree' : 'Edit Degree'}
              </h3>
              <button onClick={() => setEditingEducation(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DEGREE NAME</label>
                <input
                  type="text"
                  value={editingEducation.degree}
                  onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>INSTITUTION</label>
                <input
                  type="text"
                  value={editingEducation.institution}
                  onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GRADE / SCORE</label>
                  <input
                    type="text"
                    value={editingEducation.grade}
                    onChange={(e) => setEditingEducation({ ...editingEducation, grade: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GRADE TYPE</label>
                  <select
                    value={editingEducation.gradeType}
                    onChange={(e) => setEditingEducation({ ...editingEducation, gradeType: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#070E20', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>START DATE</label>
                  <input
                    type="text"
                    value={editingEducation.startDate}
                    onChange={(e) => setEditingEducation({ ...editingEducation, startDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>END DATE</label>
                  <input
                    type="text"
                    value={editingEducation.endDate}
                    onChange={(e) => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-glass-input)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#fff' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Save Degree
                </button>
                <button type="button" onClick={() => setEditingEducation(null)} className="btn-glass">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
