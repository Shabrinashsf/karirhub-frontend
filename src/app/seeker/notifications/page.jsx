import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { notifications as allNotifs } from "@/data/notifications";
import Sidebar from "@/components/layout/Sidebar";
import { Bell, CheckCheck } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function SeekerNotificationsPage() {
  const { currentAccount } = useApp();
  const [readIds, setReadIds] = useState([]);

  const myNotifs = allNotifs
    .filter((n) => n.accountId === currentAccount?.id && !n.deletedAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const markAllRead = () => {
    setReadIds(myNotifs.filter((n) => !n.isRead).map((n) => n.id));
  };

  const markRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const unreadCount = myNotifs.filter(
    (n) => !n.isRead && !readIds.includes(n.id),
  ).length;

  return (
    <div className="flex flex-1">
      <Sidebar role="job_seeker" />
      <div className="flex-1 p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-blue-600 font-medium">{unreadCount}</span>{" "}
                belum dibaca
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors font-medium"
            >
              <CheckCheck className="w-4 h-4" /> Tandai semua dibaca
            </button>
          )}
        </div>

        <div className="space-y-3">
          {myNotifs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Tidak ada notifikasi</p>
            </div>
          ) : (
            myNotifs.map((n) => {
              const isRead = n.isRead || readIds.includes(n.id);
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                    !isRead
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!isRead ? "bg-blue-600" : "bg-gray-200"}`}
                    >
                      <Bell
                        className={`w-4 h-4 ${!isRead ? "text-white" : "text-gray-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-semibold ${!isRead ? "text-blue-900" : "text-gray-800"}`}
                        >
                          {n.title}
                        </p>
                        {!isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDateTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
