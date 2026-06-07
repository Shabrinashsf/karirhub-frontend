import { useApp } from "@/context/AppContext";
import { jobPostings } from "@/data/jobs";
import { applications } from "@/data/applications";
import { jobSeekers } from "@/data/job-seekers";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CompanyDashboard() {
  const { currentUser } = useApp();

  const myPostings = jobPostings.filter(
    (j) => j.companyId === currentUser?.id && !j.deletedAt,
  );

  const stats = {
    total: myPostings.length,
    active: myPostings.filter((j) => j.status === "active").length,
    draft: myPostings.filter((j) => j.status === "draft").length,
    closed: myPostings.filter(
      (j) => j.status === "closed" || j.status === "expired",
    ).length,
  };

  const totalApplicants = myPostings.reduce((sum, job) => {
    return (
      sum +
      applications.filter((a) => a.jobPostingId === job.id && !a.deletedAt)
        .length
    );
  }, 0);

  const activePostings = myPostings.filter((j) => j.status === "active");

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Perusahaan
            </h1>
            <p className="text-gray-500 text-sm mt-1">{currentUser?.name}</p>
          </div>
          {!currentUser?.isVerified && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4" />
              Menunggu verifikasi Admin
            </div>
          )}
          {currentUser?.isVerified && (
            <a
              href="/company/postings/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Buat Lowongan
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Lowongan",
              value: stats.total,
              icon: Briefcase,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Lowongan Aktif",
              value: stats.active,
              icon: CheckCircle,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Draft",
              value: stats.draft,
              icon: Clock,
              color: "bg-yellow-50 text-yellow-600",
            },
            {
              label: "Total Pelamar",
              value: totalApplicants,
              icon: Users,
              color: "bg-purple-50 text-purple-600",
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

        {/* Active postings table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Lowongan Aktif
            </h2>
            <a
              href="/company/postings"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          {activePostings.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Belum ada lowongan aktif</p>
              {currentUser?.isVerified && (
                <a
                  href="/company/postings/new"
                  className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                >
                  Buat Lowongan →
                </a>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 pb-3 font-medium">Posisi</th>
                    <th className="text-left py-2 pb-3 font-medium">
                      Deadline
                    </th>
                    <th className="text-center py-2 pb-3 font-medium">
                      Pelamar
                    </th>
                    <th className="text-left py-2 pb-3 font-medium">Status</th>
                    <th className="text-right py-2 pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activePostings.map((job) => {
                    const appCount = applications.filter(
                      (a) => a.jobPostingId === job.id && !a.deletedAt,
                    ).length;
                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 font-medium text-gray-900">
                          {job.title}
                        </td>
                        <td className="py-3 text-gray-500">
                          {formatDate(job.deadline)}
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {appCount}
                          </span>
                        </td>
                        <td className="py-3">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="py-3 text-right">
                          <a
                            href={`/company/postings/${job.id}`}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Detail →
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
