import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Project,
  Experience,
  Education,
  SkillCategory,
  Achievement,
  ContactMessage,
  ProfileData,
  SoftSkill
} from '../types/portfolio';
import {
  defaultProfile,
  defaultProjects,
  defaultExperiences,
  defaultEducation,
  defaultSkills,
  defaultAchievements,
  initialMessages,
  softSkillsList
} from './defaultData';

// LocalStorage keys for unified persistence
export const KEYS = {
  PROFILE: 'bhavesh_portfolio_v3_profile',
  PROJECTS: 'bhavesh_portfolio_v3_projects',
  EXPERIENCES: 'bhavesh_portfolio_v3_experiences',
  EDUCATION: 'bhavesh_portfolio_v3_education',
  SKILLS: 'bhavesh_portfolio_v3_skills',
  SOFT_SKILLS: 'bhavesh_portfolio_v3_soft_skills',
  ACHIEVEMENTS: 'bhavesh_portfolio_v3_achievements',
  MESSAGES: 'bhavesh_portfolio_v3_messages',
  AUTH: 'bhavesh_portfolio_v3_admin_auth',
  ADMIN_CREDENTIALS: 'bhavesh_portfolio_admin_credentials',
  ADMIN_RESET_TOKEN: 'bhavesh_portfolio_admin_reset_token',
  SUPABASE_CONFIG: 'bhavesh_portfolio_supabase_config'
};

export interface AdminCredentials {
  email: string;
  password: string;
  updatedAt?: string;
}

export interface ResetTokenData {
  token: string;
  email: string;
  expiresAt: number;
}

export const defaultAdminCredentials: AdminCredentials = {
  email: 'bhaveshgupta901@gmail.com',
  password: 'Admin@Secure2026'
};

export const isRegisteredAdminEmail = (inputEmail: string, currentEmail: string): boolean => {
  const normInput = inputEmail.trim().toLowerCase();
  const normCurrent = currentEmail.trim().toLowerCase();
  if (normInput === normCurrent) return true;
  if (normInput === 'bhaveshgupta901@gmail.com' || normInput === 'bhaveshgupta1308@gmail.com') {
    return normCurrent === 'bhaveshgupta901@gmail.com' || normCurrent === 'bhaveshgupta1308@gmail.com';
  }
  return false;
};

export const getAdminCredentials = (): AdminCredentials => {
  try {
    const raw = localStorage.getItem(KEYS.ADMIN_CREDENTIALS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email && parsed.password) {
        if (parsed.email.toLowerCase() === 'bhaveshgupta1308@gmail.com') {
          parsed.email = 'bhaveshgupta901@gmail.com';
          localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch {}
  return defaultAdminCredentials;
};

// Sync admin credentials with Supabase database if connected
export const syncAdminCredentialsFromSupabase = async (): Promise<AdminCredentials> => {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('admin_auth')
        .select('*')
        .eq('id', 'admin_primary')
        .single();

      if (!error && data && data.email && data.password) {
        const synced: AdminCredentials = {
          email: data.email,
          password: data.password,
          updatedAt: data.updated_at
        };
        localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify(synced));
        return synced;
      } else if (error && error.code === 'PGRST116') {
        // Table exists but empty, seed default credentials
        const current = getAdminCredentials();
        await client.from('admin_auth').insert({
          id: 'admin_primary',
          email: current.email,
          password: current.password,
          updated_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Supabase admin_auth sync notice:', err);
    }
  }
  return getAdminCredentials();
};

export const saveAdminCredentials = (creds: AdminCredentials): void => {
  try {
    localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify(creds));
    window.dispatchEvent(new Event('portfolio-admin-creds-updated'));

    // Persist in Supabase admin_auth table
    const client = getSupabase();
    if (client) {
      client
        .from('admin_auth')
        .upsert({
          id: 'admin_primary',
          email: creds.email,
          password: creds.password,
          updated_at: creds.updatedAt || new Date().toISOString()
        })
        .then(
          ({ error }: any) => {
            if (error) {
              console.warn('Supabase admin_auth upsert notice:', error.message);
            }
          },
          (e: any) => console.warn('Supabase admin_auth save error:', e)
        );
    }
  } catch (err) {
    console.error('Failed to save admin credentials:', err);
  }
};

// STRICT Admin Login Verification: ONLY the registered email and active new password are valid
export const verifyAdminLogin = async (
  email: string,
  pass: string
): Promise<{ success: boolean; message?: string }> => {
  // Always attempt to get freshest credentials from Supabase first
  await syncAdminCredentialsFromSupabase();
  const creds = getAdminCredentials();
  const inputEmail = email.trim().toLowerCase();
  const regEmail = creds.email.trim().toLowerCase();

  // STRICT CHECK: Matches registered admin email and exact active password
  if (isRegisteredAdminEmail(inputEmail, regEmail) && pass === creds.password) {
    return { success: true };
  }

  // Also check Supabase Auth if used
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password: pass
      });
      if (!error && data?.user) {
        return { success: true };
      }
    } catch {
      // fallback to rejection
    }
  }

  return {
    success: false,
    message: 'Incorrect email or password. Only your current new password is valid. If you forgot your password, please use the Forgotten Password recovery flow.'
  };
};

