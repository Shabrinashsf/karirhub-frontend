import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  User,
  ClipboardList,
  Briefcase,
  Settings,
  Shield,
  Star,
  Users,
} from "lucide-react";

const seekerLinks = [
  { href: "/seeker/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari", icon: Search },
  { href: "/seeker/applications", label: "Lamaran", icon: ClipboardList },
  { href: "/seeker/profile", label: "Profil", icon: User },
];

const companyLinks = [
  { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari", icon: Search },
  { href: "/company/postings", label: "Lowongan", icon: Briefcase },
  { href: "/company/profile", label: "Profil", icon: Settings },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Cari", icon: Search },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/activity", label: "Aktivitas", icon: Users },
];

export default function MobileBottomNav({ role }) {
  const links =
    role === "job_seeker"
      ? seekerLinks
      : role === "company"
        ? companyLinks
        : adminLinks;

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            currentPath === href || currentPath.startsWith(href + "/");
          return (
            <a
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2 px-3 flex-1 min-w-0 ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
