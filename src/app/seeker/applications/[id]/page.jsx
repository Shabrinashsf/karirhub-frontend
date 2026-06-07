import { useApp } from "@/context/AppContext";
import { applications, interviews } from "@/data/applications";
import { jobPostings } from "@/data/jobs";
import { companies } from "@/data/companies";
import Sidebar from "@/components/layout/Sidebar";
import StageTimeline from "@/components/applications/StageTimeline";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Building2,
  Calendar,
  ChevronLeft,
  Clock,
  Link2,
  MapPin,
  Video,
} from "lucide-react";
import {
  formatDate,
  formatDateTime,
  formatSalary,
  jobTypeLabel,
  workTypeLabel,
} from "@/lib/utils";

export default function SeekerApplicationDetailPage({ params }) {
  const { id } = params;
  const { currentUser } = useApp();

  const app = applications.find((a) => a.id === id);
  if (!app) {
    return (
      <div className="flex flex-1">
        <Sidebar role="job_seeker" />
        <div className="flex-1 p-8 text-center">
          <h2 className="font-bold text-gray-900">Lamaran tidak ditemukan</h2>
          <a
            href="/seeker/applications"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            ← Kembali
          </a>
        </div>
      </div>
    );
  }

  const job = jobPostings.find((j) => j.id === app.jobPostingId);
  const company = companies.find((c) => c.id === job?.companyId);
  const myInterviews = interviews.filter(
    (i) => i.applicationId === id && !i.deletedAt,
  );

  return (
    <div className="flex flex-1">
      <Sidebar role="job_seeker" />
      <div className="flex-1 p-6 w-full">
        <a
          href="/seeker/applications"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Riwayat Lamaran
        </a>

        {/* Job info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <div className="flex items-start gap-4">
            <img
              src={company?.logoUrl}
              alt={company?.name}
              className="w-14 h-14 rounded-xl border border-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {job?.title}
                  </h1>
                  <a
                    href={`/companies/${company?.id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    {company?.name}
                  </a>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job?.city}
                </span>
                <span>
                  {jobTypeLabel(job?.jobType)} · {workTypeLabel(job?.workType)}
                </span>
                <span>{formatSalary(job?.salaryMin, job?.salaryMax)}</span>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Dilamar pada {formatDate(app.appliedAt)}
              </p>
            </div>
          </div>

          {app.coverLetter && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Cover Letter
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {app.coverLetter}
              </p>
            </div>
          )}
        </div>

        {/* Stage timeline */}
        {job && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
            <h2 className="font-bold text-gray-900 mb-5">Progres Seleksi</h2>
            <StageTimeline jobPostingId={job.id} applicationId={id} />
          </div>
        )}

        {/* Interviews */}
        {myInterviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Jadwal Wawancara</h2>
            <div className="space-y-4">
              {myInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="border border-gray-100 rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${interview.meetingLink ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
                      >
                        {interview.meetingLink ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {interview.meetingLink
                          ? "Interview Online"
                          : "Interview Onsite"}
                      </span>
                    </div>
                    <StatusBadge status={interview.status} />
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {formatDateTime(interview.scheduledAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      Durasi: {interview.durationMinutes} menit
                    </div>
                    {interview.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        {interview.location}
                      </div>
                    )}
                    {interview.meetingLink && (
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {interview.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
