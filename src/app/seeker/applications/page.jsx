import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { applications as allApps } from "@/data/applications";
import { jobPostings } from "@/data/jobs";
import { companies } from "@/data/companies";
import Sidebar from "@/components/layout/Sidebar";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Briefcase,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { formatDate, jobTypeLabel } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "in_progress", label: "Berlangsung" },
  { value: "hired", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
  { value: "withdrawn", label: "Ditarik" },
];

export default function SeekerApplicationsPage() {
  const { currentUser } = useApp();
  const [statusFilter, setStatusFilter] = useState("");
  const [withdrawId, setWithdrawId] = useState(null);
  const [withdrawn, setWithdrawn] = useState([]);

  const myApps = allApps.filter(
    (a) => a.jobSeekerId === currentUser?.id && !a.deletedAt,
  );

  const filtered = statusFilter
    ? myApps.filter((a) => {
        const eff = withdrawn.includes(a.id) ? "withdrawn" : a.status;
        return eff === statusFilter;
      })
    : myApps;

  const handleWithdraw = (id) => {
    setWithdrawn((prev) => [...prev, id]);
    setWithdrawId(null);
  };

  return (
    <div className="flex flex-1">
      <Sidebar role="job_seeker" />
      <div className="flex-1 p-6 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Lamaran</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total <strong>{myApps.length}</strong> lamaran
          </p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_FILTERS.map(({ value, label }) => (
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

        {/* Application list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Tidak ada lamaran</p>
              <a
                href="/jobs"
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              >
                Cari Lowongan →
              </a>
            </div>
          ) : (
            filtered.map((app) => {
              const job = jobPostings.find((j) => j.id === app.jobPostingId);
              const company = companies.find((c) => c.id === job?.companyId);
              const effectiveStatus = withdrawn.includes(app.id)
                ? "withdrawn"
                : app.status;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={company?.logoUrl}
                      alt={company?.name}
                      className="w-12 h-12 rounded-xl border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <a
                            href={`/seeker/applications/${app.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-700 transition-colors text-sm"
                          >
                            {job?.title}
                          </a>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {company?.name}
                          </p>
                        </div>
                        <StatusBadge status={effectiveStatus} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job?.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />{" "}
                          {jobTypeLabel(job?.jobType)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Melamar{" "}
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <a
                      href={`/seeker/applications/${app.id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
                    >
                      Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                    {effectiveStatus === "in_progress" && (
                      <button
                        onClick={() => setWithdrawId(app.id)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                      >
                        Tarik Lamaran
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Withdraw confirm modal */}
      {withdrawId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="font-bold text-gray-900 mb-1">Tarik Lamaran?</h2>
            <p className="text-sm text-gray-500 mb-5">
              Lamaran yang ditarik tidak dapat dikembalikan. Anda yakin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setWithdrawId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleWithdraw(withdrawId)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                Ya, Tarik
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
