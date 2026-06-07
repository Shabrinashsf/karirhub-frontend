import {
  Bell,
  Briefcase,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  Star,
  User,
  Users,
} from "lucide-react";

const seekerLinks = [
  { href: "/seeker/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari Lowongan", icon: Search },
  { href: "/seeker/profile", label: "Profil Saya", icon: User },
  {
    href: "/seeker/applications",
    label: "Riwayat Lamaran",
    icon: ClipboardList,
  },
];

const companyLinks = [
  { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari Lowongan", icon: Search },
  { href: "/company/postings", label: "Kelola Lowongan", icon: Briefcase },
  { href: "/company/profile", label: "Profil Perusahaan", icon: Settings },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari Lowongan", icon: Search },
  { href: "/admin/profile", label: "Profil Admin", icon: User },
  { href: "/admin/verify", label: "Verifikasi Perusahaan", icon: Shield },
  { href: "/admin/skills", label: "Kelola Skill", icon: Star },
  { href: "/admin/activity", label: "Pantau Aktivitas", icon: Users },
];

export default function Sidebar({ role }) {
  const links =
    role === "job_seeker"
      ? seekerLinks
      : role === "company"
        ? companyLinks
        : adminLinks;

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:block">
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            currentPath === href || currentPath.startsWith(href + "/");
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                {label}
              </div>
              {isActive && <ChevronRight className="w-3 h-3 text-blue-400" />}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
