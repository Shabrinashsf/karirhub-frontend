import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LayoutContent({ children }) {
  const { activeRole, currentAccount } = useApp();
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const isDashboardRoute =
    pathname.startsWith("/seeker/") ||
    pathname.startsWith("/company/") ||
    pathname.startsWith("/admin/");

  const showBottomNav = currentAccount && isDashboardRoute && activeRole;

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${showBottomNav ? "pb-16 md:pb-0" : ""}`}>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-[100dvh]">{children}</main>
      <Footer />
      {showBottomNav && <MobileBottomNav role={activeRole} />}
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <LayoutContent>{children}</LayoutContent>
      </AppProvider>
    </QueryClientProvider>
  );
}
