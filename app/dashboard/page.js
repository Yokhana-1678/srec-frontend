'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, Users, BookOpen, TrendingUp, Award,
  LogOut, LayoutDashboard, Bell, ChevronRight, RefreshCw, Info, CheckCircle2, AlertCircle, ShieldAlert
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ── Sidebar shared config ──────────────────────────────────────────────────────
const SIDEBAR_BG   = '#0F0A2A';
const SIDEBAR_W    = '240px';
const ACCENT       = '#6C5CE7';
const NAV_MUTED    = 'rgba(168,158,232,0.7)';

function Sidebar({ active, onNavigate }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  return (
    <div style={{
      width: SIDEBAR_W, background: SIDEBAR_BG,
      display: 'flex', flexDirection: 'column',
      position: 'fixed', height: '100vh', zIndex: 10,
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '10px', padding: '24px 20px', marginBottom: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: ACCENT, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(108,92,231,0.4)',
        }}>
          <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px', lineHeight: 1.2 }}>SREC</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '0.5px' }}>Student ERP Portal</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: '0 12px', flex: 1 }}>
        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '600',
          letterSpacing: '1.2px', padding: '0 8px',
          marginBottom: '8px', textTransform: 'uppercase',
        }}>MAIN MENU</p>

        <button
          type="button"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px', borderRadius: '10px',
            cursor: 'pointer', marginBottom: '4px',
            fontSize: '14px', fontWeight: '500',
            border: 'none', width: '100%', textAlign: 'left',
            transition: 'all 0.2s',
            background: active === 'overview' ? ACCENT : 'transparent',
            color: active === 'overview' ? '#fff' : NAV_MUTED,
          }}
          onClick={() => onNavigate('overview')}
        >
          <LayoutDashboard size={16} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px', borderRadius: '10px',
            cursor: 'pointer', marginBottom: '4px',
            fontSize: '14px', fontWeight: '500',
            border: 'none', width: '100%', textAlign: 'left',
            transition: 'all 0.2s',
            background: active === 'students' ? ACCENT : 'transparent',
            color: active === 'students' ? '#fff' : NAV_MUTED,
          }}
          onClick={() => onNavigate('students')}
        >
          <Users size={16} />
          <span>Students</span>
        </button>
      </div>

      {/* User info */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: ACCENT, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '12px', fontWeight: '700',
          }}>A</div>
          <div>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>Admin</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>admin@srec.edu</div>
          </div>
        </div>
        <LogOut
          size={16} color="rgba(255,255,255,0.4)"
          style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

