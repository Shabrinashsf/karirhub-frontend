import { useState } from "react";
import { jobPostings } from "@/data/jobs";
import Sidebar from "@/components/layout/Sidebar";
import { ChevronLeft, CheckCircle } from "lucide-react";

export default function EditPostingPage({ params }) {
  const { id } = params;
  const job = jobPostings.find((j) => j.id === id);

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    city: job?.city || "",
    province: job?.province || "",
    salaryMin: job?.salaryMin || "",
    salaryMax: job?.salaryMax || "",
    jobType: job?.jobType || "full_time",
    workType: job?.workType || "hybrid",
    deadline: job?.deadline || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  if (!job) {
    return (
      <div className="flex flex-1">
        <Sidebar role="company" />
        <div className="flex-1 p-8 text-center">
          <h2 className="font-bold text-gray-900">Lowongan tidak ditemukan</h2>
          <a
            href="/company/postings"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            ← Kembali
          </a>
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex flex-1">
        <Sidebar role="company" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Lowongan Berhasil Diperbarui!
            </h2>
            <div className="flex gap-3 justify-center mt-4">
              <a
                href={`/company/postings/${id}`}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                Lihat Detail
              </a>
              <a
                href="/company/postings"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Kelola Lowongan
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <a
          href={`/company/postings/${id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Detail Lowongan
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Lowongan</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Informasi Dasar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Judul Posisi *
                </label>
                <input
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi *
                </label>
                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Persyaratan
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Detail</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kota
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Provinsi
                </label>
                <input
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gaji Min
                </label>
                <input
                  name="salaryMin"
                  type="number"
                  value={form.salaryMin}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gaji Max
                </label>
                <input
                  name="salaryMax"
                  type="number"
                  value={form.salaryMax}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deadline
                </label>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-6">
            <a
              href={`/company/postings/${id}`}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
            >
              Batal
            </a>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
