import { createContext, useContext, useState } from "react";
import { accounts } from "@/data/accounts";
import { jobSeekers } from "@/data/job-seekers";
import { companies } from "@/data/companies";
import { admins } from "@/data/accounts";

const STORAGE_KEY = "karirhub_session";

const AppContext = createContext(null);

function getStoredSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.accountId && parsed?.role) return parsed;
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

function setStoredSession(accountId, role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ accountId, role }),
  );
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function AppProvider({ children }) {
  const stored = typeof window !== "undefined" ? getStoredSession() : null;
  const [activeRole, setActiveRole] = useState(stored?.role ?? null);
  const [currentAccountId, setCurrentAccountId] = useState(
    stored?.accountId ?? null,
  );

  const currentAccount =
    accounts.find((a) => a.id === currentAccountId) || null;

  let currentUser = null;
  if (currentAccount) {
    if (currentAccount.role === "job_seeker") {
      currentUser =
        jobSeekers.find((s) => s.accountId === currentAccountId) || null;
    } else if (currentAccount.role === "company") {
      currentUser =
        companies.find((c) => c.accountId === currentAccountId) || null;
    } else if (currentAccount.role === "admin") {
      currentUser =
        admins.find((a) => a.accountId === currentAccountId) || null;
    }
  }

  const login = (accountId) => {
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      setCurrentAccountId(accountId);
      setActiveRole(account.role);
      setStoredSession(accountId, account.role);
    }
  };

  const logout = () => {
    setCurrentAccountId(null);
    setActiveRole(null);
    clearStoredSession();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AppContext.Provider
      value={{ activeRole, currentAccount, currentUser, login, logout }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