// Verify Old Credentials (Required before unlocking new password generator)
export const verifyOldCredentials = async (
  email: string,
  oldPassword: string
): Promise<{ success: boolean; message?: string }> => {
  await syncAdminCredentialsFromSupabase();
  const creds = getAdminCredentials();
  const inputEmail = email.trim().toLowerCase();
  const regEmail = creds.email.trim().toLowerCase();

  if (!isRegisteredAdminEmail(inputEmail, regEmail)) {
    return {
      success: false,
      message: `Email "${email}" does not match the registered admin email (${creds.email}).`
    };
  }

  if (oldPassword !== creds.password) {
    return {
      success: false,
      message: 'Old password is incorrect. Please enter your valid current password to unlock new password generator.'
    };
  }

  return { success: true };
};

// Change Admin Password with Old Password Verification
export const changeAdminPasswordWithOldVerification = async (
  registeredEmail: string,
  oldPassword: string,
  newPassword: string,
  newEmail?: string
): Promise<{ success: boolean; message: string }> => {
  const verification = await verifyOldCredentials(registeredEmail, oldPassword);
  if (!verification.success) {
    return {
      success: false,
      message: verification.message || 'Verification failed. Cannot change password.'
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      message: 'New password must be at least 6 characters long.'
    };
  }

  if (newPassword === oldPassword) {
    return {
      success: false,
      message: 'New password must be different from your old password.'
    };
  }

  const creds = getAdminCredentials();
  const updatedEmail = newEmail && newEmail.trim() ? newEmail.trim() : creds.email;
  const updatedCreds: AdminCredentials = {
    email: updatedEmail,
    password: newPassword.trim(),
    updatedAt: new Date().toISOString()
  };

  saveAdminCredentials(updatedCreds);

  // If Supabase Auth is active, also update Supabase user
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.updateUser({ password: newPassword.trim(), email: updatedEmail });
    } catch {}
  }

  return {
    success: true,
    message: 'Password successfully updated! From now on, you can ONLY log in using this new password.'
  };
};

