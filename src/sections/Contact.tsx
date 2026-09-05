import React, { useState } from 'react';
import { ProfileData, ContactMessage } from '../types/portfolio';
import { submitContactMessage } from '../lib/supabaseClient';
import confetti from 'canvas-confetti';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/SocialIcons';

interface ContactProps {
  profile: ProfileData;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please provide a subject.';
    if (!formData.message.trim()) errs.message = 'Please type your message.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Create new message
      const newMessage: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        createdAt: new Date().toLocaleString(),
        read: false
      };

      // Save to Supabase and LocalStorage
      await submitContactMessage(newMessage);

      // Fire victory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#0070F3', '#38BDF8', '#FFFFFF']
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-spacing">
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-neon" style={{ marginBottom: '12px' }}>
            INITIATE CONTACT
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', textTransform: 'uppercase' }}>
            LET'S BUILD <span className="text-cyan-glow">SOMETHING GREAT</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '14px auto 0', fontSize: '1rem' }}>
            Open for software engineering opportunities, AI systems development, and technical consulting.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Direct Communication Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#FFFFFF' }}>
                Direct Channels
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
                Reach out directly via email, phone, or connect on LinkedIn and GitHub for prompt responses.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <a
                  href={`mailto:${profile.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan-core)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0, 240, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cyan-core)',
                      flexShrink: 0
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      EMAIL ADDRESS
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                      {profile.email}
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:${profile.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan-core)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0, 240, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cyan-core)',
                      flexShrink: 0
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      PHONE / WHATSAPP
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                      {profile.phone}
                    </div>
                  </div>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0, 240, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cyan-core)',
                      flexShrink: 0
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      LOCATION
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                      {profile.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Profiles Pill Group */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '12px' }}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <GithubIcon size={16} /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <LinkedinIcon size={16} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Glass Contact Form */}
          <div className="glass-panel" style={{ padding: '34px', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#FFFFFF' }}>
              Send Direct Message
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Submissions are securely delivered to my inbox and tracked in real-time.
            </p>

            {submitted && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  fontSize: '0.9rem'
                }}
              >
                <CheckCircle2 size={20} color="#10B981" />
                <span>Thank you! Your message has been sent successfully. I will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  YOUR FULL NAME *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-glass-input)',
                    border: errors.name ? '1px solid #EF4444' : '1px solid rgba(0, 240, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--cyan-core)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.name ? '#EF4444' : 'rgba(0, 240, 255, 0.2)')}
                />
                {errors.name && (
                  <span style={{ fontSize: '0.75rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <AlertCircle size={12} /> {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  YOUR EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@company.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-glass-input)',
                    border: errors.email ? '1px solid #EF4444' : '1px solid rgba(0, 240, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--cyan-core)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.email ? '#EF4444' : 'rgba(0, 240, 255, 0.2)')}
                />
                {errors.email && (
                  <span style={{ fontSize: '0.75rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <AlertCircle size={12} /> {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  SUBJECT *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Full-Stack Role / Project Collaboration"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-glass-input)',
                    border: errors.subject ? '1px solid #EF4444' : '1px solid rgba(0, 240, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--cyan-core)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.subject ? '#EF4444' : 'rgba(0, 240, 255, 0.2)')}
                />
                {errors.subject && (
                  <span style={{ fontSize: '0.75rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <AlertCircle size={12} /> {errors.subject}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  YOUR MESSAGE *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your team, role or project..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-glass-input)',
                    border: errors.message ? '1px solid #EF4444' : '1px solid rgba(0, 240, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--cyan-core)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.message ? '#EF4444' : 'rgba(0, 240, 255, 0.2)')}
                />
                {errors.message && (
                  <span style={{ fontSize: '0.75rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <AlertCircle size={12} /> {errors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-cyan"
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '14px',
                  fontSize: '0.95rem'
                }}
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
