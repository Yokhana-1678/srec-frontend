'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    GraduationCap, ArrowLeft, Pencil, Trash2, Upload, X, Save,
    User, Mail, Phone, MapPin, Calendar, Heart, BookOpen,
    TrendingUp, Award, Clock, FileText, Download, Plus,
    LayoutDashboard, Users, LogOut, Bell, ChevronDown,
    CheckCircle2, AlertCircle, Info, ShieldAlert, Camera, RefreshCw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ── Design tokens ─────────────────────────────────────────────────────────────
const SIDEBAR_BG = '#0F0A2A';
const SIDEBAR_W = '240px';
const ACCENT = '#6C5CE7';
const NAV_MUTED = 'rgba(168,158,232,0.7)';
const API_BASE = 'http://localhost:5000';

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar() {
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
                        background: 'transparent',
                        color: NAV_MUTED,
                    }}
                    onClick={() => router.push('/dashboard')}
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
                        background: ACCENT,
                        color: '#fff',
                    }}
                    onClick={() => router.push('/students')}
                >
                    <Users size={16} />
                    <span>Students</span>
                    <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#fff', marginLeft: 'auto',
                    }} />
                </button>
            </div>

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

// ── CGPA Badge ─────────────────────────────────────────────────────────────────
function CgpaBadge({ value }) {
    const v = parseFloat(value);
    const color = v >= 9.0 ? '#10b981' : v >= 8.5 ? '#6C5CE7' : v >= 8.0 ? '#818CF8' : '#f97316';
    return (
        <span style={{
            display: 'inline-block',
            background: `${color}15`, color: color,
            border: `1px solid ${color}35`,
            borderRadius: '6px', padding: '3px 10px',
            fontSize: '12px', fontWeight: '700',
            minWidth: '40px', textAlign: 'center',
        }}>{Number(value).toFixed(1)}</span>
    );
}

