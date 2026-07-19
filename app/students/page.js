"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search, Plus, Pencil, Trash2, X, GraduationCap, ChevronDown,
  LayoutDashboard, Users, ChevronRight, ChevronLeft, ArrowUpDown, Bell,
  FileSpreadsheet, LogOut, CheckSquare, Square, RefreshCw, AlertCircle, Info, CheckCircle2, ShieldAlert
} from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const SIDEBAR_BG = "#0F0A2A";
const SIDEBAR_W = "240px";
const ACCENT = "#6C5CE7";
const NAV_MUTED = "rgba(168,158,232,0.7)";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
const YEARS = ["1", "2", "3", "4"];
const SECTIONS = ["A", "B", "C", "D"];
const PAGE_SIZE = 8;

const AVATAR_COLORS = ["#6C5CE7", "#00B894", "#0984E3", "#E17055", "#D63031", "#0FB9B1", "#A55EEA", "#FD9644"];

const emptyForm = {
  name: "", rollNo: "", department: DEPARTMENTS[0],
  section: SECTIONS[0], year: YEARS[0], cgpa: "",
  email: "", phone: "", dob: "", gender: "Male",
  bloodGroup: "O+", address: "", permanentAddress: "",
  fatherName: "", fatherPhone: "", fatherEmail: "",
  motherName: "", motherPhone: "", motherEmail: ""
};

const MOCK_STUDENTS = [
  { _id: "m1", name: "Floyd Miles", rollNo: "21CSE021", department: "CSE", section: "A", year: 3, cgpa: 8.6, attendance: 92, email: "floyd.miles@srec.edu", phone: "9876543210" },
  { _id: "m2", name: "Jane Cooper", rollNo: "21ECE011", department: "ECE", section: "B", year: 2, cgpa: 7.9, attendance: 84, email: "jane.cooper@srec.edu", phone: "9876543211" },
  { _id: "m3", name: "Jenny Wilson", rollNo: "21EEE031", department: "EEE", section: "A", year: 3, cgpa: 9.1, attendance: 95, email: "jenny.wilson@srec.edu", phone: "9876543212" },
  { _id: "m4", name: "Annette Black", rollNo: "21IT022", department: "IT", section: "C", year: 4, cgpa: 8.2, attendance: 78, email: "annette.black@srec.edu", phone: "9876543213" },
  { _id: "m5", name: "Arlene McCoy", rollNo: "21MECH013", department: "MECH", section: "A", year: 4, cgpa: 7.5, attendance: 88, email: "arlene.mccoy@srec.edu", phone: "9876543214" },
  { _id: "m6", name: "Robert Fox", rollNo: "21CIVIL014", department: "CIVIL", section: "D", year: 1, cgpa: 8.0, attendance: 72, email: "robert.fox@srec.edu", phone: "9876543215" },
  { _id: "m7", name: "Devon Lane", rollNo: "21CSE019", department: "CSE", section: "B", year: 2, cgpa: 8.8, attendance: 90, email: "devon.lane@srec.edu", phone: "9876543216" },
  { _id: "m8", name: "Albert Flores", rollNo: "21ECE017", department: "ECE", section: "C", year: 3, cgpa: 6.9, attendance: 81, email: "albert.flores@srec.edu", phone: "9876543217" },
  { _id: "m9", name: "Esther Howard", rollNo: "21EEE004", department: "EEE", section: "B", year: 1, cgpa: 9.3, attendance: 96, email: "esther.howard@srec.edu", phone: "9876543218" },
];

