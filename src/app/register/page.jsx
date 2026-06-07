import { useState } from "react";
import {
  Briefcase,
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState("job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Akun Anda sebagai{" "}
            <strong>
              {role === "job_seeker" ? "Pencari Kerja" : "Perusahaan"}
            </strong>{" "}
            telah berhasil dibuat.
            {role === "company" && (
              <span>
                {" "}
                Akun perusahaan perlu diverifikasi oleh admin sebelum dapat
                memposting lowongan.
              </span>
            )}
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600"
          >
            <Briefcase className="w-7 h-7" />
            KarirHub
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            Buat Akun Baru
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Mulai perjalanan karir atau rekrut talenta terbaik
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daftar sebagai
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("job_seeker")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "job_seeker"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-sm font-medium">Pencari Kerja</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "company"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-sm font-medium">Perusahaan</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {role === "job_seeker" ? "Nama Lengkap" : "Nama Perusahaan"}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  role === "job_seeker" ? "Budi Santoso" : "PT Perusahaan Tbk"
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {role === "company" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                ⚠️ Akun perusahaan perlu diverifikasi oleh Admin KarirHub sebelum
                dapat memposting lowongan.
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-medium text-sm text-white transition-colors ${
                role === "job_seeker"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Daftar Sekarang
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
