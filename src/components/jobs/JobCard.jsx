import { MapPin, Clock, Briefcase, DollarSign, Building2 } from "lucide-react";
import {
  formatSalary,
  jobTypeLabel,
  workTypeLabel,
  formatDate,
} from "@/lib/utils";
import { companies } from "@/data/companies";
import StatusBadge from "@/components/shared/StatusBadge";

export default function JobCard({ job, showStatus = false }) {
  const company = companies.find((c) => c.id === job.companyId);

  const workTypeColor =
    {
      remote: "bg-green-100 text-green-700",
      onsite: "bg-orange-100 text-orange-700",
      hybrid: "bg-purple-100 text-purple-700",
    }[job.workType] || "bg-gray-100 text-gray-600";

  const jobTypeColor =
    {
      full_time: "bg-blue-100 text-blue-700",
      part_time: "bg-yellow-100 text-yellow-700",
      contract: "bg-red-100 text-red-700",
      internship: "bg-pink-100 text-pink-700",
    }[job.jobType] || "bg-gray-100 text-gray-600";

  return (
    <a
      href={`/jobs/${job.id}`}
      className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <img
          src={
            company?.logoUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${company?.name}`
          }
          alt={company?.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-tight">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {company?.name}
                {company?.isVerified && (
                  <span className="text-blue-500 text-xs">✓</span>
                )}
              </p>
            </div>
            {showStatus && <StatusBadge status={job.status} />}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${jobTypeColor}`}
            >
              {jobTypeLabel(job.jobType)}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${workTypeColor}`}
            >
              {workTypeLabel(job.workType)}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            {(job.city || job.province) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.city}
                {job.city && job.province ? ", " : ""}
                {job.province}
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Deadline: {formatDate(job.deadline)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
