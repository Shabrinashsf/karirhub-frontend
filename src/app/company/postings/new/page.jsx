import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { skills } from "@/data/skills";
import Sidebar from "@/components/layout/Sidebar";
import { ChevronLeft, Plus, Trash2, CheckCircle } from "lucide-react";

const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Kontrak" },
  { value: "internship", label: "Magang" },
];
const WORK_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

export default function NewPostingPage() {
  const { currentUser } = useApp();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    city: "",
    province: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "full_time",
    workType: "hybrid",
    deadline: "",
  });
  const [stages, setStages] = useState([
    { id: 1, name: "Seleksi Administrasi" },
    { id: 2, name: "Interview HRD" },
  ]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillRequired, setSkillRequired] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addStage = () => {
    const newId = Date.now();
    setStages((prev) => [...prev, { id: newId, name: "" }]);
  };

  const removeStage = (id) => {
    if (stages.length <= 1) return;
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStage = (id, value) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: value } : s)),
    );
  };

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
      const newMap = { ...skillRequired };
      delete newMap[skillId];
      setSkillRequired(newMap);
    } else {
      setSelectedSkills((prev) => [...prev, skillId]);
      setSkillRequired((prev) => ({ ...prev, [skillId]: true }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (!currentUser?.isVerified) {
    return (
      <div className="flex flex-1">
        <Sidebar role="company" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Akun Belum Terverifikasi
            </h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Akun perusahaan Anda perlu diverifikasi oleh Admin KarirHub
              sebelum dapat memposting lowongan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-1">
        <Sidebar role="company" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lowongan Berhasil Dibuat!
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              Lowongan disimpan sebagai draft. Aktifkan untuk mulai menerima
              lamaran.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/company/postings"
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                Kelola Lowongan
              </a>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Buat Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const skillCategories = [...new Set(skills.map((s) => s.category))].filter(
    Boolean,
  );

  return (
    <div className="flex flex-1">
      <Sidebar role="company" />
      <div className="flex-1 p-6 w-full">
        <a
          href="/company/postings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Kelola Lowongan
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Buat Lowongan Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic info */}
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
                  placeholder="e.g. Frontend Engineer"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi Pekerjaan *
                </label>
                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Deskripsikan tanggung jawab dan lingkup pekerjaan..."
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
                  placeholder="Daftar kualifikasi dan persyaratan kandidat..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Klasifikasi</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kota *
                </label>
                <input
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Jakarta Selatan"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Provinsi *
                </label>
                <input
                  name="province"
                  required
                  value={form.province}
                  onChange={handleChange}
                  placeholder="DKI Jakarta"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tipe Pekerjaan *
                </label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  {JOB_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tipe Kerja *
                </label>
                <select
                  name="workType"
                  value={form.workType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  {WORK_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gaji Min (Rp)
                </label>
                <input
                  name="salaryMin"
                  type="number"
                  value={form.salaryMin}
                  onChange={handleChange}
                  placeholder="5000000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gaji Max (Rp)
                </label>
                <input
                  name="salaryMax"
                  type="number"
                  value={form.salaryMax}
                  onChange={handleChange}
                  placeholder="15000000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deadline *
                </label>
                <input
                  name="deadline"
                  type="date"
                  required
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-1">
              Skill yang Dibutuhkan
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Klik skill untuk menambahkan. Toggle untuk wajib/tidak wajib.
            </p>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                {selectedSkills.map((sid) => {
                  const skill = skills.find((s) => s.id === sid);
                  return (
                    <button
                      key={sid}
                      type="button"
                      onClick={() =>
                        setSkillRequired((prev) => ({
                          ...prev,
                          [sid]: !prev[sid],
                        }))
                      }
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${skillRequired[sid] ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-600 border-blue-400"}`}
                    >
                      {skill?.name}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSkill(sid);
                        }}
                        className="opacity-70 hover:opacity-100 ml-0.5"
                      >
                        ×
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="max-h-48 overflow-y-auto">
              {skillCategories.map((cat) => (
                <div key={cat} className="mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    {cat}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills
                      .filter((s) => s.category === cat && !s.deletedAt)
                      .map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => toggleSkill(skill.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${selectedSkills.includes(skill.id) ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-100 text-gray-600 border-gray-200 hover:border-blue-300"}`}
                        >
                          {skill.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stages */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Tahapan Rekrutmen
            </h2>
            <div className="space-y-2">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    value={stage.name}
                    onChange={(e) => updateStage(stage.id, e.target.value)}
                    placeholder={`Tahapan ${idx + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  {stages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStage(stage.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStage}
              className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Plus className="w-4 h-4" /> Tambah Tahapan
            </button>
          </div>

          <div className="flex gap-3 pb-6">
            <a
              href="/company/postings"
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </a>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Simpan sebagai Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
