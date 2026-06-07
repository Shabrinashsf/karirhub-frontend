import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronDown,
} from "lucide-react";
import { jobPostings } from "@/data/jobs";
import { companies } from "@/data/companies";
import { applications } from "@/data/applications";
import { jobSeekers } from "@/data/job-seekers";
import JobCard from "@/components/jobs/JobCard";
import { jobTypeLabel } from "@/lib/utils";

const CITIES = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
];
const JOB_TYPES = ["full_time", "part_time", "contract", "internship"];

export default function LandingPage() {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [jobType, setJobType] = useState("");

  const activeJobs = jobPostings.filter(
    (j) => j.status === "active" && !j.deletedAt,
  );
  const verifiedCompanies = companies.filter(
    (c) => c.isVerified && !c.deletedAt,
  );
  const totalSeekers = jobSeekers.filter((s) => !s.deletedAt).length;

  const featuredJobs = activeJobs.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (city) params.set("city", city);
    if (jobType) params.set("type", jobType);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            Platform Rekrutmen Digital #1 Indonesia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Temukan Karir Impian
            <br />
            <span className="text-yellow-300">Bersama KarirHub</span>
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Menghubungkan ribuan pencari kerja berbakat dengan perusahaan
            teknologi terkemuka di Indonesia secara efisien dan transparan.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari posisi, skill, atau perusahaan..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-gray-900 placeholder-gray-400 outline-none text-sm"
              />
            </div>
            <div className="w-px bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-2 px-3 py-2 md:py-0">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none text-gray-700 outline-none text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 cursor-pointer"
                >
                  <option value="">Semua Kota</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="w-px bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-2 px-3 py-2 md:py-0">
              <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full appearance-none text-gray-700 outline-none text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 cursor-pointer"
                >
                  <option value="">Semua Tipe</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {jobTypeLabel(t)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 justify-center"
            >
              <Search className="w-4 h-4" />
              Cari
            </button>
          </form>

          <p className="text-blue-200 text-sm mt-4">
            Tersedia{" "}
            <strong className="text-white">
              {activeJobs.length} lowongan aktif
            </strong>{" "}
            dari {verifiedCompanies.length} perusahaan terverifikasi
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Briefcase,
                value: activeJobs.length,
                label: "Lowongan Aktif",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Building2,
                value: verifiedCompanies.length,
                label: "Perusahaan Terverifikasi",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Users,
                value: totalSeekers,
                label: "Pencari Kerja",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: TrendingUp,
                value: applications.length,
                label: "Lamaran Dikirim",
                color: "text-orange-600 bg-orange-50",
              },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center">
                <div
                  className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}+</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Lowongan Terbaru
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Temukan kesempatan karir yang sesuai dengan profil Anda
            </p>
          </div>
          <a
            href="/jobs"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Companies */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Perusahaan Terverifikasi
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Bergabung dengan tim dari perusahaan teknologi terkemuka
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {verifiedCompanies.map((company) => (
              <a
                key={company.id}
                href={`/companies/${company.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-blue-200 transition-all text-center group"
              >
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
                    {company.name}
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                  </p>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Karir?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Bergabunglah dengan ribuan pencari kerja dan perusahaan yang telah
            mempercayai KarirHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Daftar sebagai Pencari Kerja
            </a>
            <a
              href="/register"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Daftar sebagai Perusahaan
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
