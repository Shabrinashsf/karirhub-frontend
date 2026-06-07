import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  CheckCircle,
  Edit2,
  AlertCircle,
  Home,
} from "lucide-react";

export default function CompanyProfilePage() {
  const { currentUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!currentUser)
    return (
      <div className="p-8 text-center text-gray-500">
        Silakan masuk terlebih dahulu.
      </div>
    );

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Profil Perusahaan
          </h1>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" /> {editing ? "Batal" : "Edit Profil"}
          </button>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4" /> Profil berhasil disimpan!
          </div>
        )}

        {!currentUser.isVerified && (
          <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4" />
            Akun perusahaan Anda sedang menunggu verifikasi Admin. Setelah
            terverifikasi, Anda dapat mulai memposting lowongan.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={currentUser.logoUrl}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-2xl border border-gray-100"
                />
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Ganti Logo
                </button>
              </div>
              {[
                { label: "Nama Perusahaan", key: "name", type: "text" },
                { label: "Industri", key: "industry", type: "text" },
                { label: "Website", key: "website", type: "url" },
                { label: "Alamat", key: "address", type: "text" },
                { label: "Kota", key: "city", type: "text" },
                { label: "Provinsi", key: "province", type: "text" },
                {
                  label: "Jumlah Karyawan",
                  key: "employeeCount",
                  type: "number",
                },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    defaultValue={currentUser[key] || ""}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  defaultValue={currentUser.description || ""}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Simpan Perubahan
              </button>
            </form>
          ) : (
            <>
              <div className="flex items-start gap-5 mb-6">
                <img
                  src={currentUser.logoUrl}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-2xl border border-gray-100 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentUser.name}
                    </h2>
                    {currentUser.isVerified && (
                      <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Terverifikasi
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {currentUser.industry}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {[
                  {
                    icon: Home,
                    label: "Alamat",
                    value: currentUser.address || "-",
                  },
                  {
                    icon: MapPin,
                    label: "Lokasi",
                    value: `${currentUser.city || "-"}, ${currentUser.province || "-"}`,
                  },
                  {
                    icon: Users,
                    label: "Karyawan",
                    value: `${currentUser.employeeCount?.toLocaleString("id-ID")} orang`,
                  },
                  { icon: Globe, label: "Website", value: currentUser.website },
                  {
                    icon: Building2,
                    label: "Industri",
                    value: currentUser.industry,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Icon className="w-4 h-4 text-gray-400" />
                      {label === "Website" ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {currentUser.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Deskripsi
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {currentUser.description}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
