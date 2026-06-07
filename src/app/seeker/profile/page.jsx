import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  educations as seedEducations,
  workExperiences as seedExperiences,
  jobSeekerSkills as seedSkills,
} from "@/data/job-seekers";
import { skills as allSkills } from "@/data/skills";
import Sidebar from "@/components/layout/Sidebar";
import SkillBadge from "@/components/shared/SkillBadge";
import {
  User,
  GraduationCap,
  Briefcase,
  Zap,
  Edit2,
  Plus,
  Calendar,
  MapPin,
  Phone,
  Trash2,
  X,
  Check,
  Home,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

/* ─── localStorage helpers ─── */
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const TABS = [
  { id: "identity", label: "Identitas", icon: User },
  { id: "education", label: "Pendidikan", icon: GraduationCap },
  { id: "experience", label: "Pengalaman", icon: Briefcase },
  { id: "skills", label: "Skill", icon: Zap },
];

const DEGREES = ["SMA", "D3", "S1", "S2", "S3"];
const SKILL_LEVELS = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Mahir" },
];

/* ─── empty forms ─── */
const emptyEdu = {
  institution: "",
  degree: "S1",
  fieldOfStudy: "",
  startYear: new Date().getFullYear() - 4,
  endYear: new Date().getFullYear(),
  isOngoing: false,
  gpa: "",
};

const emptyExp = {
  companyName: "",
  position: "",
  startDate: "",
  endDate: "",
  isOngoing: false,
  description: "",
};

const emptySkill = {
  skillId: "",
  level: "beginner",
};

