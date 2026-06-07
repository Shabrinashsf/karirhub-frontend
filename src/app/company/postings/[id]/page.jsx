import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { jobPostings, recruitmentStages } from "@/data/jobs";
import { applications, applicationStageHistories } from "@/data/applications";
import { jobSeekers } from "@/data/job-seekers";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import { ChevronLeft, Users, Clock, Edit2, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CompanyPostingDetailPage({ params }) {
  const { id } = params;
  const [statusFilter, setStatusFilter] = useState("");

  const job = jobPostings.find((j) => j.id === id);
  if (!job) {
    return (
      <div className="flex flex-1">
        <Sidebar role="company" />
        <div className="flex-1 p-8 text-center">
          <h2 className="font-bold text-gray-900">Lowongan tidak ditemukan</h2>
          <a
            href="/company/postings"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            ← Kembali
          </a>
        </div>
      </div>
    );
  }

  const stages = recruitmentStages
    .filter((s) => s.jobPostingId === id && !s.deletedAt)
    .sort((a, b) => a.stageOrder - b.stageOrder);

  const jobApps = applications.filter(
    (a) => a.jobPostingId === id && !a.deletedAt,
  );
  const filtered = statusFilter
    ? jobApps.filter((a) => a.status === statusFilter)
    : jobApps;

  const STATUS_FILTERS = [
    { value: "", label: `Semua (${jobApps.length})` },
    { value: "in_progress", label: "Berlangsung" },
    { value: "hired", label: "Diterima" },
    { value: "rejected", label: "Ditolak" },
    { value: "withdrawn", label: "Ditarik" },
  ];

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <a
          href="/company/postings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Kelola Lowongan
        </a>

        {/* Job header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                <span>{job.city}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Deadline:{" "}
                  {formatDate(job.deadline)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {jobApps.length} Pelamar
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={job.status} />
              <a
                href={`/company/postings/${id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </a>
            </div>
          </div>

          {/* Stages */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Tahapan Seleksi
            </p>
            <div className="flex flex-wrap gap-2">
              {stages.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                    {idx + 1}. {s.stageName}
                  </span>
                  {idx < stages.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applicants */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Daftar Pelamar</h2>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${statusFilter === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Belum ada pelamar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 pb-3 font-medium">
                      Kandidat
                    </th>
                    <th className="text-left py-2 pb-3 font-medium">
                      Tahapan Saat Ini
                    </th>
                    <th className="text-left py-2 pb-3 font-medium">Status</th>
                    <th className="text-left py-2 pb-3 font-medium">
                      Tanggal Lamar
                    </th>
                    <th className="text-right py-2 pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((app) => {
                    const seeker = jobSeekers.find(
                      (s) => s.id === app.jobSeekerId,
                    );
                    const currentStage = stages.find(
                      (s) => s.id === app.currentStageId,
                    );
                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                seeker?.profileImg ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${seeker?.fullName}`
                              }
                              alt={seeker?.fullName}
                              className="w-7 h-7 rounded-full border border-gray-100"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-xs">
                                {seeker?.fullName}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {seeker?.city}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          {currentStage ? (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                              {currentStage.stageName}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-3 text-xs text-gray-500">
                          {formatDate(app.appliedAt)}
                        </td>
                        <td className="py-3 text-right">
                          <a
                            href={`/company/applicants/${app.id}`}
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
