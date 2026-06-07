import { useState, useMemo } from "react";
import { Filter, Search, X, SlidersHorizontal } from "lucide-react";
import { jobPostings } from "@/data/jobs";
import JobCard from "@/components/jobs/JobCard";
import Sidebar from "@/components/layout/Sidebar";
import { useApp } from "@/context/AppContext";
import { jobTypeLabel, workTypeLabel } from "@/lib/utils";

const CITIES = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
];
const JOB_TYPES = ["full_time", "part_time", "contract", "internship"];
const WORK_TYPES = ["remote", "onsite", "hybrid"];

export default function JobsPage() {
  const { activeRole, currentAccount } = useApp();
  const isLoggedIn = !!currentAccount && !!activeRole;

  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [jobType, setJobType] = useState("");
  const [workType, setWorkType] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const activeJobs = jobPostings.filter(
    (j) => j.status === "active" && !j.deletedAt,
  );

  const filtered = useMemo(() => {
    return activeJobs.filter((j) => {
      const kw = keyword.toLowerCase();
      const matchKw =
        !kw ||
        j.title.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw);
      const matchCity = !city || j.city === city;
      const matchType = !jobType || j.jobType === jobType;
      const matchWork = !workType || j.workType === workType;
      return matchKw && matchCity && matchType && matchWork;
    });
  }, [keyword, city, jobType, workType, activeJobs]);

  const hasFilters = keyword || city || jobType || workType;

  const clearFilters = () => {
    setKeyword("");
    setCity("");
    setJobType("");
    setWorkType("");
  };

  const content = (
    <div className={isLoggedIn ? "flex-1 p-6 w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Daftar Lowongan Kerja
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Menampilkan <strong>{filtered.length}</strong> lowongan aktif
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari posisi, skill, atau perusahaan..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
        />
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar - desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Kota
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="city"
                      value=""
                      checked={city === ""}
                      onChange={() => setCity("")}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Semua Kota</span>
                  </label>
                  {CITIES.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="city"
                        value={c}
                        checked={city === c}
                        onChange={() => setCity(c)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Tipe Pekerjaan
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      value=""
                      checked={jobType === ""}
                      onChange={() => setJobType("")}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Semua Tipe</span>
                  </label>
                  {JOB_TYPES.map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="jobType"
                        value={t}
                        checked={jobType === t}
                        onChange={() => setJobType(t)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {jobTypeLabel(t)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Tipe Kerja
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="workType"
                      value=""
                      checked={workType === ""}
                      onChange={() => setWorkType("")}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Semua</span>
                  </label>
                  {WORK_TYPES.map((w) => (
                    <label
                      key={w}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="workType"
                        value={w}
                        checked={workType === w}
                        onChange={() => setWorkType(w)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {workTypeLabel(w)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile filter toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {hasFilters && (
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
          </button>
          {filterOpen && (
            <div className="mt-3 bg-white border border-gray-200 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Kota
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  >
                    <option value="">Semua</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Tipe Pekerjaan
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  >
                    <option value="">Semua</option>
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {jobTypeLabel(t)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Tipe Kerja
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  >
                    <option value="">Semua</option>
                    {WORK_TYPES.map((w) => (
                      <option key={w} value={w}>
                        {workTypeLabel(w)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Reset semua filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Job list */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">
                Tidak ada lowongan ditemukan
              </h3>
              <p className="text-sm text-gray-400">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return content;
  }

  return (
    <div className="flex flex-1">
      <Sidebar role={activeRole} />
      {content}
    </div>
  );
}