function initials(name) {
  return (name || "").trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function colorFor(id) {
  let h = 0;
  for (let i = 0; i < (id || "").length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ── CGPA display ──────────────────────────────────────────────────────────────
function CgpaBadge({ value }) {
  return (
    <span style={{
      fontSize: "14px", fontWeight: "700", color: "#1E1B4B",
    }}>{Number(value).toFixed(1)}</span>
  );
}

// ── Attendance progress bar ──────────────────────────────────────────────────────
function AttendanceBadge({ value }) {
  const v = parseInt(value) || 0;
  const color = v >= 75 ? "#10b981" : "#f59e0b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: "60px", height: "8px", borderRadius: "10px",
        background: "#E5E7EB", overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{
          width: `${Math.min(v, 100)}%`, height: "100%",
          borderRadius: "10px", background: color,
          transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{
        fontSize: "13px", fontWeight: "600", color: color,
        minWidth: "32px",
      }}>{v}%</span>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ active }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  return (
    <div style={{
      width: SIDEBAR_W, background: SIDEBAR_BG,
      display: "flex", flexDirection: "column",
      position: "fixed", height: "100vh", zIndex: 10,
      borderRight: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        gap: "10px", padding: "24px 20px", marginBottom: "12px",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: ACCENT, display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(108,92,231,0.4)",
        }}>
          <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: "700", fontSize: "16px", lineHeight: 1.2 }}>SREC</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "0.5px" }}>Student Portal</div>
        </div>
      </div>

      <nav aria-label="Main navigation" style={{ padding: "0 12px", flex: 1 }}>
        <p style={{
          color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: "600",
          letterSpacing: "1.2px", padding: "0 8px",
          marginBottom: "8px", textTransform: "uppercase",
        }}>MAIN</p>

        <button
          type="button"
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 14px", borderRadius: "10px",
            cursor: "pointer", marginBottom: "4px",
            fontSize: "14px", fontWeight: "500",
            border: "none", width: "100%", textAlign: "left",
            transition: "all 0.2s",
            background: active === "overview" ? ACCENT : "transparent",
            color: active === "overview" ? "#fff" : NAV_MUTED,
          }}
          onClick={() => router.push("/dashboard")}
        >
          <LayoutDashboard size={16} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 14px", borderRadius: "10px",
            cursor: "pointer", marginBottom: "4px",
            fontSize: "14px", fontWeight: "500",
            border: "none", width: "100%", textAlign: "left",
            transition: "all 0.2s",
            background: active === "students" ? ACCENT : "transparent",
            color: active === "students" ? "#fff" : NAV_MUTED,
          }}
          onClick={() => router.push("/students")}
        >
          <Users size={16} />
          <span>Students</span>
          {active === "students" && (
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#10b981", marginLeft: "auto",
            }} />
          )}
        </button>
      </nav>

      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "#10b981", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "12px", fontWeight: "700",
          }}>N</div>
          <div>
            <div style={{ color: "#fff", fontSize: "12px", fontWeight: "600" }}>Admin</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>admin@srec.edu</div>
          </div>
        </div>
        <button type="button" aria-label="Logout" onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <LogOut
            size={16} color="rgba(255,255,255,0.4)"
            style={{ transition: 'color 0.2s' }}
          />
        </button>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  // Search and filters
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");

  // Selection and bulk actions
  const [selected, setSelected] = useState([]);

  // Modal configurations
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Notifications Toast State
  const [toasts, setToasts] = useState([]);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { setPage(1); }, [query, deptFilter, yearFilter, sectionFilter]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/students");
      if (!res.ok) throw new Error("Connection failed");
      const data = await res.json();
      setStudents(data);
      setUsedFallback(false);
    } catch (err) {
      console.warn("Backend unreachable. Initializing app with local mock records.");
      setStudents(MOCK_STUDENTS);
      setUsedFallback(true);
      showToast("Running in local mock mode.", "warning");
    } finally {
      setLoading(false);
    }
  }

  // ── Column Sorting ───────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ── Instant search and filter calculation ────────────────────────────────────
  const filtered = students.filter(s => {
    const q = query.trim().toLowerCase();
    const matchesSearch = !q ||
      (s.name || "").toLowerCase().includes(q) ||
      (s.rollNo || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q) ||
      (s.phone || "").toLowerCase().includes(q) ||
      (s.department || "").toLowerCase().includes(q) ||
      (s.cgpa || "").toString().includes(q);

    const matchesDept = deptFilter === "All" || s.department === deptFilter;
    const matchesYear = yearFilter === "All" || String(s.year) === yearFilter;
    const matchesSection = sectionFilter === "All" || s.section === sectionFilter;

    return matchesSearch && matchesDept && matchesYear && matchesSection;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] ?? "";
    let bVal = b[sortField] ?? "";

    if (typeof aVal === "string") {
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    } else {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = sorted.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  // ── Selection helpers ────────────────────────────────────────────────────────
  const toggleSelectAll = () => {
    if (selected.length === pageItems.length) {
      setSelected([]);
    } else {
      setSelected(pageItems.map(s => s._id));
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // ── CRUD Logic ───────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s._id);
    setForm({
      name: s.name || "",
      rollNo: s.rollNo || "",
      department: s.department || DEPARTMENTS[0],
      section: s.section || SECTIONS[0],
      year: String(s.year || 1),
      cgpa: String(s.cgpa || ""),
      email: s.email || "",
      phone: s.phone || "",
      dob: s.dob || "",
      gender: s.gender || "Male",
      bloodGroup: s.bloodGroup || "O+",
      address: s.address || "",
      permanentAddress: s.permanentAddress || "",
      fatherName: s.fatherName || "",
      fatherPhone: s.fatherPhone || "",
      fatherEmail: s.fatherEmail || "",
      motherName: s.motherName || "",
      motherPhone: s.motherPhone || "",
      motherEmail: s.motherEmail || ""
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full Name is required";
    if (!form.rollNo.trim()) errors.rollNo = "Roll Number is required";

    // Check duplicates
    const isDuplicate = students.some(s =>
      s.rollNo.trim().toLowerCase() === form.rollNo.trim().toLowerCase() && s._id !== editingId
    );
    if (isDuplicate) {
      errors.rollNo = "A student with this Roll Number already exists.";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      errors.phone = "Phone must be a 10-digit number";
    }
    if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10)) {
      errors.cgpa = "CGPA must be between 0 and 10";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      year: Number(form.year),
      cgpa: parseFloat(form.cgpa) || 0,
      attendance: Number(form.attendance) || 85 // default attendance percentage
    };

    if (usedFallback) {
      if (editingId) {
        setStudents(prev => prev.map(s => s._id === editingId ? { ...s, ...payload, _id: editingId } : s));
        showToast("Student updated locally", "success");
      } else {
        const newStudent = { ...payload, _id: "local_" + Date.now() };
        setStudents(prev => [...prev, newStudent]);
        showToast("New student created locally", "success");
      }
      closeModal();
      return;
    }

    try {
      const url = editingId ? `http://localhost:5000/api/students/${editingId}` : "http://localhost:5000/api/students";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.message || "Failed to save student record", "error");
        return;
      }
      await fetchStudents();
      showToast(editingId ? "Student records updated" : "New student registered successfully", "success");
      closeModal();
    } catch (err) {
      showToast("Unable to communicate with server", "error");
    }
  };

  const deleteStudent = async (id) => {
    if (usedFallback) {
      setStudents(prev => prev.filter(s => s._id !== id));
      setSelected(prev => prev.filter(sid => sid !== id));
      setConfirmDeleteId(null);
      showToast("Student deleted locally", "success");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchStudents();
      setSelected(prev => prev.filter(sid => sid !== id));
      setConfirmDeleteId(null);
      showToast("Student entry removed", "success");
    } catch (err) {
      showToast("Failed to delete student", "error");
    }
  };

  // ── Bulk Actions ─────────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    if (usedFallback) {
      setStudents(prev => prev.filter(s => !selected.includes(s._id)));
      setSelected([]);
      setBulkConfirmOpen(false);
      showToast("Selected students deleted locally", "success");
      return;
    }

    try {
      // Sequentially delete from the server to guarantee consistency
      await Promise.all(selected.map(id =>
        fetch(`http://localhost:5000/api/students/${id}`, { method: "DELETE" })
      ));
      await fetchStudents();
      setSelected([]);
      setBulkConfirmOpen(false);
      showToast("Selected student records deleted successfully", "success");
    } catch (e) {
      showToast("Error occurred during bulk delete", "error");
    }
  };

  const handleBulkExport = () => {
    if (students.length === 0) return;
    // Export selected, or all if none selected
    const itemsToExport = selected.length > 0
      ? students.filter(s => selected.includes(s._id))
      : sorted;

    const headers = ["Roll No", "Name", "Department", "Section", "Year", "CGPA", "Attendance", "Email", "Phone"];
    const rows = itemsToExport.map(s => [
      s.rollNo,
      s.name,
      s.department,
      s.section,
      s.year,
      s.cgpa,
      `${s.attendance}%`,
      s.email || "N/A",
      s.phone || "N/A"
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SREC_Students_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${itemsToExport.length} student records`, "success");
  };

  // ── Pagination helpers ───────────────────────────────────────────────────────
  const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === totalPages || Math.abs(n - pageSafe) <= 1)
    .reduce((acc, n, i, arr) => {
      if (i > 0 && n - arr[i - 1] > 1) acc.push("ellipsis");
      acc.push(n); return acc;
    }, []);

  const inputStyle = (error) => ({
    width: "100%", padding: "10px 14px",
    border: `1.5px solid ${error ? "#ef4444" : "#ECECF4"}`,
    borderRadius: "10px",
    fontSize: "14px", color: "#1E1B4B", outline: "none",
    background: "#FAFAFD", boxSizing: "border-box",
    transition: "all 0.15s ease",
  });

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh", background: "#F8F9FD", display: "flex",
    }}>
      <Sidebar active="students" />

      {/* Main Container */}
      <main role="main" style={{ marginLeft: SIDEBAR_W, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top Header Bar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #ECECF4",
          padding: "16px 32px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 5,
        }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0F0A2A", margin: 0 }}>
              Student Management
            </h1>
            <p style={{ color: "#6E6E8D", fontSize: "13px", margin: "2px 0 0 0" }}>
              Manage all enrolled students
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={fetchStudents}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "#6E6E8D",
                display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500"
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              type="button"
              aria-label="Notifications"
              style={{
              width: "38px", height: "38px", borderRadius: "50%",
              border: "1.5px solid #ECECF4",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", background: "#fff", position: "relative",
            }}>
              <Bell size={17} color="#6E6E8D" />
              <span role="status" aria-label="New notifications" style={{
                position: "absolute", top: "6px", right: "6px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#ef4444", border: "1.5px solid #fff",
              }} />
            </button>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: ACCENT, display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "14px", fontWeight: "700",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(108,92,231,0.3)",
            }}>N</div>
          </div>
        </div>

        {/* Page Body */}
        <div style={{ padding: "28px 32px", flex: 1 }} className="animate-fade-in">

          {/* Breadcrumb + Primary buttons row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "20px", flexWrap: "wrap", gap: "12px"
          }}>
            <p style={{ fontSize: "13px", color: "#6E6E8D", margin: 0 }}>
              <span>Home</span>
              <span style={{ margin: "0 6px" }}>›</span>
              <span style={{ color: ACCENT, fontWeight: "500" }}>Students</span>
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={openAddModal}
                className="btn-add"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: ACCENT, color: "#fff",
                  border: "none", borderRadius: "10px",
                  padding: "10px 18px", fontSize: "14px", fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(108,92,231,0.25)",
                  transition: "all 0.2s",
                }}
              >
                <Plus size={16} strokeWidth={2.5} /> Add Student
              </button>
            </div>
          </div>

          {/* Active Bulk Actions Bar */}
          {selected.length > 0 && (
            <div style={{
              background: "#F5F3FF", border: "1px solid #DDD6FE",
              borderRadius: "12px", padding: "12px 20px", marginBottom: "16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              animation: "fadeIn 0.2s ease"
            }}>
              <span style={{ fontSize: "14px", color: "#6D28D9", fontWeight: "600" }}>
                {selected.length} student{selected.length > 1 ? "s" : ""} selected
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleBulkExport}
                  style={{
                    background: "#fff", border: "1px solid #DDD6FE", color: "#6D28D9",
                    padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <FileSpreadsheet size={14} /> Export Selected
                </button>
                <button
                  onClick={() => setBulkConfirmOpen(true)}
                  style={{
                    background: "#EF4444", border: "none", color: "#fff",
                    padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <Trash2 size={14} /> Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Main Registry Card */}
          <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1px solid #ECECF4",
            boxShadow: "var(--card-shadow)",
            overflow: "hidden"
          }}>

            {/* Filter and Search Bar Section */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid #ECECF4",
              flexWrap: "wrap", gap: "16px",
            }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0F0A2A", margin: 0 }}>
                  Students Information
                </h2>
                <p style={{ fontSize: "12px", color: "#6E6E8D", margin: "2px 0 0 0" }}>
                  Total: {filtered.length} students
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                {/* Search */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#F7F7FB", border: "1px solid #ECECF4",
                  borderRadius: "10px", padding: "8px 14px", minWidth: "220px",
                }}>
                  <Search size={14} color="#8B8BA7" style={{ flexShrink: 0 }} />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name or roll no."
                    autoComplete="off"
                    style={{
                      background: "transparent", outline: "none", border: "none",
                      fontSize: "13px", color: "#1E1B4B", width: "100%",
                    }}
                  />
                  {query && <X size={13} color="#8B8BA7" style={{ cursor: "pointer" }} onClick={() => setQuery("")} />}
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {/* Dept Filter */}
                  <div style={{ position: "relative" }}>
                    <select
                      aria-label="Filter by department"
                      value={deptFilter}
                      onChange={e => setDeptFilter(e.target.value)}
                      style={{
                        appearance: "none", background: "#F7F7FB",
                        border: "1px solid #ECECF4", borderRadius: "10px",
                        padding: "8px 32px 8px 14px", fontSize: "13px", color: "#4A4A68",
                        outline: "none", cursor: "pointer"
                      }}
                    >
                      <option value="All">Department: All</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={12} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#8B8BA7", pointerEvents: "none" }} />
                  </div>

                  {/* Year Filter */}
                  <div style={{ position: "relative" }}>
                    <select
                      aria-label="Filter by year"
                      value={yearFilter}
                      onChange={e => setYearFilter(e.target.value)}
                      style={{
                        appearance: "none", background: "#F7F7FB",
                        border: "1px solid #ECECF4", borderRadius: "10px",
                        padding: "8px 32px 8px 14px", fontSize: "13px", color: "#4A4A68",
                        outline: "none", cursor: "pointer"
                      }}
                    >
                      <option value="All">Year: All</option>
                      {YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
                    </select>
                    <ChevronDown size={12} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#8B8BA7", pointerEvents: "none" }} />
                  </div>


                </div>

              </div>
            </div>

            {/* Registry Table Panel */}
            <div style={{ overflowX: "auto", position: "relative" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{
                    background: "#F8F9FD", borderBottom: "1px solid #ECECF4",
                    color: "#6E6E8D", fontSize: "11px", fontWeight: "600", textTransform: "uppercase",
                    letterSpacing: "0.8px", position: "sticky", top: 0, zIndex: 1,
                  }}>
                    <th style={{ padding: "14px 20px", width: "40px", textAlign: "left" }}>
                      <button
                        aria-label="Select all students"
                        onClick={toggleSelectAll}
                        style={{ background: "none", border: "none", cursor: "pointer", color: ACCENT, padding: 0 }}
                      >
                        {selected.length === pageItems.length && pageItems.length > 0
                          ? <CheckSquare size={16} />
                          : <Square size={16} />
                        }
                      </button>
                    </th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>
                      <button
                        onClick={() => handleSort("name")}
                        style={{
                          background: "none", border: "none", color: "#6E6E8D",
                          fontSize: "11px", fontWeight: "600", cursor: "pointer",
                          textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        Student <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>
                      <button
                        onClick={() => handleSort("rollNo")}
                        style={{
                          background: "none", border: "none", color: "#6E6E8D",
                          fontSize: "11px", fontWeight: "600", cursor: "pointer",
                          textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        Roll No <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>Department</th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>Section</th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>Year</th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>
                      <button
                        onClick={() => handleSort("cgpa")}
                        style={{
                          background: "none", border: "none", color: "#6E6E8D",
                          fontSize: "11px", fontWeight: "600", cursor: "pointer",
                          textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        CGPA <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th style={{ padding: "14px 12px", textAlign: "left" }}>
                      <button
                        onClick={() => handleSort("attendance")}
                        style={{
                          background: "none", border: "none", color: "#6E6E8D",
                          fontSize: "11px", fontWeight: "600", cursor: "pointer",
                          textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px"
                        }}
                      >
                        Attendance <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "#8B8BA7" }}>
                        <div style={{ display: "inline-block", width: "24px", height: "24px", borderRadius: "50%", border: `2.5px solid ${ACCENT}`, borderTopColor: "transparent" }} className="animate-spin" />
                        <p style={{ marginTop: "12px", fontSize: "14px" }}>Loading registry...</p>
                      </td>
                    </tr>
                  )}
                  {!loading && pageItems.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "#8B8BA7" }}>
                        <Info size={24} style={{ marginBottom: "8px", opacity: 0.6 }} />
                        <p style={{ margin: 0, fontSize: "14px" }}>No students match the current filters.</p>
                      </td>
                    </tr>
                  )}
                  {!loading && pageItems.map((s, idx) => {
                    const isRowSelected = selected.includes(s._id);
                    return (
                      <tr
                        key={`row-${s._id}`}
                        className={`hover-row ${isRowSelected ? "selected" : ""}`}
                        style={{
                          borderBottom: "1px solid #ECECF4",
                          background: isRowSelected ? "#F3F0FF" : "transparent",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: "14px 20px" }}>
                          <button
                            aria-label={`Select ${s.name}`}
                            onClick={() => toggleSelect(s._id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: isRowSelected ? ACCENT : "#6E6E8D", padding: 0 }}
                          >
                            {isRowSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        </td>

                        {/* Name / Avatar */}
                        <td style={{ padding: "14px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              background: colorFor(s._id),
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: "12px", fontWeight: "700", flexShrink: 0,
                              overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)"
                            }}>
                              {s.profilePicture ? (
                                <img
                                  src={s.profilePicture.startsWith('http') ? s.profilePicture : `http://localhost:5000${s.profilePicture.startsWith('/') ? '' : '/'}${s.profilePicture}`}
                                  alt=""
                                  width={36}
                                  height={36}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : initials(s.name)}
                            </div>
                            <div>
                              <span
                                onClick={() => router.push(`/students/${s._id}`)}
                                className="student-name"
                                style={{
                                  color: "#0F0A2A", fontWeight: "600",
                                  cursor: "pointer", display: "block",
                                  transition: "color 0.15s ease",
                                }}
                              >{s.name}</span>
                            </div>
                          </div>
                        </td>

                        {/* Roll Number */}
                        <td style={{ padding: "14px 12px" }}>
                          <span style={{ color: "#4A4A68", fontWeight: "500", fontSize: "14px" }}>{s.rollNo}</span>
                        </td>

                        {/* Dept / Sec / Year */}
                        <td style={{ padding: "14px 12px", color: "#4A4A68", fontWeight: "500" }}>{s.department}</td>
                        <td style={{ padding: "14px 12px", color: "#4A4A68" }}>{s.section}</td>
                        <td style={{ padding: "14px 12px", color: "#4A4A68" }}>{s.year}</td>

                        {/* Performance metrics */}
                        <td style={{ padding: "14px 12px" }}>
                          <CgpaBadge value={s.cgpa} />
                        </td>
                        <td style={{ padding: "14px 12px" }}>
                          <AttendanceBadge value={s.attendance || 85} />
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                            <button
                              type="button"
                              aria-label={`Edit ${s.name}`}
                              onClick={() => openEditModal(s)}
                              title="Edit Details"
                              className="btn-edit"
                              style={{
                                padding: "8px", borderRadius: "8px", border: "none",
                                background: "transparent", color: ACCENT,
                                cursor: "pointer", display: "flex", alignItems: "center",
                                transition: "background 0.15s",
                              }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${s.name}`}
                              onClick={() => setConfirmDeleteId(s._id)}
                              title="Delete Entry"
                              className="btn-delete"
                              style={{
                                padding: "8px", borderRadius: "8px", border: "none",
                                background: "#FEE2E2", color: "#EF4444",
                                cursor: "pointer", display: "flex", alignItems: "center",
                                transition: "background 0.15s",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!loading && sorted.length > 0 && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px", borderTop: "1px solid #ECECF4", flexWrap: "wrap", gap: "12px",
              }}>
                <p style={{ fontSize: "13px", color: "#6E6E8D", margin: 0 }}>
                  Showing {(pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, sorted.length)} of {sorted.length} entries
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pageSafe === 1}
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      border: "1px solid #ECECF4", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#6E6E8D", background: "#fff",
                      cursor: pageSafe === 1 ? "not-allowed" : "pointer",
                      opacity: pageSafe === 1 ? 0.4 : 1,
                    }}
                  ><ChevronLeft size={14} /></button>

                  {paginationItems.map((n, idx) =>
                    n === "ellipsis" ? (
                      <span key={`e-${idx}`} style={{ width: "32px", textAlign: "center", color: "#6E6E8D" }}>···</span>
                    ) : (
                      <button
                        key={`p-${n}`} type="button"
                        onClick={() => setPage(n)}
                        style={{
                          width: "32px", height: "32px", borderRadius: "8px",
                          border: n === pageSafe ? "none" : "1px solid #ECECF4",
                          background: n === pageSafe ? ACCENT : "#fff",
                          color: n === pageSafe ? "#fff" : "#4A4A68",
                          fontSize: "13px", fontWeight: "600", cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >{n}</button>
                    )
                  )}

                  <button
                    type="button"
                    aria-label="Next page"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={pageSafe === totalPages}
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      border: "1px solid #ECECF4", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#6E6E8D", background: "#fff",
                      cursor: pageSafe === totalPages ? "not-allowed" : "pointer",
                      opacity: pageSafe === totalPages ? 0.4 : 1,
                    }}
                  ><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add / Edit Student Entry Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,10,42,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px",
            width: "100%", maxWidth: "600px",
            maxHeight: "90vh", overflowY: "auto",
            padding: "32px", boxShadow: "0 20px 50px -12px rgba(15,10,42,0.15)",
            animation: "fadeIn 0.25s ease-out"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F0A2A", margin: 0 }}>
                {editingId ? "Modify Student Profile" : "Register New Student"}
              </h3>
              <button
                type="button" onClick={closeModal}
                aria-label="Close modal"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6E6E8D", padding: "4px" }}
              ><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Personal Section */}
              <div>
                <h4 style={{ fontSize: "12px", fontWeight: "700", color: ACCENT, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 0" }}>Academic Identity</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label htmlFor="form-name" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Full Name *</label>
                    <input id="form-name" name="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jenny Wilson" style={inputStyle(formErrors.name)} />
                    {formErrors.name && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.name}</span>}
                  </div>
                  <div>
                    <label htmlFor="form-rollNo" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Roll Number *</label>
                    <input id="form-rollNo" name="rollNo" required value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} placeholder="e.g. 21CSE021" style={inputStyle(formErrors.rollNo)} />
                    {formErrors.rollNo && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.rollNo}</span>}
                  </div>
                </div>
              </div>

              {/* Class parameters */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label htmlFor="form-dept" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Dept</label>
                  <select id="form-dept" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={inputStyle()}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-section" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Section</label>
                  <select id="form-section" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} style={inputStyle()}>
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-year" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Year</label>
                  <select id="form-year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={inputStyle()}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-cgpa" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>CGPA</label>
                  <input id="form-cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })} placeholder="8.5" style={inputStyle(formErrors.cgpa)} />
                  {formErrors.cgpa && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.cgpa}</span>}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 style={{ fontSize: "12px", fontWeight: "700", color: ACCENT, textTransform: "uppercase", letterSpacing: "1px", margin: "16px 0 12px 0" }}>Contact Credentials</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label htmlFor="form-email" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Email Address</label>
                    <input id="form-email" name="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@srec.edu" style={inputStyle(formErrors.email)} />
                    {formErrors.email && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.email}</span>}
                  </div>
                  <div>
                    <label htmlFor="form-phone" style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4A4A68", marginBottom: "6px" }}>Mobile Number</label>
                    <input id="form-phone" name="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" style={inputStyle(formErrors.phone)} />
                    {formErrors.phone && <span style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", display: "block" }}>{formErrors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "12px", paddingTop: "12px", borderTop: "1px solid #ECECF4", marginTop: "8px" }}>
                <button
                  type="button" onClick={closeModal}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "10px",
                    border: "1px solid #ECECF4", background: "#fff",
                    color: "#4A4A68", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                  }}
                >Cancel</button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: "12px", borderRadius: "10px",
                    background: ACCENT, color: "#fff",
                    border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                    boxShadow: "0 4px 12px rgba(108,92,231,0.2)",
                  }}
                >{editingId ? "Save Profile Details" : "Register Student"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,10,42,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px",
            width: "100%", maxWidth: "380px",
            padding: "28px", boxShadow: "0 20px 50px -12px rgba(15,10,42,0.15)", textAlign: "center",
            animation: "fadeIn 0.2s ease"
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "#FEE2E2", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 16px",
            }}>
              <Trash2 size={24} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F0A2A", margin: "0 0 6px 0" }}>Remove Student Entry?</h3>
            <p style={{ fontSize: "13px", color: "#8B8BA7", margin: "0 0 24px 0", lineHeight: "1.4" }}>
              Are you sure you want to delete this student? All documents and analytics will be permanently destroyed.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button" onClick={() => setConfirmDeleteId(null)}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  border: "1px solid #ECECF4", background: "#fff",
                  color: "#4A4A68", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                }}
              >Cancel</button>
              <button
                type="button" onClick={() => deleteStudent(confirmDeleteId)}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  background: "#EF4444", color: "#fff",
                  border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkConfirmOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,10,42,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px",
            width: "100%", maxWidth: "380px",
            padding: "28px", boxShadow: "0 20px 50px -12px rgba(15,10,42,0.15)", textAlign: "center",
            animation: "fadeIn 0.2s ease"
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "#FEE2E2", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 16px",
            }}>
              <ShieldAlert size={24} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F0A2A", margin: "0 0 6px 0" }}>Delete {selected.length} entries?</h3>
            <p style={{ fontSize: "13px", color: "#8B8BA7", margin: "0 0 24px 0", lineHeight: "1.4" }}>
              This will remove all selected students. This bulk action is destructive and cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button" onClick={() => setBulkConfirmOpen(false)}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  border: "1px solid #ECECF4", background: "#fff",
                  color: "#4A4A68", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                }}
              >Cancel</button>
              <button
                type="button" onClick={handleBulkDelete}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  background: "#EF4444", color: "#fff",
                  border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px",
                }}
              >Yes, Delete All</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notifications Toast Portal */}
      <div style={{
        position: "fixed", bottom: "24px", right: "24px",
        display: "flex", flexDirection: "column", gap: "8px", zIndex: 100
      }}>
        {toasts.map(toast => {
          let icon = <Info size={16} />;
          let bg = "#F0F9FF";
          let border = "#BEE3F8";
          let color = "#2B6CB0";
          if (toast.type === "success") {
            icon = <CheckCircle2 size={16} />;
            bg = "#F0FDF4";
            border = "#BBF7D0";
            color = "#15803D";
          } else if (toast.type === "warning") {
            icon = <AlertCircle size={16} />;
            bg = "#FFFBEB";
            border = "#FDE68A";
            color = "#B45309";
          } else if (toast.type === "error") {
            icon = <ShieldAlert size={16} />;
            bg = "#FEF2F2";
            border = "#FCA5A5";
            color = "#B91C1C";
          }
          return (
            <div
              key={toast.id}
              className="animate-slide-in-right"
              style={{
                background: bg, border: `1px solid ${border}`, color: color,
                padding: "12px 18px", borderRadius: "10px", fontSize: "13px",
                fontWeight: "600", display: "flex", alignItems: "center", gap: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)", minWidth: "220px"
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