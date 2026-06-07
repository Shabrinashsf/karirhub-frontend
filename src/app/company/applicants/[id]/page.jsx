import { useState } from "react";
import {
  applications,
  applicationStageHistories,
  interviews,
} from "@/data/applications";
import { jobPostings, recruitmentStages } from "@/data/jobs";
import { jobSeekers, jobSeekerSkills } from "@/data/job-seekers";
import { skills } from "@/data/skills";
import Sidebar from "@/components/layout/Sidebar";
import StageTimeline from "@/components/applications/StageTimeline";
import StatusBadge from "@/components/shared/StatusBadge";
import SkillBadge from "@/components/shared/SkillBadge";
import {
  ChevronLeft,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronRight,
  Plus,
  Calendar,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function CompanyApplicantDetailPage({ params }) {
  const { id } = params;
  const [advanceSuccess, setAdvanceSuccess] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewSaved, setInterviewSaved] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    durationMinutes: 60,
    type: "online",
    location: "",
    meetingLink: "",
  });

  const app = applications.find((a) => a.id === id);
  if (!app) {
    return (
      <div className="flex flex-1">
        <Sidebar role="company" />
        <div className="flex-1 p-8 text-center">
          <h2 className="font-bold">Lamaran tidak ditemukan</h2>
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

  const seeker = jobSeekers.find((s) => s.id === app.jobSeekerId);
  const job = jobPostings.find((j) => j.id === app.jobPostingId);
  const stages = recruitmentStages
    .filter((s) => s.jobPostingId === job?.id && !s.deletedAt)
    .sort((a, b) => a.stageOrder - b.stageOrder);
  const currentStage = stages.find((s) => s.id === app.currentStageId);
  const currentStageIdx = stages.findIndex((s) => s.id === app.currentStageId);
  const nextStage = stages[currentStageIdx + 1];
  const seekerSkills = jobSeekerSkills.filter(
    (s) => s.jobSeekerId === app.jobSeekerId && !s.deletedAt,
  );
  const myInterviews = interviews.filter(
    (i) => i.applicationId === id && !i.deletedAt,
  );

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <a
          href={`/company/postings/${job?.id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Detail Lowongan
        </a>

        {/* Seeker info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <div className="flex items-start gap-4">
            <img
              src={
                seeker?.profileImg ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${seeker?.fullName}`
              }
              alt={seeker?.fullName}
              className="w-16 h-16 rounded-2xl border border-gray-100 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {seeker?.fullName}
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {seeker?.city}, {seeker?.province}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              {seeker?.bio && (
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {seeker.bio}
                </p>
              )}
            </div>
          </div>

          {seekerSkills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Skill
              </p>
              <div className="flex flex-wrap gap-2">
                {seekerSkills.slice(0, 8).map((jss) => {
                  const skill = skills.find((s) => s.id === jss.skillId);
                  return skill ? (
                    <SkillBadge
                      key={jss.id}
                      skillName={skill.name}
                      level={jss.level}
                      showLevel
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Melamar ke:{" "}
              <strong className="text-gray-700">{job?.title}</strong> ·{" "}
              {formatDate(app.appliedAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        {app.status === "in_progress" && !advanceSuccess && !rejectSuccess && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
            <h2 className="font-bold text-gray-900 mb-1">Tindakan Seleksi</h2>
            {currentStage && (
              <p className="text-xs text-gray-400 mb-3">
                Tahapan saat ini:{" "}
                <span className="font-medium text-gray-600">
                  {currentStage.stageName}
                </span>
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {nextStage && (
                <button
                  onClick={() => setAdvanceSuccess(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  Lanjutkan ke: {nextStage.stageName}
                </button>
              )}
              {!nextStage && currentStage && (
                <button
                  onClick={() => setAdvanceSuccess(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Terima Kandidat (Hired)
                </button>
              )}
              <button
                onClick={() => setRejectSuccess(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Tolak Kandidat
              </button>
              <button
                onClick={() => setShowInterviewForm(!showInterviewForm)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4" /> Jadwalkan Interview
              </button>
            </div>

            {advanceSuccess && (
              <div className="mt-3 flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                <CheckCircle className="w-4 h-4" /> Kandidat berhasil
                dipindahkan ke tahapan berikutnya.
              </div>
            )}
            {rejectSuccess && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                <XCircle className="w-4 h-4" /> Kandidat ditolak.
              </div>
            )}

            {showInterviewForm && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">
                  Jadwalkan Interview
                </h3>
                {interviewSaved ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                    <CheckCircle className="w-4 h-4" /> Interview berhasil
                    dijadwalkan!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Tanggal & Waktu
                        </label>
                        <input
                          type="datetime-local"
                          value={interviewForm.scheduledAt}
                          onChange={(e) =>
                            setInterviewForm((p) => ({
                              ...p,
                              scheduledAt: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Durasi (menit)
                        </label>
                        <input
                          type="number"
                          value={interviewForm.durationMinutes}
                          onChange={(e) =>
                            setInterviewForm((p) => ({
                              ...p,
                              durationMinutes: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Tipe Interview
                      </label>
                      <div className="flex gap-3">
                        {["online", "onsite"].map((t) => (
                          <label
                            key={t}
                            className="flex items-center gap-2 cursor-pointer text-xs"
                          >
                            <input
                              type="radio"
                              name="itype"
                              value={t}
                              checked={interviewForm.type === t}
                              onChange={(e) =>
                                setInterviewForm((p) => ({
                                  ...p,
                                  type: e.target.value,
                                }))
                              }
                              className="accent-blue-600"
                            />
                            {t === "online" ? "Online" : "Onsite"}
                          </label>
                        ))}
                      </div>
                    </div>
                    {interviewForm.type === "online" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Meeting Link
                        </label>
                        <input
                          type="url"
                          value={interviewForm.meetingLink}
                          onChange={(e) =>
                            setInterviewForm((p) => ({
                              ...p,
                              meetingLink: e.target.value,
                            }))
                          }
                          placeholder="https://meet.google.com/..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    )}
                    {interviewForm.type === "onsite" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Lokasi
                        </label>
                        <input
                          type="text"
                          value={interviewForm.location}
                          onChange={(e) =>
                            setInterviewForm((p) => ({
                              ...p,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Gedung A, Lantai 5..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => setInterviewSaved(true)}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Simpan Jadwal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selection timeline */}
        {job && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
            <h2 className="font-bold text-gray-900 mb-5">Riwayat Seleksi</h2>
            <StageTimeline jobPostingId={job.id} applicationId={id} />
          </div>
        )}

        {/* Interviews */}
        {myInterviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Jadwal Interview</h2>
            <div className="space-y-3">
              {myInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="border border-gray-100 rounded-xl p-4 bg-gray-50 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-800">
                      {interview.meetingLink
                        ? "Interview Online"
                        : "Interview Onsite"}
                    </p>
                    <StatusBadge status={interview.status} />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDateTime(interview.scheduledAt)} ·{" "}
                    {interview.durationMinutes} menit
                  </p>
                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-xs hover:underline mt-1 block truncate"
                    >
                      {interview.meetingLink}
                    </a>
                  )}
                  {interview.location && (
                    <p className="text-gray-500 text-xs mt-1">
                      {interview.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
