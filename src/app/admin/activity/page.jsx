import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Activity, Filter } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const activityLog = [
  {
    id: 1,
    type: "registration",
    icon: "👤",
    description: "Budi Santoso mendaftar sebagai Pencari Kerja",
    timestamp: "2025-06-01T10:00:00",
    role: "job_seeker",
  },
  {
    id: 2,
    type: "registration",
    icon: "🏢",
    description: "Tokopedia mendaftar sebagai Perusahaan",
    timestamp: "2025-06-01T09:30:00",
    role: "company",
  },
  {
    id: 3,
    type: "job_posted",
    icon: "📋",
    description: "Tokopedia memposting lowongan: Frontend Engineer",
    timestamp: "2025-06-01T11:00:00",
    role: "company",
  },
  {
    id: 4,
    type: "application",
    icon: "📨",
    description: "Budi Santoso melamar ke Frontend Engineer - Tokopedia",
    timestamp: "2025-06-01T13:00:00",
    role: "job_seeker",
  },
  {
    id: 5,
    type: "verification",
    icon: "✅",
    description: "Admin memverifikasi akun Tokopedia",
    timestamp: "2025-06-01T10:30:00",
    role: "admin",
  },
  {
    id: 6,
    type: "job_posted",
    icon: "📋",
    description: "Gojek memposting lowongan: Backend Engineer (Node.js)",
    timestamp: "2025-06-01T12:00:00",
    role: "company",
  },
  {
    id: 7,
    type: "registration",
    icon: "👤",
    description: "Siti Rahma mendaftar sebagai Pencari Kerja",
    timestamp: "2025-06-01T08:00:00",
    role: "job_seeker",
  },
  {
    id: 8,
    type: "application",
    icon: "📨",
    description: "Siti Rahma melamar ke UI/UX Designer - Bukalapak",
    timestamp: "2025-06-01T14:00:00",
    role: "job_seeker",
  },
  {
    id: 9,
    type: "stage_update",
    icon: "🔄",
    description: "Tokopedia memindahkan Budi Santoso ke tahap Tes Online",
    timestamp: "2025-06-01T15:00:00",
    role: "company",
  },
  {
    id: 10,
    type: "verification",
    icon: "✅",
    description: "Admin memverifikasi akun Gojek",
    timestamp: "2025-06-01T09:00:00",
    role: "admin",
  },
  {
    id: 11,
    type: "registration",
    icon: "👤",
    description: "Andi Pratama mendaftar sebagai Pencari Kerja",
    timestamp: "2025-06-01T07:30:00",
    role: "job_seeker",
  },
  {
    id: 12,
    type: "application",
    icon: "📨",
    description: "Andi Pratama melamar ke Backend Engineer - Gojek",
    timestamp: "2025-06-01T16:00:00",
    role: "job_seeker",
  },
  {
    id: 13,
    type: "job_posted",
    icon: "📋",
    description: "Bukalapak memposting lowongan: UI/UX Designer",
    timestamp: "2025-06-01T11:30:00",
    role: "company",
  },
  {
    id: 14,
    type: "stage_update",
    icon: "🔄",
    description: "Gojek memindahkan Andi Pratama ke tahap Technical Test",
    timestamp: "2025-06-01T17:00:00",
    role: "company",
  },
  {
    id: 15,
    type: "interview",
    icon: "📅",
    description: "Tokopedia menjadwalkan interview untuk Budi Santoso",
    timestamp: "2025-06-01T15:30:00",
    role: "company",
  },
];

const TYPES = [
  { value: "", label: "Semua Aktivitas" },
  { value: "registration", label: "Registrasi" },
  { value: "job_posted", label: "Posting Lowongan" },
  { value: "application", label: "Lamaran" },
  { value: "verification", label: "Verifikasi" },
  { value: "stage_update", label: "Update Tahapan" },
  { value: "interview", label: "Interview" },
];

const typeColors = {
  registration: "bg-blue-100 text-blue-700",
  job_posted: "bg-purple-100 text-purple-700",
  application: "bg-green-100 text-green-700",
  verification: "bg-emerald-100 text-emerald-700",
  stage_update: "bg-orange-100 text-orange-700",
  interview: "bg-indigo-100 text-indigo-700",
};

export default function AdminActivityPage() {
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = typeFilter
    ? activityLog.filter((a) => a.type === typeFilter)
    : activityLog;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  return (
    <div className="flex flex-1">
      <Sidebar role="admin" />
      <div className="flex-1 p-6 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Log Aktivitas Platform
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau semua aktivitas yang terjadi di platform
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${typeFilter === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Activity list */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50">
          {sorted.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Tidak ada aktivitas</p>
            </div>
          ) : (
            sorted.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${typeColors[activity.type] || "bg-gray-100 text-gray-600"}`}
                >
                  {TYPES.find((t) => t.value === activity.type)?.label ||
                    activity.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