export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; message: string; token?: string; confirmUrl?: string }> => {
  await syncAdminCredentialsFromSupabase();
  const creds = getAdminCredentials();
  const normalizedInput = email.trim().toLowerCase();
  const registeredEmail = creds.email.trim().toLowerCase();

  if (!isRegisteredAdminEmail(normalizedInput, registeredEmail)) {
    return {
      success: false,
      message: `Email "${email}" is not registered to this admin account. Please provide your registered admin Gmail (${creds.email}).`
    };
  }

  const token = 'rst_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  const tokenData: ResetTokenData = {
    token,
    email: creds.email,
    expiresAt: Date.now() + 1000 * 60 * 30 // 30 minutes validity
  };
  localStorage.setItem(KEYS.ADMIN_RESET_TOKEN, JSON.stringify(tokenData));

  const confirmUrl = `${window.location.origin}/admin?recovery_token=${token}`;

  // If Supabase is connected, record in admin_password_resets table
  const client = getSupabase();
  if (client) {
    try {
      await client.from('admin_password_resets').insert({
        id: `reset_${Date.now()}`,
        email: creds.email,
        token: token,
        expires_at: new Date(tokenData.expiresAt).toISOString(),
        used: false
      });
      await client.auth.resetPasswordForEmail(creds.email, {
        redirectTo: confirmUrl
      });
    } catch (err) {
      console.warn('Supabase reset table record notice:', err);
    }
  }

  return {
    success: true,
    message: `Password reset confirmation email dispatched to ${creds.email}`,
    token,
    confirmUrl
  };
};

export const verifyResetToken = (token: string): boolean => {
  try {
    const raw = localStorage.getItem(KEYS.ADMIN_RESET_TOKEN);
    if (!raw) return false;
    const parsed: ResetTokenData = JSON.parse(raw);
    return parsed.token === token && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
};

export const completePasswordReset = async (
  newPassword: string,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      message: 'New password must be at least 6 characters long.'
    };
  }

  const creds = getAdminCredentials();
  creds.password = newPassword.trim();
  creds.updatedAt = new Date().toISOString();
  saveAdminCredentials(creds);

  localStorage.removeItem(KEYS.ADMIN_RESET_TOKEN);

  const client = getSupabase();
  if (client) {
    try {
      if (token) {
        await client.from('admin_password_resets').update({ used: true }).eq('token', token);
      }
      await client.auth.updateUser({ password: newPassword.trim() });
    } catch (err) {
      console.warn('Supabase password reset update notice:', err);
    }
  }

  return {
    success: true,
    message: 'New password created successfully! The admin panel will now open ONLY with this new password.'
  };
};

// Supabase configuration helper
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  try {
    const saved = localStorage.getItem(KEYS.SUPABASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey && !parsed.anonKey.startsWith('sb_secret_')) {
        return parsed;
      } else {
        localStorage.removeItem(KEYS.SUPABASE_CONFIG);
      }
    }
  } catch {
    // fallback
  }

  return {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://ultywhoggpycgoxzjqnb.supabase.co',
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdHl3aG9nZ3B5Y2dveHpqcW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MDU4NDQsImV4cCI6MjEwNDE4MTg0NH0.eO_WOudNpuV0tBOHpeDJ8n0NA2uULKlW3qDaFV4JySo'
  };
};

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  try {
    localStorage.setItem(KEYS.SUPABASE_CONFIG, JSON.stringify(config));
    // reinitialize client if needed
    supabaseInstance = (config.url && config.anonKey)
      ? createClient(config.url, config.anonKey)
      : null;
    window.dispatchEvent(new Event('portfolio-supabase-updated'));
  } catch (err) {
    console.error('Failed to save Supabase configuration:', err);
  }
};

// Dynamic client initialization
const initialConfig = getSupabaseConfig();
let supabaseInstance: SupabaseClient | null = (initialConfig.url && initialConfig.anonKey)
  ? createClient(initialConfig.url, initialConfig.anonKey)
  : null;

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseInstance) {
    const cfg = getSupabaseConfig();
    if (cfg.url && cfg.anonKey) {
      supabaseInstance = createClient(cfg.url, cfg.anonKey);
    }
  }
  return supabaseInstance;
};

export const supabase = supabaseInstance;

