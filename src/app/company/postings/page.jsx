import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { jobPostings } from "@/data/jobs";
import { applications } from "@/data/applications";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { Briefcase, Plus, Users, Clock, Edit2, Eye } from "lucide-react";
import { formatDate, jobTypeLabel, workTypeLabel } from "@/lib/utils";

const STATUS_TABS = [
  { value: "", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Ditutup" },
  { value: "expired", label: "Expired" },
];

export default function CompanyPostingsPage() {
  const { currentUser } = useApp();
  const [statusFilter, setStatusFilter] = useState("");

  const myPostings = jobPostings.filter(
    (j) => j.companyId === currentUser?.id && !j.deletedAt,
  );

  const filtered = statusFilter
    ? myPostings.filter((j) => j.status === statusFilter)
    : myPostings;

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kelola Lowongan
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Total {myPostings.length} lowongan
            </p>
          </div>
          {currentUser?.isVerified && (
            <a
              href="/company/postings/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Buat Lowongan
            </a>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                statusFilter === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Postings list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada lowongan</p>
              {currentUser?.isVerified && (
                <a
                  href="/company/postings/new"
                  className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                >
                  Buat Lowongan Baru →
                </a>
              )}
            </div>
          ) : (
            filtered.map((job) => {
              const appCount = applications.filter(
                (a) => a.jobPostingId === job.id && !a.deletedAt,
              ).length;
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <span>
                          {jobTypeLabel(job.jobType)} ·{" "}
                          {workTypeLabel(job.workType)}
                        </span>
                        <span>{job.city}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Deadline:{" "}
                          {formatDate(job.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {appCount} pelamar
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`/company/postings/${job.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </a>
                      <a
                        href={`/company/postings/${job.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