// ── Grade Color ────────────────────────────────────────────────────────────────
function gradeColor(grade) {
    switch (grade) {
        case 'S': return '#10b981';
        case 'A': return '#6C5CE7';
        case 'B': return '#3b82f6';
        case 'C': return '#f59e0b';
        case 'D': return '#f97316';
        case 'E': return '#ef4444';
        case 'U': return '#dc2626';
        default: return '#8B8BA7';
    }
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const profileRef = useRef(null);

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [activeTab, setActiveTab] = useState('overview');

    // Attendance form
    const [attDate, setAttDate] = useState('');
    const [attStatus, setAttStatus] = useState('Present');
    const [attRemarks, setAttRemarks] = useState('');

    // Academic form
    const [academicSem, setAcademicSem] = useState('');
    const [academicSgpa, setAcademicSgpa] = useState('');
    const [academicResults, setAcademicResults] = useState([{ subject: '', code: '', credits: '', grade: 'S' }]);

    // Document upload
    const [docName, setDocName] = useState('');
    const [docType, setDocType] = useState('Marksheet');

    // Toast state
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const toastId = Date.now();
        setToasts(prev => [...prev, { id: toastId, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toastId));
        }, 4000);
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    async function fetchStudent() {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/students/${id}`);
            if (!res.ok) throw new Error('Student not found');
            const data = await res.json();
            setStudent(data);
            setForm(data);
        } catch (err) {
            showToast('Failed to load student data', 'error');
        } finally {
            setLoading(false);
        }
    }

    // ── Save Profile Edits ────────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Update failed');
            const data = await res.json();
            setStudent(data);
            setEditing(false);
            showToast('Profile updated successfully', 'success');
        } catch (err) {
            showToast('Failed to update profile', 'error');
        }
    };

    // ── Profile Picture ───────────────────────────────────────────────────────
    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('profilePicture', file);
        try {
            const res = await fetch(`${API_BASE}/api/students/${id}/profile-picture`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setStudent(prev => ({ ...prev, profilePicture: data.profilePicture }));
            showToast('Profile picture updated', 'success');
        } catch (err) {
            showToast('Failed to upload profile picture', 'error');
        }
    };

    const handleRemoveProfilePic = async () => {
        try {
            await fetch(`${API_BASE}/api/students/${id}/profile-picture`, { method: 'DELETE' });
            setStudent(prev => ({ ...prev, profilePicture: '' }));
            showToast('Profile picture removed', 'success');
        } catch (err) {
            showToast('Failed to remove profile picture', 'error');
        }
    };

    // ── Document Upload ───────────────────────────────────────────────────────
    const handleDocUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', docName || file.name);
        formData.append('type', docType);
        try {
            const res = await fetch(`${API_BASE}/api/students/${id}/documents`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            await fetchStudent();
            setDocName('');
            showToast('Document uploaded successfully', 'success');
        } catch (err) {
            showToast('Failed to upload document', 'error');
        }
    };

    const handleDeleteDoc = async (docId) => {
        try {
            await fetch(`${API_BASE}/api/students/${id}/documents/${docId}`, { method: 'DELETE' });
            await fetchStudent();
            showToast('Document deleted', 'success');
        } catch (err) {
            showToast('Failed to delete document', 'error');
        }
    };

    // ── Attendance ────────────────────────────────────────────────────────────
    const handleAddAttendance = async (e) => {
        e.preventDefault();
        if (!attDate) return;
        try {
            const res = await fetch(`${API_BASE}/api/students/${id}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: attDate, status: attStatus, remarks: attRemarks }),
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setStudent(data);
            setAttDate('');
            setAttRemarks('');
            showToast('Attendance recorded', 'success');
        } catch (err) {
            showToast('Failed to record attendance', 'error');
        }
    };

    // ── Academics ─────────────────────────────────────────────────────────────
    const handleAddAcademic = async (e) => {
        e.preventDefault();
        if (!academicSem || !academicSgpa) return;
        try {
            const res = await fetch(`${API_BASE}/api/students/${id}/academics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    semester: Number(academicSem),
                    sgpa: Number(academicSgpa),
                    results: academicResults.filter(r => r.subject && r.code).map(r => ({
                        ...r, credits: Number(r.credits)
                    })),
                }),
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setStudent(data);
            setAcademicSem('');
            setAcademicSgpa('');
            setAcademicResults([{ subject: '', code: '', credits: '', grade: 'S' }]);
            showToast('Academic record saved', 'success');
        } catch (err) {
            showToast('Failed to save academic record', 'error');
        }
    };

    // ── Export PDF ─────────────────────────────────────────────────────────────
    const handleExportPdf = async () => {
        if (!profileRef.current) return;
        try {
            const canvas = await html2canvas(profileRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${student?.name || 'student'}_profile.pdf`);
            showToast('PDF exported successfully', 'success');
        } catch (err) {
            showToast('Failed to export PDF', 'error');
        }
    };

    // ── Delete Student ────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
        try {
            await fetch(`${API_BASE}/api/students/${id}`, { method: 'DELETE' });
            showToast('Student deleted', 'success');
            setTimeout(() => router.push('/students'), 1000);
        } catch (err) {
            showToast('Failed to delete student', 'error');
        }
    };

    const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const tabs = [
        { key: 'overview', label: 'Overview', icon: <User size={14} /> },
        { key: 'academics', label: 'Academics', icon: <BookOpen size={14} /> },
        { key: 'attendance', label: 'Attendance', icon: <Clock size={14} /> },
        { key: 'documents', label: 'Documents', icon: <FileText size={14} /> },
    ];

    const inputStyle = {
        width: '100%', padding: '10px 14px',
        border: '1.5px solid #ECECF4',
        borderRadius: '10px',
        fontSize: '14px', color: '#1E1B4B', outline: 'none',
        background: '#FAFAFD', boxSizing: 'border-box',
        transition: 'all 0.15s ease',
    };

    if (loading) {
        return (
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', background: '#F8F9FD', display: 'flex' }}>
                <Sidebar />
                <div style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${ACCENT}`, borderTopColor: 'transparent' }} className="animate-spin" />
                        <p style={{ marginTop: '16px', color: '#8B8BA7', fontSize: '14px' }}>Loading student profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', background: '#F8F9FD', display: 'flex' }}>
                <Sidebar />
                <div style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                        <h2 style={{ color: '#0F0A2A', fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Student Not Found</h2>
                        <p style={{ color: '#8B8BA7', fontSize: '14px', margin: '0 0 24px 0' }}>The student profile you are looking for does not exist.</p>
                        <button
                            onClick={() => router.push('/students')}
                            style={{
                                padding: '12px 24px', background: ACCENT, color: '#fff',
                                border: 'none', borderRadius: '10px', fontSize: '14px',
                                fontWeight: '600', cursor: 'pointer',
                            }}
                        >← Back to Students</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', background: '#F8F9FD', display: 'flex' }}>
            <Sidebar />

            <div style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Top Header Bar */}
                <div style={{
                    background: '#fff', borderBottom: '1px solid #ECECF4',
                    padding: '16px 32px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 5,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => router.push('/students')}
                            style={{
                                background: 'none', border: '1px solid #ECECF4', borderRadius: '10px',
                                padding: '8px 12px', cursor: 'pointer', color: '#4A4A68',
                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500',
                            }}
                        >
                            <ArrowLeft size={14} /> Back
                        </button>
                        <div>
                            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0F0A2A', margin: 0 }}>
                                Student Profile
                            </h1>
                            <p style={{ color: '#8B8BA7', fontSize: '13px', margin: '2px 0 0 0' }}>
                                {student.name} · {student.rollNo}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={handleExportPdf}
                            style={{
                                background: '#fff', border: '1px solid #ECECF4', borderRadius: '10px',
                                padding: '8px 16px', cursor: 'pointer', color: '#4A4A68',
                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600',
                            }}
                        >
                            <Download size={14} /> Export PDF
                        </button>
                        <button
                            onClick={() => { setEditing(!editing); setForm(student); }}
                            style={{
                                background: editing ? '#f59e0b' : ACCENT, border: 'none', borderRadius: '10px',
                                padding: '8px 16px', cursor: 'pointer', color: '#fff',
                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600',
                                boxShadow: `0 4px 12px ${editing ? 'rgba(245,158,11,0.3)' : 'rgba(108,92,231,0.25)'}`,
                            }}
                        >
                            {editing ? <><X size={14} /> Cancel</> : <><Pencil size={14} /> Edit</>}
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                background: '#fff', border: '1px solid #FCA5A5', borderRadius: '10px',
                                padding: '8px 16px', cursor: 'pointer', color: '#ef4444',
                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600',
                            }}
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            border: '1.5px solid #ECECF4',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', background: '#fff', position: 'relative',
                        }}>
                            <Bell size={17} color="#8B8BA7" />
                            <span style={{
                                position: 'absolute', top: '6px', right: '6px',
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: '#ef4444', border: '1.5px solid #fff',
                            }} />
                        </div>
                    </div>
                </div>

                {/* Page Body */}
                <div ref={profileRef} style={{ padding: '28px 32px', flex: 1 }} className="animate-fade-in">

                    {/* Profile Header Card */}
                    <div style={{
                        background: '#fff', borderRadius: '16px',
                        border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                        padding: '28px', marginBottom: '24px',
                        display: 'flex', alignItems: 'center', gap: '24px',
                    }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '20px',
                                background: ACCENT, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '28px', fontWeight: '800',
                                overflow: 'hidden', flexShrink: 0,
                                border: '3px solid #ECE9FC',
                            }}>
                                {student.profilePicture ? (
                                    <img
                                        src={`${API_BASE}${student.profilePicture}`}
                                        alt={student.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : getInitials(student.name)}
                            </div>
                            <label style={{
                                position: 'absolute', bottom: '-4px', right: '-4px',
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: ACCENT, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: '2px solid #fff',
                            }}>
                                <Camera size={12} color="#fff" />
                                <input type="file" accept="image/*" hidden onChange={handleProfilePicUpload} />
                            </label>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F0A2A', margin: 0 }}>{student.name}</h2>
                                <span style={{
                                    background: '#f0eeff', color: ACCENT,
                                    padding: '4px 12px', borderRadius: '20px',
                                    fontSize: '12px', fontWeight: '700',
                                }}>{student.rollNo}</span>
                            </div>
                            <p style={{ color: '#8B8BA7', fontSize: '14px', margin: '0 0 12px 0' }}>
                                {student.department} Department · Section {student.section} · Year {student.year}
                            </p>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#8B8BA7', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CGPA</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F0A2A' }}>{Number(student.cgpa).toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#8B8BA7', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SGPA</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F0A2A' }}>{Number(student.sgpa || 0).toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#8B8BA7', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attendance</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: (student.attendance || 0) >= 75 ? '#10b981' : '#ef4444' }}>{student.attendance || 0}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#8B8BA7', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credits</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F0A2A' }}>{student.totalCredits || 0}/{student.totalCreditsRequired || 50}</div>
                                </div>
                            </div>
                        </div>

                        {student.profilePicture && (
                            <button
                                onClick={handleRemoveProfilePic}
                                style={{
                                    background: '#FEE2E2', border: 'none', borderRadius: '8px',
                                    padding: '6px 12px', cursor: 'pointer', color: '#ef4444',
                                    fontSize: '11px', fontWeight: '600',
                                }}
                            >Remove Photo</button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex', gap: '4px', marginBottom: '24px',
                        background: '#fff', borderRadius: '12px', padding: '4px',
                        border: '1px solid #ECECF4', width: 'fit-content',
                    }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 18px', borderRadius: '10px',
                                    border: 'none', cursor: 'pointer',
                                    fontSize: '13px', fontWeight: '600',
                                    background: activeTab === tab.key ? ACCENT : 'transparent',
                                    color: activeTab === tab.key ? '#fff' : '#8B8BA7',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
                    {activeTab === 'overview' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Personal Info */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={16} color={ACCENT} /> Personal Information
                                </h3>
                                {editing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { label: 'Email', key: 'email', type: 'email' },
                                            { label: 'Phone', key: 'phone' },
                                            { label: 'Date of Birth', key: 'dob', type: 'date' },
                                            { label: 'Gender', key: 'gender' },
                                            { label: 'Blood Group', key: 'bloodGroup' },
                                            { label: 'Address', key: 'address' },
                                            { label: 'Permanent Address', key: 'permanentAddress' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px', textTransform: 'uppercase' }}>{field.label}</label>
                                                <input
                                                    type={field.type || 'text'}
                                                    value={form[field.key] || ''}
                                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                                    style={inputStyle}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleSaveProfile}
                                            style={{
                                                padding: '10px', background: ACCENT, color: '#fff',
                                                border: 'none', borderRadius: '10px', fontSize: '14px',
                                                fontWeight: '600', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                marginTop: '8px',
                                            }}
                                        ><Save size={14} /> Save Changes</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {[
                                            { icon: <Mail size={14} color="#8B8BA7" />, label: 'Email', value: student.email },
                                            { icon: <Phone size={14} color="#8B8BA7" />, label: 'Phone', value: student.phone },
                                            { icon: <Calendar size={14} color="#8B8BA7" />, label: 'DOB', value: student.dob },
                                            { icon: <User size={14} color="#8B8BA7" />, label: 'Gender', value: student.gender },
                                            { icon: <Heart size={14} color="#8B8BA7" />, label: 'Blood Group', value: student.bloodGroup },
                                            { icon: <MapPin size={14} color="#8B8BA7" />, label: 'Address', value: student.address },
                                            { icon: <MapPin size={14} color="#8B8BA7" />, label: 'Permanent Address', value: student.permanentAddress },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {item.icon}
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#8B8BA7', fontWeight: '600' }}>{item.label}</div>
                                                    <div style={{ fontSize: '14px', color: '#0F0A2A', fontWeight: '500' }}>{item.value || '—'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Guardian Info */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={16} color={ACCENT} /> Guardian Details
                                </h3>
                                {editing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { label: "Father's Name", key: 'fatherName' },
                                            { label: "Father's Phone", key: 'fatherPhone' },
                                            { label: "Father's Email", key: 'fatherEmail', type: 'email' },
                                            { label: "Mother's Name", key: 'motherName' },
                                            { label: "Mother's Phone", key: 'motherPhone' },
                                            { label: "Mother's Email", key: 'motherEmail', type: 'email' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px', textTransform: 'uppercase' }}>{field.label}</label>
                                                <input
                                                    type={field.type || 'text'}
                                                    value={form[field.key] || ''}
                                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                                    style={inputStyle}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleSaveProfile}
                                            style={{
                                                padding: '10px', background: ACCENT, color: '#fff',
                                                border: 'none', borderRadius: '10px', fontSize: '14px',
                                                fontWeight: '600', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                marginTop: '8px',
                                            }}
                                        ><Save size={14} /> Save Changes</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        {/* Father */}
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Father</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F0A2A' }}>{student.fatherName || '—'}</div>
                                                <div style={{ fontSize: '13px', color: '#8B8BA7' }}>{student.fatherPhone || '—'} · {student.fatherEmail || '—'}</div>
                                            </div>
                                        </div>
                                        {/* Mother */}
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mother</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F0A2A' }}>{student.motherName || '—'}</div>
                                                <div style={{ fontSize: '13px', color: '#8B8BA7' }}>{student.motherPhone || '—'} · {student.motherEmail || '—'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── ACADEMICS TAB ────────────────────────────────────────────── */}
                    {activeTab === 'academics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Add Academic Record Form */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={16} color={ACCENT} /> Add Semester Record
                                </h3>
                                <form onSubmit={handleAddAcademic}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>SEMESTER</label>
                                            <input type="number" min="1" max="8" value={academicSem} onChange={e => setAcademicSem(e.target.value)} placeholder="1-8" required style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>SGPA</label>
                                            <input type="number" step="0.01" min="0" max="10" value={academicSgpa} onChange={e => setAcademicSgpa(e.target.value)} placeholder="8.5" required style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '12px', fontWeight: '700', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' }}>Subject Results</div>
                                    {academicResults.map((r, idx) => (
                                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                                            <input value={r.subject} onChange={e => { const arr = [...academicResults]; arr[idx].subject = e.target.value; setAcademicResults(arr); }} placeholder="Subject" style={inputStyle} />
                                            <input value={r.code} onChange={e => { const arr = [...academicResults]; arr[idx].code = e.target.value; setAcademicResults(arr); }} placeholder="Code" style={inputStyle} />
                                            <input type="number" value={r.credits} onChange={e => { const arr = [...academicResults]; arr[idx].credits = e.target.value; setAcademicResults(arr); }} placeholder="Cr" style={inputStyle} />
                                            <select value={r.grade} onChange={e => { const arr = [...academicResults]; arr[idx].grade = e.target.value; setAcademicResults(arr); }} style={inputStyle}>
                                                {['S', 'A', 'B', 'C', 'D', 'E', 'U'].map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                            <button type="button" onClick={() => setAcademicResults(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}><X size={14} /></button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setAcademicResults(prev => [...prev, { subject: '', code: '', credits: '', grade: 'S' }])}
                                        style={{ background: '#f0eeff', border: 'none', borderRadius: '8px', padding: '6px 14px', color: ACCENT, fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}
                                    >+ Add Subject</button>

                                    <button type="submit" style={{
                                        width: '100%', padding: '12px', background: ACCENT, color: '#fff',
                                        border: 'none', borderRadius: '10px', fontSize: '14px',
                                        fontWeight: '600', cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(108,92,231,0.2)',
                                    }}>Save Semester Record</button>
                                </form>
                            </div>

                            {/* Academic History */}
                            {(student.academicHistory || []).sort((a, b) => a.semester - b.semester).map((sem, idx) => (
                                <div key={idx} style={{
                                    background: '#fff', borderRadius: '16px',
                                    border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                    padding: '24px',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: 0 }}>
                                            Semester {sem.semester}
                                        </h3>
                                        <CgpaBadge value={sem.sgpa} />
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #ECECF4', color: '#8B8BA7', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Subject</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Code</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Credits</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(sem.results || []).map((r, ridx) => (
                                                <tr key={ridx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '10px 12px', color: '#0F0A2A', fontWeight: '500' }}>{r.subject}</td>
                                                    <td style={{ padding: '10px 12px', color: '#8B8BA7' }}>{r.code}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#4A4A68' }}>{r.credits}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                        <span style={{
                                                            background: `${gradeColor(r.grade)}15`, color: gradeColor(r.grade),
                                                            padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700',
                                                        }}>{r.grade}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}

                            {(student.academicHistory || []).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#8B8BA7' }}>
                                    <BookOpen size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
                                    <p style={{ fontSize: '14px', margin: 0 }}>No academic records found. Add a semester record above.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ATTENDANCE TAB ───────────────────────────────────────────── */}
                    {activeTab === 'attendance' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Add Attendance Form */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={16} color={ACCENT} /> Mark Attendance
                                </h3>
                                <form onSubmit={handleAddAttendance} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '12px', alignItems: 'end' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>DATE</label>
                                        <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>STATUS</label>
                                        <select value={attStatus} onChange={e => setAttStatus(e.target.value)} style={inputStyle}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>REMARKS</label>
                                        <input value={attRemarks} onChange={e => setAttRemarks(e.target.value)} placeholder="Optional remarks" style={inputStyle} />
                                    </div>
                                    <button type="submit" style={{
                                        padding: '10px 20px', background: ACCENT, color: '#fff',
                                        border: 'none', borderRadius: '10px', fontSize: '13px',
                                        fontWeight: '600', cursor: 'pointer', height: '42px',
                                    }}>Record</button>
                                </form>
                            </div>

                            {/* Attendance History */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 4px 0' }}>
                                    Attendance History
                                </h3>
                                <p style={{ fontSize: '12px', color: '#8B8BA7', margin: '0 0 16px 0' }}>
                                    Overall: <b style={{ color: '#0F0A2A' }}>{student.attendance || 0}%</b> · Total Records: <b style={{ color: '#0F0A2A' }}>{(student.attendanceHistory || []).length}</b>
                                </p>

                                {(student.attendanceHistory || []).length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #ECECF4', color: '#8B8BA7', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Date</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...(student.attendanceHistory || [])].reverse().map((entry, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '10px 12px', color: '#0F0A2A', fontWeight: '500' }}>{entry.date}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                        <span style={{
                                                            background: entry.status === 'Present' ? '#F0FDF4' : '#FEF2F2',
                                                            color: entry.status === 'Present' ? '#15803D' : '#B91C1C',
                                                            padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                            border: `1px solid ${entry.status === 'Present' ? '#BBF7D0' : '#FCA5A5'}`,
                                                        }}>{entry.status}</span>
                                                    </td>
                                                    <td style={{ padding: '10px 12px', color: '#8B8BA7' }}>{entry.remarks || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px', color: '#8B8BA7' }}>
                                        <Clock size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
                                        <p style={{ margin: 0, fontSize: '14px' }}>No attendance records yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── DOCUMENTS TAB ────────────────────────────────────────────── */}
                    {activeTab === 'documents' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Upload Document */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Upload size={16} color={ACCENT} /> Upload Document
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>DOCUMENT NAME</label>
                                        <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. Semester 1 Marksheet" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#8B8BA7', marginBottom: '4px' }}>TYPE</label>
                                        <select value={docType} onChange={e => setDocType(e.target.value)} style={inputStyle}>
                                            <option value="Marksheet">Marksheet</option>
                                            <option value="Certificate">Certificate</option>
                                            <option value="ID Proof">ID Proof</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <label style={{
                                        padding: '10px 20px', background: ACCENT, color: '#fff',
                                        border: 'none', borderRadius: '10px', fontSize: '13px',
                                        fontWeight: '600', cursor: 'pointer', height: '42px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    }}>
                                        <Upload size={14} /> Choose PDF
                                        <input type="file" accept="application/pdf" hidden onChange={handleDocUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Documents List */}
                            <div style={{
                                background: '#fff', borderRadius: '16px',
                                border: '1px solid #ECECF4', boxShadow: 'var(--card-shadow)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F0A2A', margin: '0 0 16px 0' }}>
                                    Uploaded Documents ({(student.documents || []).length})
                                </h3>

                                {(student.documents || []).length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {(student.documents || []).map((doc, i) => (
                                            <div key={doc._id || i} style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '14px 16px', borderRadius: '12px', border: '1px solid #ECECF4',
                                                background: '#FAFAFD',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '10px',
                                                        background: '#f0eeff', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <FileText size={18} color={ACCENT} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F0A2A' }}>{doc.name || doc.fileName}</div>
                                                        <div style={{ fontSize: '12px', color: '#8B8BA7' }}>
                                                            {doc.type} · {doc.fileSize || 'N/A'} · {doc.uploadedOn ? new Date(doc.uploadedOn).toLocaleDateString() : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <a
                                                        href={`${API_BASE}${doc.filePath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            padding: '6px 12px', background: '#f0eeff',
                                                            borderRadius: '8px', color: ACCENT, fontSize: '12px',
                                                            fontWeight: '600', textDecoration: 'none',
                                                            display: 'flex', alignItems: 'center', gap: '4px',
                                                        }}
                                                    >
                                                        <Download size={12} /> View
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteDoc(doc._id)}
                                                        style={{
                                                            padding: '6px 12px', background: '#FEE2E2',
                                                            borderRadius: '8px', color: '#ef4444', fontSize: '12px',
                                                            fontWeight: '600', border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: '4px',
                                                        }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px', color: '#8B8BA7' }}>
                                        <FileText size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
                                        <p style={{ margin: 0, fontSize: '14px' }}>No documents uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Toast Notifications */}
            <div style={{
                position: 'fixed', bottom: '24px', right: '24px',
                display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 100
            }}>
                {toasts.map(toast => {
                    let icon = <Info size={16} />;
                    let bg = '#F0F9FF';
                    let border = '#BEE3F8';
                    let color = '#2B6CB0';
                    if (toast.type === 'success') {
                        icon = <CheckCircle2 size={16} />;
                        bg = '#F0FDF4';
                        border = '#BBF7D0';
                        color = '#15803D';
                    } else if (toast.type === 'warning') {
                        icon = <AlertCircle size={16} />;
                        bg = '#FFFBEB';
                        border = '#FDE68A';
                        color = '#B45309';
                    } else if (toast.type === 'error') {
                        icon = <ShieldAlert size={16} />;
                        bg = '#FEF2F2';
                        border = '#FCA5A5';
                        color = '#B91C1C';
                    }
                    return (
                        <div
                            key={toast.id}
                            className="animate-slide-in-right"
                            style={{
                                background: bg, border: `1px solid ${border}`, color: color,
                                padding: '12px 18px', borderRadius: '10px', fontSize: '13px',
                                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minWidth: '220px'
                            }}
                        >
                            {icon}
                            <span>{toast.message}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