// Universal store access
export const getStoredData = () => {
  const get = <T>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    profile: get<ProfileData>(KEYS.PROFILE, defaultProfile),
    projects: get<Project[]>(KEYS.PROJECTS, defaultProjects),
    experiences: get<Experience[]>(KEYS.EXPERIENCES, defaultExperiences),
    education: get<Education[]>(KEYS.EDUCATION, defaultEducation),
    skills: get<SkillCategory[]>(KEYS.SKILLS, defaultSkills),
    softSkills: get<SoftSkill[]>(KEYS.SOFT_SKILLS, softSkillsList),
    achievements: get<Achievement[]>(KEYS.ACHIEVEMENTS, defaultAchievements),
    messages: get<ContactMessage[]>(KEYS.MESSAGES, initialMessages)
  };
};

export const saveItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('portfolio-data-updated'));

    // Automatically sync content to Supabase database if connected
    const client = getSupabase();
    if (client) {
      client
        .from('portfolio_content')
        .upsert({
          key,
          data,
          updated_at: new Date().toISOString()
        })
        .then(
          () => {},
          (err: any) => console.warn('Supabase portfolio_content sync notice:', err)
        );
    }
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

// Sync all portfolio content from Supabase on startup
export const syncPortfolioContentFromSupabase = async (): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { data, error } = await client.from('portfolio_content').select('*');
    if (!error && data && data.length > 0) {
      data.forEach((row: { key: string; data: any }) => {
        if (row.key && row.data) {
          localStorage.setItem(row.key, JSON.stringify(row.data));
        }
      });
      window.dispatchEvent(new Event('portfolio-data-updated'));
      return true;
    }
  } catch (err) {
    console.warn('Supabase content sync notice:', err);
  }
  return false;
};

// One-click push of all currently stored data to Supabase
export const pushAllContentToSupabase = async (): Promise<{ success: boolean; count: number; message: string }> => {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      count: 0,
      message: 'Supabase is not connected. Please enter your Supabase Project URL and Anon API Key in Settings first.'
    };
  }

  try {
    const stored = getStoredData();
    const creds = getAdminCredentials();
    const rows = [
      { key: KEYS.PROFILE, data: stored.profile, updated_at: new Date().toISOString() },
      { key: KEYS.PROJECTS, data: stored.projects, updated_at: new Date().toISOString() },
      { key: KEYS.EXPERIENCES, data: stored.experiences, updated_at: new Date().toISOString() },
      { key: KEYS.EDUCATION, data: stored.education, updated_at: new Date().toISOString() },
      { key: KEYS.SKILLS, data: stored.skills, updated_at: new Date().toISOString() },
      { key: KEYS.SOFT_SKILLS, data: stored.softSkills, updated_at: new Date().toISOString() },
      { key: KEYS.ACHIEVEMENTS, data: stored.achievements, updated_at: new Date().toISOString() }
    ];

    const { error } = await client.from('portfolio_content').upsert(rows);
    if (error) {
      return { success: false, count: 0, message: `Supabase error: ${error.message}. Make sure the portfolio_content table exists.` };
    }

    // Also sync admin_auth
    await client.from('admin_auth').upsert({
      id: 'admin_primary',
      email: creds.email,
      password: creds.password,
      updated_at: new Date().toISOString()
    });

    return {
      success: true,
      count: rows.length + 1,
      message: `Successfully synchronized all ${rows.length} portfolio sections and admin credentials to Supabase cloud database!`
    };
  } catch (err: any) {
    return { success: false, count: 0, message: err.message || 'Failed to upload portfolio content to Supabase.' };
  }
};

