import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { recruitmentStages } from "@/data/jobs";
import { applicationStageHistories } from "@/data/applications";
import { formatDate } from "@/lib/utils";

function StageIcon({ status }) {
  if (status === "passed")
    return <CheckCircle className="w-6 h-6 text-green-500" />;
  if (status === "failed") return <XCircle className="w-6 h-6 text-red-500" />;
  if (status === "pending") return <Clock className="w-6 h-6 text-blue-500" />;
  return <Circle className="w-6 h-6 text-gray-300" />;
}

export default function StageTimeline({ jobPostingId, applicationId }) {
  const stages = recruitmentStages
    .filter((s) => s.jobPostingId === jobPostingId && !s.deletedAt)
    .sort((a, b) => a.stageOrder - b.stageOrder);

  const histories = applicationStageHistories.filter(
    (h) => h.applicationId === applicationId && !h.deletedAt,
  );

  return (
    <div className="space-y-0">
      {stages.map((stage, idx) => {
        const history = histories.find((h) => h.stageId === stage.id);
        const isLast = idx === stages.length - 1;

        return (
          <div key={stage.id} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div className="mt-1">
                <StageIcon status={history?.status} />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 mt-1 mb-0 min-h-[32px] ${
                    history?.status === "passed"
                      ? "bg-green-200"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-800">
                  {stage.stageOrder}. {stage.stageName}
                </span>
                {history && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      history.status === "passed"
                        ? "bg-green-100 text-green-700"
                        : history.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {history.status === "passed"
                      ? "Lolos"
                      : history.status === "failed"
                        ? "Tidak Lolos"
                        : "Menunggu"}
                  </span>
                )}
              </div>
              {history?.movedAt && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(history.movedAt)}
                </p>
              )}
              {history?.notes && (
                <p className="text-xs text-gray-600 mt-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  {history.notes}
                </p>
              )}
              {!history && (
                <p className="text-xs text-gray-400 mt-0.5">Belum dimulai</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
