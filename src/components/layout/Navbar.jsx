import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { notifications } from "@/data/notifications";
import {
  Briefcase,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

function NavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
    >
      {children}
    </a>
  );
}

export default function Navbar() {
  const { activeRole, currentAccount, currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropdownOpen]);

  const dashboardLink =
    activeRole === "job_seeker"
      ? "/seeker/dashboard"
      : activeRole === "company"
        ? "/company/dashboard"
        : activeRole === "admin"
          ? "/admin/dashboard"
          : "/login";

  const profileLink =
    activeRole === "job_seeker"
      ? "/seeker/profile"
      : activeRole === "company"
        ? "/company/profile"
        : activeRole === "admin"
          ? "/admin/profile"
          : "/login";

  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentAccount?.email ||
    "Pengguna";

  const roleLabel =
    activeRole === "job_seeker"
      ? "Pencari Kerja"
      : activeRole === "company"
        ? "Perusahaan"
        : activeRole === "admin"
          ? "Admin"
          : "";

  const notifHref =
    activeRole === "job_seeker"
      ? "/seeker/notifications"
      : activeRole === "company"
        ? "/company/notifications"
        : "/admin/notifications";

  const unreadCount = currentAccount
    ? notifications.filter(
        (n) => n.accountId === currentAccount.id && !n.isRead && !n.deletedAt,
      ).length
    : 0;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-600"
          >
            <Briefcase className="w-6 h-6" />
            KarirHub
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!currentAccount && <NavLink href="/jobs">Cari Lowongan</NavLink>}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {currentAccount ? (
              <>
                <a
                  href={dashboardLink}
                  className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  Dashboard
                </a>
                <a
                  href={notifHref}
                  className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  aria-label="Notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </a>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all text-sm border ${
                      dropdownOpen
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "border-transparent hover:bg-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left leading-tight hidden sm:block">
                      <span className="block text-gray-800 font-semibold text-xs max-w-[120px] truncate">
                        {displayName}
                      </span>
                      <span className="block text-gray-400 text-[10px] uppercase tracking-wide">
                        {roleLabel}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 origin-top-right transition-all ${
                      dropdownOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {/* User header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400">{roleLabel}</p>
                    </div>

                    <div className="py-1">
                      <a
                        href={dashboardLink}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        Dashboard
                      </a>
                      <a
                        href={profileLink}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Profil
                      </a>
                    </div>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors rounded-b-2xl"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  Daftar
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-1 shadow-lg">
          {!currentAccount && (
            <a
              href="/jobs"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cari Lowongan
            </a>
          )}
          {currentAccount ? (
            <>
              <a
                href={dashboardLink}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </a>
              <a
                href={profileLink}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Profil
              </a>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block w-full text-left py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-100 my-1" />
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Masuk
              </a>
              <a
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Daftar
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