// Contact Message Submission with Supabase + LocalStorage sync
export const submitContactMessage = async (msg: ContactMessage): Promise<{ success: boolean; source: 'supabase' | 'local' }> => {
  // 1. Always save to LocalStorage immediately
  try {
    const current = getStoredData();
    const updatedMessages = [msg, ...current.messages.filter(m => m.id !== msg.id)];
    saveItem(KEYS.MESSAGES, updatedMessages);
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  // 2. Try saving to Supabase if connected
  const client = getSupabase();
  if (client) {
    try {
      const { error } = await client
        .from('messages')
        .insert([
          {
            id: msg.id,
            name: msg.name,
            email: msg.email,
            subject: msg.subject,
            message: msg.message,
            created_at: new Date().toISOString(),
            read: false
          }
        ]);

      if (!error) {
        return { success: true, source: 'supabase' };
      }
      console.warn('Supabase insert warning, fallbacked to local:', error.message);
    } catch (err) {
      console.warn('Supabase network error, stored locally:', err);
    }
  }

  return { success: true, source: 'local' };
};

// Fetch messages from Supabase
export const syncSupabaseMessages = async (): Promise<ContactMessage[] | null> => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Could not sync with Supabase:', error?.message);
      return null;
    }

    const formatted: ContactMessage[] = data.map((item: any) => ({
      id: item.id || `msg-${Date.now()}`,
      name: item.name || '',
      email: item.email || '',
      subject: item.subject || '',
      message: item.message || '',
      createdAt: item.created_at ? new Date(item.created_at).toLocaleString() : new Date().toLocaleString(),
      read: !!item.read
    }));

    // Merge with local messages
    const current = getStoredData();
    const mergedMap = new Map<string, ContactMessage>();
    current.messages.forEach(m => mergedMap.set(m.id, m));
    formatted.forEach(m => mergedMap.set(m.id, m));

    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    saveItem(KEYS.MESSAGES, merged);
    return merged;
  } catch (err) {
    console.error('Sync messages error:', err);
    return null;
  }
};

export const resetToDefaults = () => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(defaultProfile));
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(defaultProjects));
  localStorage.setItem(KEYS.EXPERIENCES, JSON.stringify(defaultExperiences));
  localStorage.setItem(KEYS.EDUCATION, JSON.stringify(defaultEducation));
  localStorage.setItem(KEYS.SKILLS, JSON.stringify(defaultSkills));
  localStorage.setItem(KEYS.SOFT_SKILLS, JSON.stringify(softSkillsList));
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(initialMessages));
  window.dispatchEvent(new Event('portfolio-data-updated'));
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(KEYS.AUTH) === 'true';
};

export const setAdminAuth = (auth: boolean): void => {
  if (auth) {
    localStorage.setItem(KEYS.AUTH, 'true');
  } else {
    localStorage.removeItem(KEYS.AUTH);
  }
};

// Resume Upload & Supabase Storage sync
export const uploadResumeFile = async (
  file: File
): Promise<{ success: boolean; url: string; fileName: string; source: 'supabase' | 'local'; error?: string }> => {
  const client = getSupabase();
  let supabaseUrl = '';

  // 1. If Supabase is connected, attempt uploading to 'resumes' bucket
  if (client) {
    try {
      const cleanFileName = `Bhavesh_Gupta_Resume_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error } = await client.storage
        .from('resumes')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: pub } = client.storage.from('resumes').getPublicUrl(cleanFileName);
        if (pub?.publicUrl) {
          supabaseUrl = pub.publicUrl;
        }
      } else if (error) {
        console.warn('Supabase storage upload notice:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase storage upload error:', err);
    }
  }

  // 2. Read as Base64 Data URL so the file is stored immediately in localStorage and works instantly for downloads
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const finalUrl = supabaseUrl || dataUrl;
      const current = getStoredData();
      const updatedProfile: ProfileData = {
        ...current.profile,
        resumeUrl: finalUrl,
        resumeFileName: file.name
      };
      saveItem(KEYS.PROFILE, updatedProfile);
      resolve({
        success: true,
        url: finalUrl,
        fileName: file.name,
        source: supabaseUrl ? 'supabase' : 'local'
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        url: '',
        fileName: file.name,
        source: 'local',
        error: 'Failed to read file on client'
      });
    };
    reader.readAsDataURL(file);
  });
};
