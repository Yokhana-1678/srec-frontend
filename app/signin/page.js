'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, ShieldCheck } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

export default function SignInPage() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
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
      localStorage.setItem('userEmail', email);
      setSuccess('✅ Signed in successfully! Redirecting...');
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
        background: 'linear-gradient(135deg, #0F0A2A 0%, #1c134d 50%, #0F0A2A 100%)',
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
                Portal Sign In<br />
                <span style={{ color: '#8b7cf8' }}>Management</span><br />
                System
              </h1>
              <p style={{ color: '#a89ee8', fontSize: '14px', margin: '0 0 40px 0', lineHeight: '1.6' }}>
                Secure administrative and academic access portal.
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
                Security OTP<br />Verification
              </h1>
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
              }}>Sign In</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px 0' }}>
                Enter your registered email to receive a sign-in OTP
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
                  {loading ? 'Sending OTP...' : 'Send Sign-in Code'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 style={{
                fontSize: '28px', fontWeight: '700', color: '#1B1B2F',
                margin: '0 0 8px 0'
              }}>Enter OTP</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px 0' }}>
                Sign-in code sent to{' '}
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