import { useState } from "react";
import { skills as allSkills } from "@/data/skills";
import Sidebar from "@/components/layout/Sidebar";
import { Plus, Edit2, XCircle, Search, CheckCircle } from "lucide-react";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState(allSkills);
  const [search, setSearch] = useState("");
  const [deactivated, setDeactivated] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);

  const categories = [
    ...new Set(allSkills.map((s) => s.category).filter(Boolean)),
  ];

  const filtered = skills.filter((s) => {
    const q = search.toLowerCase();
    return (
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.category || "").toLowerCase().includes(q)
    );
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    const skill = {
      id: `skill-new-${Date.now()}`,
      name: newSkill.name.trim(),
      category: newSkill.category || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    setSkills((prev) => [...prev, skill]);
    setNewSkill({ name: "", category: "" });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeactivate = (id) => {
    setDeactivated((prev) => [...prev, id]);
  };

  return (
    <div className="flex flex-1">
      <Sidebar role="admin" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kelola Master Skill
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {skills.length} skill terdaftar
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Skill
          </button>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4" /> Skill berhasil ditambahkan!
          </div>
        )}

        {/* Add skill form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
            <h2 className="font-semibold text-gray-900 mb-3">
              Tambah Skill Baru
            </h2>
            <form onSubmit={handleAddSkill} className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nama Skill *
                </label>
                <input
                  type="text"
                  required
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Go Lang"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="w-48">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Kategori
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Tambah
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau kategori skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Skills table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium">Nama Skill</th>
                <th className="text-left py-3 px-4 font-medium">Kategori</th>
                <th className="text-center py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((skill) => {
                const isDeactivated =
                  deactivated.includes(skill.id) || !!skill.deletedAt;
                return (
                  <tr
                    key={skill.id}
                    className={`hover:bg-gray-50 transition-colors ${isDeactivated ? "opacity-50" : ""}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {skill.name}
                    </td>
                    <td className="py-3 px-4">
                      {skill.category ? (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {skill.category}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isDeactivated ? (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          Nonaktif
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {!isDeactivated && (
                          <button
                            onClick={() => handleDeactivate(skill.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
