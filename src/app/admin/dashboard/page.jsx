import { accounts } from "@/data/accounts";
import { companies } from "@/data/companies";
import { jobPostings } from "@/data/jobs";
import { applications } from "@/data/applications";
import { jobSeekers } from "@/data/job-seekers";
import Sidebar from "@/components/layout/Sidebar";
import {
  Users,
  Building2,
  Briefcase,
  Send,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const totalAccounts = accounts.filter((a) => !a.deletedAt);
  const totalSeekers = jobSeekers.filter((s) => !s.deletedAt).length;
  const totalCompanies = companies.filter((c) => !c.deletedAt).length;
  const verifiedCompanies = companies.filter(
    (c) => c.isVerified && !c.deletedAt,
  ).length;
  const pendingCompanies = companies.filter(
    (c) => !c.isVerified && !c.deletedAt,
  );
  const activeJobs = jobPostings.filter(
    (j) => j.status === "active" && !j.deletedAt,
  ).length;
  const totalApps = applications.filter((a) => !a.deletedAt).length;

  const stats = [
    {
      label: "Total Akun",
      value: totalAccounts.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pencari Kerja",
      value: totalSeekers,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Perusahaan",
      value: totalCompanies,
      icon: Building2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Terverifikasi",
      value: verifiedCompanies,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Menunggu Verifikasi",
      value: pendingCompanies.length,
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Lowongan Aktif",
      value: activeJobs,
      icon: Briefcase,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Lamaran",
      value: totalApps,
      icon: Send,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const roleBreakdown = [
    {
      label: "Pencari Kerja",
      count: accounts.filter((a) => a.role === "job_seeker" && !a.deletedAt)
        .length,
      color: "bg-blue-100",
    },
    {
      label: "Perusahaan",
      count: accounts.filter((a) => a.role === "company" && !a.deletedAt)
        .length,
      color: "bg-green-100",
    },
    {
      label: "Admin",
      count: accounts.filter((a) => a.role === "admin" && !a.deletedAt).length,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="flex flex-1">
      <Sidebar role="admin" />
      <div className="flex-1 p-6 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau aktivitas dan kelola platform KarirHub
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.slice(0, 4).map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-200 p-4"
            >
              <div
                className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-2`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stats.slice(4).map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-200 p-4"
            >
              <div
                className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-2`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pending verifications */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Menunggu
                Verifikasi ({pendingCompanies.length})
              </h2>
              <a
                href="/admin/verify"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="space-y-3">
              {pendingCompanies.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Semua perusahaan sudah terverifikasi
                </p>
              ) : (
                pendingCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-8 h-8 rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                    <a
                      href="/admin/verify"
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Verifikasi →
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Account breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Distribusi Akun</h2>
            <div className="space-y-3">
              {roleBreakdown.map(({ label, count, color }) => {
                const pct = totalAccounts.length
                  ? Math.round((count / totalAccounts.length) * 100)
                  : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold text-gray-900">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
