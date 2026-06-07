import { useState } from "react";
import { companies as allCompanies } from "@/data/companies";
import Sidebar from "@/components/layout/Sidebar";
import {
  Building2,
  CheckCircle,
  MapPin,
  Users,
  Globe,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminVerifyPage() {
  const [verifiedIds, setVerifiedIds] = useState([]);
  const [filter, setFilter] = useState("pending"); // "pending" | "verified" | "all"
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filtered = allCompanies.filter((c) => {
    const isVerified = c.isVerified || verifiedIds.includes(c.id);
    if (filter === "pending") return !isVerified;
    if (filter === "verified") return isVerified;
    return true;
  });

  const handleVerify = (companyId) => {
    setVerifiedIds((prev) => [...prev, companyId]);
    if (selectedCompany?.id === companyId) {
      setSelectedCompany({ ...selectedCompany, isVerified: true });
    }
  };

  return (
    <div className="flex flex-1">
      <Sidebar role="admin" />
      <div className="flex-1 p-6 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Verifikasi Perusahaan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tinjau dan verifikasi akun perusahaan yang mendaftar
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { value: "pending", label: "Menunggu Verifikasi" },
            { value: "verified", label: "Sudah Terverifikasi" },
            { value: "all", label: "Semua" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          {/* Company list */}
          <div className="flex-1 space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center">
                <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Tidak ada data</p>
              </div>
            ) : (
              filtered.map((company) => {
                const isVerified =
                  company.isVerified || verifiedIds.includes(company.id);
                return (
                  <div
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-sm ${selectedCompany?.id === company.id ? "border-blue-400 ring-1 ring-blue-200" : "border-gray-200"}`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {company.name}
                          </h3>
                          {isVerified ? (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" /> Terverifikasi
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" /> Menunggu
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {company.industry} · {company.city}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Didaftarkan: {formatDate(company.createdAt)}
                        </p>
                      </div>
                      {!isVerified && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerify(company.id);
                          }}
                          className="flex-shrink-0 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          Verifikasi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Company detail panel */}
          {selectedCompany && (
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
                <div className="flex flex-col items-center text-center mb-4">
                  <img
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.name}
                    className="w-16 h-16 rounded-2xl border border-gray-100 mb-3"
                  />
                  <h3 className="font-bold text-gray-900">
                    {selectedCompany.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedCompany.industry}
                  </p>
                  {selectedCompany.isVerified ||
                  verifiedIds.includes(selectedCompany.id) ? (
                    <span className="mt-2 flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  ) : (
                    <span className="mt-2 flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                      <AlertCircle className="w-3.5 h-3.5" /> Menunggu
                      Verifikasi
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {selectedCompany.city}, {selectedCompany.province}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {selectedCompany.employeeCount?.toLocaleString("id-ID")}{" "}
                    karyawan
                  </div>
                  {selectedCompany.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {selectedCompany.website}
                      </a>
                    </div>
                  )}
                </div>
                {selectedCompany.description && (
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed border-t border-gray-100 pt-3">
                    {selectedCompany.description}
                  </p>
                )}
                {!(
                  selectedCompany.isVerified ||
                  verifiedIds.includes(selectedCompany.id)
                ) && (
                  <button
                    onClick={() => handleVerify(selectedCompany.id)}
                    className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Verifikasi Perusahaan
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
