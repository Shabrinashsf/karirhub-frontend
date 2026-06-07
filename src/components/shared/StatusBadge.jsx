import { statusLabel } from "@/lib/utils";

const colorMap = {
  // Application status
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  hired: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-600 border-gray-200",
  // Job posting status
  draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  expired: "bg-red-100 text-red-600 border-red-200",
  // Stage status
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  passed: "bg-green-100 text-green-700 border-green-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  // Interview status
  scheduled: "bg-indigo-100 text-indigo-700 border-indigo-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
  rescheduled: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function StatusBadge({ status, className = "" }) {
  const color = colorMap[status] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}
