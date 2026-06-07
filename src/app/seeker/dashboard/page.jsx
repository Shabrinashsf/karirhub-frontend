import { useApp } from "@/context/AppContext";
import { applications } from "@/data/applications";
import { jobPostings } from "@/data/jobs";
import { companies } from "@/data/companies";
import { notifications } from "@/data/notifications";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  ArrowRight,
  Send,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SeekerDashboard() {
  const { currentUser, currentAccount } = useApp();

  const myApps = applications.filter(
    (a) => a.jobSeekerId === currentUser?.id && !a.deletedAt,
  );

  const stats = {
    total: myApps.length,
    inProgress: myApps.filter((a) => a.status === "in_progress").length,
    hired: myApps.filter((a) => a.status === "hired").length,
    rejected: myApps.filter((a) => a.status === "rejected").length,
  };

  const myNotifs = notifications
    .filter((n) => n.accountId === currentAccount?.id && !n.deletedAt)
    .slice(0, 4);

  const recentApps = myApps.slice(0, 4);

  return (
    <div className="flex flex-1">
      <Sidebar role="job_seeker" />
      <div className="flex-1 p-6 w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Selamat datang, {currentUser?.fullName?.split(" ")[0] || "Pengguna"}{" "}
            👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau progress lamaran dan temukan peluang karir baru
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Lamaran",
              value: stats.total,
              icon: Send,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Aktif",
              value: stats.inProgress,
              icon: Clock,
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              label: "Diterima",
              value: stats.hired,
              icon: CheckCircle,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Ditolak",
              value: stats.rejected,
              icon: XCircle,
              color: "bg-red-50 text-red-600",
            },
          ].map(({ label, value, icon: Icon, color }) => (
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
          {/* Recent applications */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Lamaran Terbaru
              </h2>
              <a
                href="/seeker/applications"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="space-y-3">
              {recentApps.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Belum ada lamaran
                </p>
              ) : (
                recentApps.map((app) => {
                  const job = jobPostings.find(
                    (j) => j.id === app.jobPostingId,
                  );
                  const company = companies.find(
                    (c) => c.id === job?.companyId,
                  );
                  return (
                    <a
                      key={app.id}
                      href={`/seeker/applications/${app.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={company?.logoUrl}
                          alt={company?.name}
                          className="w-9 h-9 rounded-lg border border-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                            {job?.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {company?.name}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </a>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent notifications */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" /> Notifikasi Terbaru
              </h2>
              <a
                href="/seeker/notifications"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="space-y-3">
              {myNotifs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  Tidak ada notifikasi
                </p>
              ) : (
                myNotifs.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl ${!n.isRead ? "bg-blue-50 border border-blue-100" : "bg-gray-50"}`}
                  >
                    <p
                      className={`text-sm font-medium ${!n.isRead ? "text-blue-900" : "text-gray-700"}`}
                    >
                      {!n.isRead && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 mb-0.5 align-middle" />
                      )}
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold">Temukan lowongan baru</p>
            <p className="text-blue-100 text-sm">
              Ada banyak kesempatan karir menanti Anda
            </p>
          </div>
          <a
            href="/jobs"
            className="bg-white text-blue-700 font-medium px-5 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            Cari Lowongan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
