import { skillLevelLabel } from "@/lib/utils";

export default function SkillBadge({
  skillName,
  level,
  isRequired,
  showLevel = false,
}) {
  if (isRequired !== undefined) {
    // For job posting skills
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
          isRequired
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-blue-600 border-blue-400"
        }`}
      >
        {skillName}
        {isRequired && <span className="ml-0.5 opacity-80">✦</span>}
      </span>
    );
  }

  // For job seeker skills with level
  const levelColor =
    {
      beginner: "bg-slate-100 text-slate-600 border-slate-200",
      intermediate: "bg-indigo-100 text-indigo-700 border-indigo-200",
      advanced: "bg-violet-100 text-violet-700 border-violet-200",
    }[level] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${levelColor}`}
    >
      {skillName}
      {showLevel && (
        <span className="opacity-70">· {skillLevelLabel(level)}</span>
      )}
    </span>
  );
}
