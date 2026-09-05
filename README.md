# 🚀 Bhavesh Gupta — Developer Portfolio & Admin Control Center

A modern, high-performance developer portfolio website built with **React 19**, **TypeScript**, and **Vite**, featuring a private, password-protected **Admin Control Center** with live content synchronization and **Supabase** cloud database integration.

---

## ✨ Features

### 🌐 Portfolio Website
- **Hero Showcase**: Dynamic bio, social links, status badges, and direct resume download button.
- **About & Achievements**: Career narrative accompanied by metric cards and milestone badges.
- **Skills Matrix**: Technical skills categorised by frontend, backend, tools, and databases with mastery levels.
- **Soft Skills**: Interactive grid highlighting interpersonal, leadership, and analytical strengths.
- **Work Experience**: Chronological interactive timeline detailing roles, responsibilities, and achievements.
- **Projects Showcase**: Curated showcase with live demo links, source code repositories, and technology badges.
- **Education & Certifications**: Academic qualifications and verified industry certifications.
- **Interactive Contact Section**: Contact form with live message dispatch directly to Supabase cloud database.

### 🛡️ Private Admin Control Center (`/admin`)
- **Secure Access**: Protected by email and password authentication, hidden from public website navigation.
- **Password Recovery Flow**: Forgot password workflow with confirmation email simulation and secure token validation.
- **Strict Credential Updates**: 2-step verification requiring active registered email and current password before new password generation.
- **Live Content Management**: Instant two-way synchronization between Admin Panel edits and public portfolio sections.
- **Resume Management**: Direct PDF/DOCX resume file upload with real-time replacement of the public download link.
- **Cloud Backup**: 1-click **Push All Content to Supabase Cloud** and **Pull / Refresh** features.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS3, Modern CSS Variables, Glassmorphism, Responsive Design
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Cloud Database**: [Supabase](https://supabase.com/) (PostgreSQL & Storage)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/Portfolio.git
cd Portfolio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and enter your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: The portfolio also allows you to configure these keys directly in the Admin Panel UI under Settings).*

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser and visit:
- **Public Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Admin Control Center**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🗄️ Supabase Cloud Setup

To enable cloud storage for visitor messages, resume uploads, and live content:

### 1. Database Tables
In your Supabase project dashboard, navigate to **SQL Editor** ➔ **+ New query**, paste the following script, and click **Run**:

```sql
-- 1. Contact Form Messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- 2. Portfolio Website Content (Syncs All Sections)
CREATE TABLE IF NOT EXISTS portfolio_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Admin Authentication Credentials
CREATE TABLE IF NOT EXISTS admin_auth (
  id TEXT PRIMARY KEY DEFAULT 'admin_primary',
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed for admin
INSERT INTO admin_auth (id, email, password)
VALUES ('admin_primary', 'bhaveshgupta1308@gmail.com', 'Admin@Secure2026')
ON CONFLICT (id) DO NOTHING;

-- 4. Password Reset Requests
CREATE TABLE IF NOT EXISTS admin_password_resets (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_password_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin access messages" ON messages FOR ALL USING (true);
CREATE POLICY "Public read portfolio_content" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Admin access portfolio_content" ON portfolio_content FOR ALL USING (true);
CREATE POLICY "Admin auth access" ON admin_auth FOR ALL USING (true);
CREATE POLICY "Admin reset tokens access" ON admin_password_resets FOR ALL USING (true);
```

### 2. Storage Bucket for Resumes
1. In the Supabase sidebar, click **Storage**.
2. Click **New bucket** and name it `resumes` *(all lowercase)*.
3. Toggle **Public bucket** to **ON**.
4. Click **Save**.

---

## 🔒 Admin Panel Access

- **URL**: `/admin` (e.g., `http://localhost:3000/admin`)
- **Default Email**: `bhaveshgupta1308@gmail.com`
- **Default Password**: `Admin@Secure2026`

*You can update your email, password, and profile metadata directly inside **Admin Panel ➔ Settings** at any time.*

---

## 📦 Build for Production

To create an optimized production bundle:
```bash
npm run build
```
The compiled assets will be output to the `dist/` directory, ready to deploy to [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [GitHub Pages](https://pages.github.com/).

---

## 👤 Author

**Bhavesh Gupta**
- **Email**: [bhaveshgupta1308@gmail.com](mailto:bhaveshgupta1308@gmail.com)
- **Portfolio**: [http://localhost:3000](http://localhost:3000)