export default function SeekerProfilePage() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("identity");

  /* Identity editing */
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({});

  /* Education CRUD */
  const [educations, setEducations] = useState([]);
  const [eduForm, setEduForm] = useState(null); // null | object (add) | { _id, ... } (edit)
  const [eduFormData, setEduFormData] = useState(emptyEdu);

  /* Experience CRUD */
  const [experiences, setExperiences] = useState([]);
  const [expForm, setExpForm] = useState(null);
  const [expFormData, setExpFormData] = useState(emptyExp);

  /* Skills CRUD */
  const [seekerSkills, setSeekerSkills] = useState([]);
  const [skillForm, setSkillForm] = useState(null);
  const [skillFormData, setSkillFormData] = useState(emptySkill);

  /* ─── load from localStorage / seed ─── */
  useEffect(() => {
    if (!currentUser) return;

    const pKey = `karirhub_profile_${currentUser.id}`;
    const storedProfile = lsGet(pKey, {});
    setIdentityForm({
      fullName: storedProfile.fullName ?? currentUser.fullName ?? "",
      phone: storedProfile.phone ?? currentUser.phone ?? "",
      birthDate: storedProfile.birthDate ?? currentUser.birthDate ?? "",
      gender: storedProfile.gender ?? currentUser.gender ?? "",
      address: storedProfile.address ?? currentUser.address ?? "",
      city: storedProfile.city ?? currentUser.city ?? "",
      province: storedProfile.province ?? currentUser.province ?? "",
      bio: storedProfile.bio ?? currentUser.bio ?? "",
    });

    const eKey = `karirhub_educations_${currentUser.id}`;
    const storedEdu = lsGet(eKey, null);
    if (storedEdu) setEducations(storedEdu);
    else {
      const seeded = seedEducations.filter(
        (e) => e.jobSeekerId === currentUser.id && !e.deletedAt,
      );
      setEducations(seeded);
      lsSet(eKey, seeded);
    }

    const xKey = `karirhub_experiences_${currentUser.id}`;
    const storedExp = lsGet(xKey, null);
    if (storedExp) setExperiences(storedExp);
    else {
      const seeded = seedExperiences.filter(
        (e) => e.jobSeekerId === currentUser.id && !e.deletedAt,
      );
      setExperiences(seeded);
      lsSet(xKey, seeded);
    }

    const sKey = `karirhub_skills_${currentUser.id}`;
    const storedSkills = lsGet(sKey, null);
    if (storedSkills) setSeekerSkills(storedSkills);
    else {
      const seeded = seedSkills.filter(
        (s) => s.jobSeekerId === currentUser.id && !s.deletedAt,
      );
      setSeekerSkills(seeded);
      lsSet(sKey, seeded);
    }
  }, [currentUser]);

  /* ─── Identity handlers ─── */
  const saveIdentity = () => {
    if (!currentUser) return;
    lsSet(`karirhub_profile_${currentUser.id}`, identityForm);
    setEditingIdentity(false);
  };

  const mergedUser = currentUser
    ? { ...currentUser, ...lsGet(`karirhub_profile_${currentUser.id}`, {}) }
    : null;

  /* ─── Education handlers ─── */
  const openAddEdu = () => {
    setEduFormData(emptyEdu);
    setEduForm({ _mode: "add" });
  };
  const openEditEdu = (item) => {
    setEduFormData({
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      startYear: item.startYear,
      endYear: item.endYear ?? new Date().getFullYear(),
      isOngoing: item.isOngoing,
      gpa: item.gpa ?? "",
    });
    setEduForm({ _mode: "edit", _id: item.id });
  };
  const cancelEdu = () => setEduForm(null);
  const saveEdu = () => {
    if (!currentUser) return;
    const payload = {
      ...eduFormData,
      gpa: eduFormData.gpa ? parseFloat(eduFormData.gpa) : null,
    };
    let next;
    if (eduForm._mode === "add") {
      const newItem = {
        id: `edu-${Date.now()}`,
        jobSeekerId: currentUser.id,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      next = [...educations, newItem];
    } else {
      next = educations.map((e) =>
        e.id === eduForm._id ? { ...e, ...payload, updatedAt: new Date().toISOString() } : e,
      );
    }
    setEducations(next);
    lsSet(`karirhub_educations_${currentUser.id}`, next);
    setEduForm(null);
  };
  const deleteEdu = (id) => {
    if (!currentUser) return;
    if (!confirm("Hapus data pendidikan ini?")) return;
    const next = educations.filter((e) => e.id !== id);
    setEducations(next);
    lsSet(`karirhub_educations_${currentUser.id}`, next);
  };

  /* ─── Experience handlers ─── */
  const openAddExp = () => {
    setExpFormData(emptyExp);
    setExpForm({ _mode: "add" });
  };
  const openEditExp = (item) => {
    setExpFormData({
      companyName: item.companyName,
      position: item.position,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      isOngoing: item.isOngoing,
      description: item.description ?? "",
    });
    setExpForm({ _mode: "edit", _id: item.id });
  };
  const cancelExp = () => setExpForm(null);
  const saveExp = () => {
    if (!currentUser) return;
    let next;
    if (expForm._mode === "add") {
      const newItem = {
        id: `exp-${Date.now()}`,
        jobSeekerId: currentUser.id,
        ...expFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      next = [...experiences, newItem];
    } else {
      next = experiences.map((e) =>
        e.id === expForm._id ? { ...e, ...expFormData, updatedAt: new Date().toISOString() } : e,
      );
    }
    setExperiences(next);
    lsSet(`karirhub_experiences_${currentUser.id}`, next);
    setExpForm(null);
  };
  const deleteExp = (id) => {
    if (!currentUser) return;
    if (!confirm("Hapus pengalaman kerja ini?")) return;
    const next = experiences.filter((e) => e.id !== id);
    setExperiences(next);
    lsSet(`karirhub_experiences_${currentUser.id}`, next);
  };

  /* ─── Skills handlers ─── */
  const openAddSkill = () => {
    setSkillFormData(emptySkill);
    setSkillForm({ _mode: "add" });
  };
  const openEditSkill = (item) => {
    setSkillFormData({
      skillId: item.skillId,
      level: item.level,
    });
    setSkillForm({ _mode: "edit", _id: item.id });
  };
  const cancelSkill = () => setSkillForm(null);
  const saveSkill = () => {
    if (!currentUser) return;
    let next;
    if (skillForm._mode === "add") {
      const newItem = {
        id: `jss-${Date.now()}`,
        jobSeekerId: currentUser.id,
        ...skillFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      next = [...seekerSkills, newItem];
    } else {
      next = seekerSkills.map((s) =>
        s.id === skillForm._id ? { ...s, ...skillFormData, updatedAt: new Date().toISOString() } : s,
      );
    }
    setSeekerSkills(next);
    lsSet(`karirhub_skills_${currentUser.id}`, next);
    setSkillForm(null);
  };
  const deleteSkill = (id) => {
    if (!currentUser) return;
    if (!confirm("Hapus skill ini?")) return;
    const next = seekerSkills.filter((s) => s.id !== id);
    setSeekerSkills(next);
    lsSet(`karirhub_skills_${currentUser.id}`, next);
  };

  if (!currentUser)
    return (
      <div className="p-8 text-center text-gray-500">
        Silakan masuk terlebih dahulu.
      </div>
    );

  return (
    <div className="flex flex-1">
      <Sidebar role="job_seeker" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
            <p className="text-gray-500 text-sm">
              Kelola informasi profil Anda
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === id
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ─── Identity tab ─── */}
        {activeTab === "identity" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-5 mb-6">
              <div className="relative">
                <img
                  src={
                    mergedUser.profileImg ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${mergedUser.fullName}`
                  }
                  alt={mergedUser.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {mergedUser.fullName}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {mergedUser.city &&
                    `${mergedUser.city}, ${mergedUser.province}`}
                </p>
              </div>
            </div>

            {editingIdentity ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveIdentity();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Lengkap", key: "fullName", type: "text" },
                    { label: "Nomor Telepon", key: "phone", type: "tel" },
                    { label: "Tanggal Lahir", key: "birthDate", type: "date" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={identityForm[key] || ""}
                        onChange={(e) =>
                          setIdentityForm((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Jenis Kelamin
                    </label>
                    <select
                      value={identityForm.gender || ""}
                      onChange={(e) =>
                        setIdentityForm((p) => ({ ...p, gender: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      <option value="">Pilih</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Alamat
                    </label>
                    <input
                      type="text"
                      value={identityForm.address || ""}
                      onChange={(e) =>
                        setIdentityForm((p) => ({ ...p, address: e.target.value }))
                      }
                      placeholder="Jl. Mawar No. 12, Rt 03/Rw 05"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  {[
                    { label: "Kota", key: "city", type: "text" },
                    { label: "Provinsi", key: "province", type: "text" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={identityForm[key] || ""}
                        onChange={(e) =>
                          setIdentityForm((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={identityForm.bio || ""}
                    onChange={(e) =>
                      setIdentityForm((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-4 h-4" /> Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIdentity(false)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      label: "Nama Lengkap",
                      value: mergedUser.fullName,
                      icon: User,
                    },
                    {
                      label: "Nomor Telepon",
                      value: mergedUser.phone || "-",
                      icon: Phone,
                    },
                    {
                      label: "Tanggal Lahir",
                      value: mergedUser.birthDate
                        ? formatDate(mergedUser.birthDate)
                        : "-",
                      icon: Calendar,
                    },
                    {
                      label: "Jenis Kelamin",
                      value:
                        mergedUser.gender === "male"
                          ? "Laki-laki"
                          : mergedUser.gender === "female"
                            ? "Perempuan"
                            : "-",
                      icon: User,
                    },
                    {
                      label: "Alamat",
                      value: mergedUser.address || "-",
                      icon: Home,
                    },
                    {
                      label: "Kota",
                      value: mergedUser.city || "-",
                      icon: MapPin,
                    },
                    {
                      label: "Provinsi",
                      value: mergedUser.province || "-",
                      icon: MapPin,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        {label}
                      </label>
                      <div className="flex items-center gap-2 text-gray-800 text-sm">
                        <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="break-words">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {mergedUser.bio && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Bio
                    </label>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {mergedUser.bio}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setEditingIdentity(true)}
                  className="mt-5 flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profil
                </button>
              </>
            )}
          </div>
        )}

        {/* ─── Education tab ─── */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Riwayat Pendidikan
              </h2>
              {!eduForm && (
                <button
                  onClick={openAddEdu}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              )}
            </div>

            {/* Education form */}
            {eduForm && (
              <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  {eduForm._mode === "add"
                    ? "Tambah Pendidikan"
                    : "Edit Pendidikan"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Institusi
                    </label>
                    <input
                      type="text"
                      value={eduFormData.institution}
                      onChange={(e) =>
                        setEduFormData((p) => ({ ...p, institution: e.target.value }))
                      }
                      placeholder="Nama universitas / sekolah"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Gelar
                    </label>
                    <select
                      value={eduFormData.degree}
                      onChange={(e) =>
                        setEduFormData((p) => ({ ...p, degree: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      {DEGREES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bidang Studi
                    </label>
                    <input
                      type="text"
                      value={eduFormData.fieldOfStudy}
                      onChange={(e) =>
                        setEduFormData((p) => ({ ...p, fieldOfStudy: e.target.value }))
                      }
                      placeholder="Contoh: Teknik Informatika"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tahun Mulai
                    </label>
                    <input
                      type="number"
                      value={eduFormData.startYear}
                      onChange={(e) =>
                        setEduFormData((p) => ({
                          ...p,
                          startYear: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tahun Selesai
                    </label>
                    <input
                      type="number"
                      value={eduFormData.endYear}
                      onChange={(e) =>
                        setEduFormData((p) => ({
                          ...p,
                          endYear: parseInt(e.target.value) || 0,
                        }))
                      }
                      disabled={eduFormData.isOngoing}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      id="edu-ongoing"
                      type="checkbox"
                      checked={eduFormData.isOngoing}
                      onChange={(e) =>
                        setEduFormData((p) => ({ ...p, isOngoing: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="edu-ongoing" className="text-sm text-gray-700">
                      Masih berlangsung
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      IPK (opsional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={eduFormData.gpa}
                      onChange={(e) =>
                        setEduFormData((p) => ({ ...p, gpa: e.target.value }))
                      }
                      placeholder="3.50"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveEdu}
                    disabled={!eduFormData.institution.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" /> Simpan
                  </button>
                  <button
                    onClick={cancelEdu}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                </div>
              </div>
            )}

            {educations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center">
                <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Belum ada riwayat pendidikan
                </p>
              </div>
            ) : (
              educations.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {edu.institution}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {edu.degree} · {edu.fieldOfStudy}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {edu.startYear} –{" "}
                        {edu.isOngoing ? "Sekarang" : edu.endYear}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-500 mt-1">
                          IPK:{" "}
                          <strong className="text-gray-700">
                            {Number(edu.gpa).toFixed(2)}
                          </strong>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditEdu(edu)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEdu(edu.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── Experience tab ─── */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Riwayat Pengalaman Kerja
              </h2>
              {!expForm && (
                <button
                  onClick={openAddExp}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              )}
            </div>

            {/* Experience form */}
            {expForm && (
              <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  {expForm._mode === "add"
                    ? "Tambah Pengalaman Kerja"
                    : "Edit Pengalaman Kerja"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama Perusahaan
                    </label>
                    <input
                      type="text"
                      value={expFormData.companyName}
                      onChange={(e) =>
                        setExpFormData((p) => ({ ...p, companyName: e.target.value }))
                      }
                      placeholder="Nama perusahaan"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Posisi / Jabatan
                    </label>
                    <input
                      type="text"
                      value={expFormData.position}
                      onChange={(e) =>
                        setExpFormData((p) => ({ ...p, position: e.target.value }))
                      }
                      placeholder="Contoh: Frontend Developer"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={expFormData.startDate}
                      onChange={(e) =>
                        setExpFormData((p) => ({ ...p, startDate: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={expFormData.endDate}
                      onChange={(e) =>
                        setExpFormData((p) => ({ ...p, endDate: e.target.value }))
                      }
                      disabled={expFormData.isOngoing}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      id="exp-ongoing"
                      type="checkbox"
                      checked={expFormData.isOngoing}
                      onChange={(e) =>
                        setExpFormData((p) => ({ ...p, isOngoing: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="exp-ongoing" className="text-sm text-gray-700">
                      Masih bekerja di sini
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Deskripsi (opsional)
                    </label>
                    <textarea
                      value={expFormData.description}
                      onChange={(e) =>
                        setExpFormData((p) => ({ ...p, description: e.target.value }))
                      }
                      rows={3}
                      placeholder="Jelaskan tugas dan pencapaian Anda..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveExp}
                    disabled={!expFormData.companyName.trim() || !expFormData.position.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" /> Simpan
                  </button>
                  <button
                    onClick={cancelExp}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                </div>
              </div>
            )}

            {experiences.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Belum ada riwayat pengalaman kerja
                </p>
              </div>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-sm text-blue-600 mt-0.5">
                        {exp.companyName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(exp.startDate)} –{" "}
                        {exp.isOngoing
                          ? "Sekarang"
                          : exp.endDate
                            ? formatDate(exp.endDate)
                            : "-"}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditExp(exp)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExp(exp.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── Skills tab ─── */}
        {activeTab === "skills" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Skill Saya</h2>
              {!skillForm && (
                <button
                  onClick={openAddSkill}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah Skill
                </button>
              )}
            </div>

            {/* Skill form */}
            {skillForm && (
              <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  {skillForm._mode === "add" ? "Tambah Skill" : "Edit Skill"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Skill
                    </label>
                    <select
                      value={skillFormData.skillId}
                      onChange={(e) =>
                        setSkillFormData((p) => ({ ...p, skillId: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      <option value="">Pilih skill</option>
                      {allSkills.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Level
                    </label>
                    <select
                      value={skillFormData.level}
                      onChange={(e) =>
                        setSkillFormData((p) => ({ ...p, level: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      {SKILL_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveSkill}
                    disabled={!skillFormData.skillId}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" /> Simpan
                  </button>
                  <button
                    onClick={cancelSkill}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              {seekerSkills.length === 0 ? (
                <div className="py-8 text-center">
                  <Zap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Belum ada skill yang ditambahkan
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {seekerSkills.map((jss) => {
                    const skill = allSkills.find((s) => s.id === jss.skillId);
                    return skill ? (
                      <button
                        key={jss.id}
                        onClick={() => openEditSkill(jss)}
                        className="group relative"
                      >
                        <SkillBadge
                          skillName={skill.name}
                          level={jss.level}
                          showLevel
                        />
                        <span className="absolute -top-1 -right-1 hidden group-hover:flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-[10px]">
                          <Trash2
                            className="w-2.5 h-2.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSkill(jss.id);
                            }}
                          />
                        </span>
                      </button>
                    ) : null;
                  })}
                </div>
              )}
              <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mr-2">
                  Pemula
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 mr-2">
                  Menengah
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                  Mahir
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
