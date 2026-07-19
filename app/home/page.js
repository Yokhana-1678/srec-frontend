'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Search } from 'lucide-react';

export default function HomePage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch('http://localhost:5000/api/students')
            .then(res => res.json())
            .then(data => setAllStudents(data))
            .catch(err => console.error(err));
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (!val.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        const filtered = allStudents.filter(s =>
            s.name.toLowerCase().includes(val.toLowerCase()) ||
            s.rollNo.toLowerCase().includes(val.toLowerCase())
        );
        setResults(filtered);
        setSearched(true);
    };

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #eef0fb 0%, #e8e6f8 50%, #ede8fb 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* Background circles */}
            <div style={{
                position: 'absolute', width: '500px', height: '500px',
                borderRadius: '50%', background: 'rgba(108,92,231,0.08)',
                bottom: '-150px', left: '-150px', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', width: '300px', height: '300px',
                borderRadius: '50%', background: 'rgba(108,92,231,0.06)',
                top: '-80px', right: '-80px', pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div style={{
                width: '80px', height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #7c6ee6 0%, #6C5CE7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 8px 32px rgba(108,92,231,0.35)',
            }}>
                <GraduationCap size={38} color="#ffffff" strokeWidth={2} />
            </div>

            {/* Title */}
            <h1 style={{
                fontSize: '36px', fontWeight: '800',
                color: '#1a1040', margin: '0 0 6px 0',
                letterSpacing: '2px',
            }}>
                SREC
            </h1>

            {/* Subtitle */}
            <p style={{
                fontSize: '13px', fontWeight: '600',
                color: '#6C5CE7', margin: '0 0 40px 0',
                letterSpacing: '3px', textTransform: 'uppercase',
            }}>
                Student Dashboard
            </p>

            {/* Search Box */}
            <div style={{
                width: '100%', maxWidth: '500px',
                position: 'relative', marginBottom: '12px',
            }}>
                <Search size={18} color="#9ca3af" style={{
                    position: 'absolute', left: '18px', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none'
                }} />
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search by student name or roll no..."
                    autoComplete="off"
                    suppressHydrationWarning
                    style={{
                        width: '100%',
                        padding: '16px 20px 16px 52px',
                        borderRadius: '50px',
                        border: '1.5px solid rgba(108,92,231,0.2)',
                        fontSize: '14px', color: '#1a1040',
                        background: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box',
                        boxShadow: '0 4px 20px rgba(108,92,231,0.1)',
                    }}
                />
            </div>

            {/* Search Results */}
            {searched && (
                <div style={{
                    width: '100%', maxWidth: '500px',
                    marginBottom: '12px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid rgba(108,92,231,0.15)',
                    boxShadow: '0 8px 24px rgba(108,92,231,0.12)',
                    overflow: 'hidden',
                }}>
                    {results.length === 0 ? (
                        <p style={{
                            textAlign: 'center', color: '#9ca3af',
                            padding: '24px', fontSize: '14px', margin: 0
                        }}>
                            No student found
                        </p>
                    ) : (
                        results.map((s, index) => (
                            <div 
                                key={index} 
                                onClick={() => router.push(`/students/${s._id}`)}
                                style={{
                                    padding: '14px 20px',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F8F9FD'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: '6px'
                                }}>
                                    <span style={{
                                        fontWeight: '700', color: '#6C5CE7', fontSize: '15px'
                                    }}>{s.name}</span>
                                    <span style={{
                                        color: '#6C5CE7', fontSize: '12px',
                                        background: '#f0eeff', padding: '2px 10px',
                                        borderRadius: '20px', fontWeight: '600'
                                    }}>{s.rollNo}</span>
                                </div>
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: '4px', fontSize: '13px', color: '#6b7280'
                                }}>
                                    <span>Dept: <b style={{ color: '#1a1040' }}>{s.department}</b></span>
                                    <span>Section: <b style={{ color: '#1a1040' }}>{s.section}</b></span>
                                    <span>Year: <b style={{ color: '#1a1040' }}>{s.year}</b></span>
                                    <span>CGPA: <b style={{ color: '#1a1040' }}>{s.cgpa}</b></span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Go to Dashboard Button */}
            <button
                type="button"
                suppressHydrationWarning
                onClick={() => router.push('/students')}
                style={{
                    marginTop: '12px',
                    padding: '14px 40px',
                    background: 'linear-gradient(135deg, #7c6ee6 0%, #6C5CE7 100%)',
                    color: '#ffffff', border: 'none',
                    borderRadius: '50px', fontSize: '15px',
                    fontWeight: '600', cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(108,92,231,0.4)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                }}
            >
                Go to Dashboard →
            </button>

        </main>
    );
}