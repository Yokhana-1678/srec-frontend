'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

const API_BASE = 'http://localhost:5000';

export default function SignUpPage() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const inputRefs = useRef([]);

  const startCooldown = () => {
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setStep('otp');
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('token', await user.getIdToken());
      localStorage.setItem('userEmail', user.email);
      router.push('/home');
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const otpString = otp.join('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      localStorage.setItem('token', data.token);
      setSuccess('✅ Verified successfully! Redirecting...');
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Left Panel */}
      <div style={{
        width: '44%',
        background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1a1040 100%)',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', background: 'rgba(108,92,231,0.15)',
          top: '-100px', right: '-100px',
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(108,92,231,0.1)',
          bottom: '50px', left: '-80px',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: '#6C5CE7', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <GraduationCap size={22} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>SREC</div>
            <div style={{ color: '#a89ee8', fontSize: '13px' }}>SREC Engineering College</div>
          </div>
        </div>

        {/* Center content */}
        <div style={{ zIndex: 1 }}>
          {step === 'email' ? (
            <>
              <h1 style={{
                color: '#fff', fontSize: '36px', fontWeight: '800',
                lineHeight: '1.2', margin: '0 0 16px 0'
              }}>
                Student Records<br />
                <span style={{ color: '#8b7cf8' }}>Management</span><br />
                Dashboard
              </h1>
              <p style={{ color: '#a89ee8', fontSize: '14px', margin: '0 0 40px 0', lineHeight: '1.6' }}>
                A unified academic portal for tracking student<br />
                records, performance, and departmental<br />
                analytics.
              </p>
            </>
          ) : (
            <>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'rgba(108,92,231,0.3)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
              }}>
                <ShieldCheck size={32} color="#8b7cf8" />
              </div>
              <h1 style={{
                color: '#fff', fontSize: '36px', fontWeight: '800',
                lineHeight: '1.2', margin: '0 0 16px 0'
              }}>
                Secure OTP<br />Verification
              </h1>
              <p style={{ color: '#a89ee8', fontSize: '14px', lineHeight: '1.6' }}>
                Your account is protected with email-based OTP<br />
                authentication for safe, password-free access.
              </p>
            </>
          )}
        </div>
        <div style={{ zIndex: 1 }} />
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, background: '#ffffff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {step === 'email' && (
            <>
              <h2 style={{
                fontSize: '28px', fontWeight: '700', color: '#1B1B2F',
                margin: '0 0 8px 0'
              }}>Sign up</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px 0' }}>
                Enter your Gmail to receive a one-time code
              </p>

              {error && (
                <p style={{ color: '#E63946', fontSize: '13px', marginBottom: '16px' }}>
                  {error}
                </p>
              )}

              <form onSubmit={handleSendOtp}>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Mail size={18} color="#9ca3af" style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none'
                  }} />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    suppressHydrationWarning
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      borderRadius: '12px',
                      border: '1.5px solid #e5e7eb',
                      fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box', color: '#1B1B2F',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  style={{
                    width: '100%', padding: '14px',
                    background: '#6C5CE7', color: '#fff',
                    border: 'none', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    marginBottom: '16px',
                  }}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>

              {/* Divider */}
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '16px'
              }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: '100%', padding: '14px',
                  background: '#fff', color: '#1B1B2F',
                  border: '1.5px solid #e5e7eb', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '600',
                  cursor: googleLoading ? 'not-allowed' : 'pointer',
                  opacity: googleLoading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '10px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
                  <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14l2.67-2.09z" />
                  <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.56-2.56A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z" />
                </svg>
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 style={{
                fontSize: '28px', fontWeight: '700', color: '#1B1B2F',
                margin: '0 0 8px 0'
              }}>Enter OTP</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px 0' }}>
                Code sent to{' '}
                <span style={{ color: '#6C5CE7', fontWeight: '500' }}>{email}</span>
              </p>

              {error && (
                <p style={{ color: '#E63946', fontSize: '13px', marginBottom: '16px' }}>
                  {error}
                </p>
              )}

              {success && (
                <p style={{
                  color: '#10b981', fontSize: '14px',
                  marginBottom: '16px', textAlign: 'center',
                  fontWeight: '600', background: '#f0fdf4',
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  {success}
                </p>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div style={{
                  display: 'flex', gap: '10px',
                  marginBottom: '24px', justifyContent: 'center'
                }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      style={{
                        width: '48px', height: '56px',
                        textAlign: 'center', fontSize: '20px',
                        fontWeight: '600', color: '#1B1B2F',
                        border: '1.5px solid',
                        borderColor: digit ? '#6C5CE7' : '#e5e7eb',
                        borderRadius: '12px', outline: 'none',
                        background: digit ? '#f5f3ff' : '#fff',
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  style={{
                    width: '100%', padding: '14px',
                    background: '#6C5CE7', color: '#fff',
                    border: 'none', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading || otp.join('').length < 6 ? 0.6 : 1,
                    marginBottom: '16px',
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Sign in'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={handleSendOtp}
                    style={{
                      background: 'none', border: 'none',
                      color: cooldown > 0 ? '#9ca3af' : '#6C5CE7',
                      fontSize: '13px',
                      cursor: cooldown > 0 ? 'default' : 'pointer',
                      display: 'block', width: '100%', marginBottom: '8px',
                    }}
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError(''); setSuccess(''); }}
                    style={{
                      background: 'none', border: 'none',
                      color: '#1B1B2F', fontSize: '13px',
                      fontWeight: '600', cursor: 'pointer',
                    }}
                  >
                    Change email
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}