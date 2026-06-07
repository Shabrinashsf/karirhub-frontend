import { useState } from "react";
import { Briefcase, Eye, EyeOff, User, Building2, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { accounts } from "@/data/accounts";
import { jobSeekers } from "@/data/job-seekers";
import { companies } from "@/data/companies";
import { admins } from "@/data/accounts";

const DEMO_USERS = [
  {
    accountId: "acc-001",
    role: "job_seeker",
    label: "Budi Santoso",
    desc: "Pencari Kerja",
    icon: User,
    color: "blue",
  },
  {
    accountId: "acc-002",
    role: "job_seeker",
    label: "Siti Rahma",
    desc: "Pencari Kerja",
    icon: User,
    color: "blue",
  },
  {
    accountId: "acc-005",
    role: "company",
    label: "Tokopedia",
    desc: "Perusahaan",
    icon: Building2,
    color: "green",
  },
  {
    accountId: "acc-006",
    role: "company",
    label: "Gojek",
    desc: "Perusahaan",
    icon: Building2,
    color: "green",
  },
  {
    accountId: "acc-010",
    role: "admin",
    label: "Admin KarirHub",
    desc: "Admin",
    icon: Shield,
    color: "purple",
  },
];

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("demo"); // "demo" | "form"

  const handleDemoLogin = (accountId) => {
    login(accountId);
    const account = accounts.find((a) => a.id === accountId);
    const role = account?.role;
    if (role === "job_seeker") window.location.href = "/seeker/dashboard";
    else if (role === "company") window.location.href = "/company/dashboard";
    else if (role === "admin") window.location.href = "/admin/dashboard";
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    const account = accounts.find((a) => a.email === email && !a.deletedAt);
    if (!account) {
      setError("Email atau password salah.");
      return;
    }
    login(account.id);
    if (account.role === "job_seeker")
      window.location.href = "/seeker/dashboard";
    else if (account.role === "company")
      window.location.href = "/company/dashboard";
    else if (account.role === "admin")
      window.location.href = "/admin/dashboard";
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 mb-2"
          >
            <Briefcase className="w-7 h-7" />
            KarirHub
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            Masuk ke Akun Anda
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Platform rekrutmen digital terpercaya
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setTab("demo")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === "demo" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Login Demo
            </button>
            <button
              onClick={() => setTab("form")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === "form" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Form Login
            </button>
          </div>

          {tab === "demo" && (
            <div>
              <p className="text-xs text-gray-400 text-center mb-4">
                Pilih akun demo untuk masuk langsung:
              </p>
              <div className="space-y-2">
                {DEMO_USERS.map((u) => {
                  const Icon = u.icon;
                  const bgColor =
                    u.color === "blue"
                      ? "hover:bg-blue-50 hover:border-blue-200"
                      : u.color === "green"
                        ? "hover:bg-green-50 hover:border-green-200"
                        : "hover:bg-purple-50 hover:border-purple-200";
                  const iconColor =
                    u.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : u.color === "green"
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600";
                  return (
                    <button
                      key={u.accountId}
                      onClick={() => handleDemoLogin(u.accountId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 transition-all text-left ${bgColor}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {u.label}
                        </p>
                        <p className="text-xs text-gray-500">{u.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "form" && (
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
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
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                Gunakan email dari akun demo:{" "}
                <strong>budi.santoso@email.com</strong>,{" "}
                <strong>hr@tokopedia.com</strong>, dll. Password bebas.
              </p>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Masuk
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