// ── CGPA badge ─────────────────────────────────────────────────────────────────
function CgpaBadge({ value }) {
  const v = parseFloat(value);
  const color = v >= 9.0 ? '#10b981' : v >= 8.5 ? '#6C5CE7' : v >= 8.0 ? '#818CF8' : '#f97316';
  return (
    <span style={{
      display: 'inline-block',
      background: `${color}15`, color: color,
      border: `1px solid ${color}35`,
      borderRadius: '6px', padding: '3px 8px',
      fontSize: '12px', fontWeight: '700', minWidth: '36px',
      textAlign: 'center',
    }}>{Number(value).toFixed(1)}</span>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0F0A2A',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: 'none',
      }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: '#fff' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#a89ee8', fontWeight: '500' }}>
          Students: <b style={{ color: '#fff' }}>{payload[0].value}</b>
        </p>
      </div>
    );
  }
  return null;
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('overview');
  const router = useRouter();

  const fetchDashboardData = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => { setStudents(data); setLoading(false); })
      .catch(err => {
        console.warn("Backend offline, loading mock dashboard stats");
        setStudents([
          { _id: "m1", name: "Floyd Miles", rollNo: "21CSE021", department: "CSE", section: "A", year: 3, cgpa: 8.6, attendance: 92 },
          { _id: "m2", name: "Jane Cooper", rollNo: "21ECE011", department: "ECE", section: "B", year: 2, cgpa: 7.9, attendance: 84 },
          { _id: "m3", name: "Jenny Wilson", rollNo: "21EEE031", department: "EEE", section: "A", year: 3, cgpa: 9.1, attendance: 95 },
          { _id: "m4", name: "Annette Black", rollNo: "21IT022", department: "IT", section: "C", year: 4, cgpa: 8.2, attendance: 78 },
          { _id: "m5", name: "Arlene McCoy", rollNo: "21MECH013", department: "MECH", section: "A", year: 4, cgpa: 7.5, attendance: 88 },
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNavigate = (key) => {
    if (key === 'students') {
      router.push('/students');
    } else {
      setActive('overview');
    }
  };

  const totalStudents = students.length;
  const departments   = [...new Set(students.map(s => s.department))].length;
  const avgCgpa       = students.length
    ? (students.reduce((sum, s) => sum + parseFloat(s.cgpa || 0), 0) / students.length).toFixed(2)
    : 0;
  const topPerformers = students.filter(s => parseFloat(s.cgpa || 0) >= 9.0).length;

  const deptData = [...new Set(students.map(s => s.department))].map(dept => ({
    name: dept,
    count: students.filter(s => s.department === dept).length,
  }));

  const cgpaData = [
    { range: '9.0+',    count: students.filter(s => parseFloat(s.cgpa || 0) >= 9.0).length,  color: '#10b981' },
    { range: '8.5-8.9', count: students.filter(s => parseFloat(s.cgpa || 0) >= 8.5 && parseFloat(s.cgpa || 0) < 9.0).length, color: '#6C5CE7' },
    { range: '8.0-8.4', count: students.filter(s => parseFloat(s.cgpa || 0) >= 8.0 && parseFloat(s.cgpa || 0) < 8.5).length, color: '#818CF8' },
    { range: '7.5-7.9', count: students.filter(s => parseFloat(s.cgpa || 0) >= 7.5 && parseFloat(s.cgpa || 0) < 8.0).length, color: '#f97316' },
  ];

  const getInitials = (name) => (name || "").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarColors = ['#10b981', '#6C5CE7', '#f97316', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  const statCards = [
    { icon: <Users size={20} color="#6C5CE7" />,     value: totalStudents, label: 'Total Students', bg: '#f0eeff', accent: '#6C5CE7', labelColor: '#6C5CE7' },
    { icon: <BookOpen size={20} color="#06b6d4" />,  value: departments,   label: 'Departments',    bg: '#ecfeff', accent: '#06b6d4', labelColor: '#06b6d4' },
    { icon: <TrendingUp size={20} color="#10b981" />,value: avgCgpa,       label: 'Average CGPA',   bg: '#f0fdf4', accent: '#10b981', labelColor: '#10b981' },
    { icon: <Award size={20} color="#f59e0b" />,     value: topPerformers, label: 'Top Performers', bg: '#fffbeb', accent: '#f59e0b', labelColor: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#F8F9FD' }}>
      <Sidebar active={active} onNavigate={handleNavigate} />

      {/* Main Content */}
      <div style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Header Bar */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #ECECF4',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 5,
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0F0A2A', margin: 0 }}>
              Dashboard Overview
            </h1>
            <p style={{ color: '#8B8BA7', fontSize: '13px', margin: '2px 0 0 0' }}>
              Academic metrics summary and recent registry activities.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={fetchDashboardData}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "#8B8BA7",
                display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500"
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            
            {/* Notification bell */}
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              border: '1.5px solid #ECECF4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: '#fff',
              position: 'relative',
            }}>
              <Bell size={17} color="#8B8BA7" />
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#ef4444', border: '1.5px solid #fff',
              }} />
            </div>
            {/* Admin avatar */}
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: ACCENT, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '14px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(108,92,231,0.3)',
            }}>N</div>
          </div>
        </div>

        {/* Page Body */}
        <div style={{ padding: '28px 32px', flex: 1 }} className="animate-fade-in">

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {statCards.map((card, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '16px',
                padding: '22px 24px',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid #ECECF4',
                borderTop: `3.5px solid ${card.accent}`,
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: card.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: '14px',
                }}>
                  {card.icon}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F0A2A', marginBottom: '4px' }}>
                  {loading ? '—' : card.value}
                </div>
                <div style={{ fontSize: '13px', color: card.labelColor, fontWeight: '600' }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>

            {/* Students by Department */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: '24px', border: '1px solid #ECECF4',
              boxShadow: 'var(--card-shadow)',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 2px 0' }}>
                Students by Department
              </h3>
              <p style={{ fontSize: '12px', color: ACCENT, margin: '0 0 18px 0', fontWeight: '600' }}>Enrollment distribution</p>
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={deptData} barSize={24}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8B8BA7' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#8B8BA7' }} axisLine={false} tickLine={false} width={20} />
                    <Tooltip cursor={{ fill: 'rgba(108,92,231,0.04)' }} content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#8B8BA7", fontSize: "13px" }}>No data loaded</div>
              )}
            </div>

            {/* CGPA Distribution */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: '24px', border: '1px solid #ECECF4',
              boxShadow: 'var(--card-shadow)',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 2px 0' }}>
                CGPA Distribution
              </h3>
              <p style={{ fontSize: '12px', color: '#f59e0b', margin: '0 0 18px 0', fontWeight: '600' }}>Performance grade bands</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cgpaData} barSize={24}>
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#8B8BA7' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8B8BA7' }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip cursor={{ fill: 'rgba(108,92,231,0.04)' }} content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {cgpaData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Students */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '24px', border: '1px solid #ECECF4',
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 2px 0' }}>
                  Recent Student Registries
                </h3>
                <p style={{ fontSize: '12px', color: '#8B8BA7', margin: 0 }}>Latest student profiles entered</p>
              </div>
              <button
                onClick={() => router.push('/students')}
                style={{
                  background: 'none', border: 'none',
                  color: ACCENT, fontSize: '13px',
                  fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '2px',
                  padding: 0,
                }}
              >
                View all students <ChevronRight size={14} />
              </button>
            </div>

            {loading && (
              <p style={{ textAlign: 'center', color: '#8B8BA7', padding: '20px 0', fontSize: '14px' }}>
                Fetching entries…
              </p>
            )}

            {!loading && students.slice(0, 5).map((s, index) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < Math.min(students.length, 5) - 1 ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: avatarColors[index % avatarColors.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '12px', fontWeight: '700',
                    flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {s.profilePicture ? (
                      <img
                        src={`http://localhost:5000${s.profilePicture}`}
                        alt={s.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : getInitials(s.name)}
                  </div>
                  <div>
                    <div
                      onClick={() => router.push(`/students/${s._id}`)}
                      style={{ fontSize: '14px', fontWeight: '700', color: '#0F0A2A', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                      onMouseLeave={e => e.currentTarget.style.color = '#0F0A2A'}
                    >{s.name}</div>
                    <div style={{ fontSize: '12px', color: '#8B8BA7', fontWeight: '500' }}>
                      {s.department} · {s.rollNo}
                    </div>
                  </div>
                </div>
                <CgpaBadge value={s.cgpa} />
              </div>
            ))}

            {!loading && students.length === 0 && (
              <p style={{ textAlign: 'center', color: '#8B8BA7', padding: '20px 0', fontSize: '14px' }}>
                No students enrolled yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}