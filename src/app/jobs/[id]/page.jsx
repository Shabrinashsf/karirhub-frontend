import { useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  CheckCircle,
  Send,
  ChevronLeft,
  Globe,
  Users,
} from "lucide-react";
import { jobPostings, jobPostingSkills, recruitmentStages } from "@/data/jobs";
import { companies } from "@/data/companies";
import { skills } from "@/data/skills";
import { applications } from "@/data/applications";
import { useApp } from "@/context/AppContext";
import {
  formatSalary,
  formatDate,
  jobTypeLabel,
  workTypeLabel,
} from "@/lib/utils";
import SkillBadge from "@/components/shared/SkillBadge";
import StatusBadge from "@/components/shared/StatusBadge";

export default function JobDetailPage({ params }) {
  const { id } = params;
  const { activeRole, currentUser, currentAccount } = useApp();
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const job = jobPostings.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Lowongan Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-4">
          Lowongan yang Anda cari tidak tersedia.
        </p>
        <a href="/jobs" className="text-blue-600 hover:underline">
          ← Kembali ke Daftar Lowongan
        </a>
      </div>
    );
  }

  const company = companies.find((c) => c.id === job.companyId);
  const jobSkills = jobPostingSkills.filter(
    (jps) => jps.jobPostingId === id && !jps.deletedAt,
  );
  const stages = recruitmentStages
    .filter((s) => s.jobPostingId === id && !s.deletedAt)
    .sort((a, b) => a.stageOrder - b.stageOrder);

  const existingApp =
    activeRole === "job_seeker" && currentUser
      ? applications.find(
          (a) => a.jobPostingId === id && a.jobSeekerId === currentUser.id,
        )
      : null;

  const handleApply = () => {
    if (!currentAccount || activeRole !== "job_seeker") {
      window.location.href = "/login";
      return;
    }
    setShowModal(true);
  };

  const handleSubmitApplication = () => {
    setApplied(true);
    setShowModal(false);
  };

  const workTypeBadge =
    {
      remote: "bg-green-100 text-green-700",
      onsite: "bg-orange-100 text-orange-700",
      hybrid: "bg-purple-100 text-purple-700",
    }[job.workType] || "bg-gray-100 text-gray-600";
  const jobTypeBadge =
    {
      full_time: "bg-blue-100 text-blue-700",
      part_time: "bg-yellow-100 text-yellow-700",
      contract: "bg-red-100 text-red-700",
      internship: "bg-pink-100 text-pink-700",
    }[job.jobType] || "bg-gray-100 text-gray-600";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Lowongan
      </a>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-5">
          {/* Job header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <img
                src={company?.logoUrl}
                alt={company?.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {job.title}
                    </h1>
                    <a
                      href={`/companies/${company?.id}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 mt-1"
                    >
                      <Building2 className="w-4 h-4" />
                      {company?.name}
                      {company?.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-500 ml-0.5" />
                      )}
                    </a>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${jobTypeBadge}`}
                  >
                    {jobTypeLabel(job.jobType)}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${workTypeBadge}`}
                  >
                    {workTypeLabel(job.workType)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.city}, {job.province}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Deadline: {formatDate(job.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              {existingApp ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Sudah Melamar
                  </div>
                  <StatusBadge status={existingApp.status} />
                  <a
                    href={`/seeker/applications/${existingApp.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lihat Detail
                  </a>
                </div>
              ) : applied ? (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Lamaran Berhasil Dikirim!
                </div>
              ) : job.status !== "active" ? (
                <div className="px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium inline-block">
                  Lowongan Tidak Aktif
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  <Send className="w-4 h-4" /> Lamar Sekarang
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">
              Deskripsi Pekerjaan
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Persyaratan
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Skills */}
          {jobSkills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-1">
                Skill yang Dibutuhkan
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs mr-1">
                  ✦ Wajib
                </span>
                <span className="border border-blue-400 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  Nice to have
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {jobSkills.map((jps) => {
                  const skill = skills.find((s) => s.id === jps.skillId);
                  return skill ? (
                    <SkillBadge
                      key={jps.id}
                      skillName={skill.name}
                      isRequired={jps.isRequired}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Recruitment stages */}
          {stages.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                Tahapan Rekrutmen
              </h2>
              <div className="space-y-3">
                {stages.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-gray-800 font-medium">
                      {stage.stageName}
                    </span>
                    {idx < stages.length - 1 && (
                      <div className="h-px flex-1 border-t border-dashed border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Company info */}
        {company && (
          <aside className="w-full lg:w-72 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Info Perusahaan</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl border border-gray-100"
                />
                <div>
                  <a
                    href={`/companies/${company.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-700 transition-colors flex items-center gap-1 text-sm"
                  >
                    {company.name}
                    {company.isVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </a>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    {company.city}, {company.province}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    {company.employeeCount.toLocaleString("id-ID")} karyawan
                  </span>
                </div>
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {company.website.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                  {company.description}
                </p>
              </div>
              <a
                href={`/companies/${company.id}`}
                className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lihat Profil Lengkap →
              </a>
            </div>
          </aside>
        )}
      </div>

      {/* Apply modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="font-bold text-gray-900 text-lg mb-1">
              Lamar: {job.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">di {company?.name}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan mengapa Anda adalah kandidat yang tepat..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitApplication}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Kirim Lamaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
