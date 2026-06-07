import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import {
  Shield,
  Edit2,
  CheckCircle,
  Mail,
  Calendar,
  User,
} from "lucide-react";

export default function AdminProfilePage() {
  const { currentUser, currentAccount } = useApp();
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
      <Sidebar role="admin" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profil Admin</h1>
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

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4 max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {currentUser.fullName?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
              {[
                { label: "Nama Lengkap", key: "fullName", type: "text" },
                { label: "Email", key: "email", type: "email", readOnly: true },
              ].map(({ label, key, type, readOnly }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    defaultValue={
                      key === "email" ? currentAccount?.email : currentUser[key]
                    }
                    readOnly={readOnly}
                    className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      readOnly ? "bg-gray-50 text-gray-400" : ""
                    }`}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {currentUser.fullName?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {currentUser.fullName}
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Administrator Platform KarirHub
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" /> Informasi Akun
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Nama Lengkap</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currentAccount?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Bergabung</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Role</p>
                      <p className="text-sm font-medium text-gray-900">
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
