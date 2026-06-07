import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Briefcase className="w-6 h-6 text-blue-400" />
              KarirHub
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Platform rekrutmen digital yang menghubungkan pencari kerja
              berbakat dengan perusahaan terkemuka di Indonesia secara efisien
              dan transparan.
            </p>
            <p className="text-xs mt-4 text-gray-500">
              Final Project — Manajemen Basis Data D<br />
              Teknik Informatika, Institut Teknologi Sepuluh Nopember
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              Pencari Kerja
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/jobs" className="hover:text-white transition-colors">
                  Cari Lowongan
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Daftar Sekarang
                </a>
              </li>
              <li>
                <a
                  href="/seeker/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              Perusahaan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/company/postings/new"
                  className="hover:text-white transition-colors"
                >
                  Pasang Lowongan
                </a>
              </li>
              <li>
                <a
                  href="/company/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Daftar Perusahaan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <span>© 2025 KarirHub. Dibuat untuk keperluan akademik.</span>
        </div>
      </div>
    </footer>
  );
}
