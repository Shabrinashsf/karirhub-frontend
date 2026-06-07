export function formatSalary(min, max) {
  const fmt = (n) => {
    if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(0)} Jt`;
    return `Rp ${n.toLocaleString("id-ID")}`;
  };
  if (!min && !max) return "Gaji tidak disebutkan";
  if (min && !max) return `${fmt(min)} / bulan`;
  if (!min && max) return `s.d. ${fmt(max)} / bulan`;
  return `${fmt(min)} – ${fmt(max)} / bulan`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr) {
  const now = new Date("2025-06-01");
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "1 hari lalu";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  return `${Math.floor(diffDays / 30)} bulan lalu`;
}

export function jobTypeLabel(type) {
  const map = {
    full_time: "Full Time",
    part_time: "Part Time",
    contract: "Kontrak",
    internship: "Magang",
  };
  return map[type] || type;
}

export function workTypeLabel(type) {
  const map = {
    remote: "Remote",
    onsite: "Onsite",
    hybrid: "Hybrid",
  };
  return map[type] || type;
}

export function statusLabel(status) {
  const map = {
    in_progress: "Sedang Berlangsung",
    hired: "Diterima",
    rejected: "Ditolak",
    withdrawn: "Ditarik",
    draft: "Draft",
    active: "Aktif",
    closed: "Ditutup",
    expired: "Kedaluwarsa",
    pending: "Menunggu",
    passed: "Lolos",
    failed: "Tidak Lolos",
    scheduled: "Terjadwal",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    rescheduled: "Dijadwal Ulang",
  };
  return map[status] || status;
}

export function skillLevelLabel(level) {
  const map = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Mahir",
  };
  return map[level] || level;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
