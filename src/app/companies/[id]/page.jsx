import {
  MapPin,
  Globe,
  Users,
  CheckCircle,
  ChevronLeft,
  Briefcase,
} from "lucide-react";
import { companies } from "@/data/companies";
import { jobPostings } from "@/data/jobs";
import JobCard from "@/components/jobs/JobCard";

export default function CompanyProfilePage({ params }) {
  const { id } = params;
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Perusahaan Tidak Ditemukan
        </h1>
        <a href="/jobs" className="text-blue-600 hover:underline">
          ← Kembali ke Daftar Lowongan
        </a>
      </div>
    );
  }

  const activeJobs = jobPostings.filter(
    (j) => j.companyId === id && j.status === "active" && !j.deletedAt,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali
      </a>

      {/* Company header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <img
            src={company.logoUrl}
            alt={company.name}
            className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">
                {company.name}
              </h1>
              {company.isVerified && (
                <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">{company.industry}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {company.city}, {company.province}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                {company.employeeCount.toLocaleString("id-ID")} karyawan
              </span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  {company.website
                    .replace("https://", "")
                    .replace("http://", "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {company.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-2">
              Tentang Perusahaan
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {company.description}
            </p>
          </div>
        )}

        {company.address && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {company.address}, {company.city}, {company.province}
            </p>
          </div>
        )}
      </div>

      {/* Active jobs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-gray-900 text-lg">
            Lowongan Aktif ({activeJobs.length})
          </h2>
        </div>
        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Tidak ada lowongan aktif saat ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
