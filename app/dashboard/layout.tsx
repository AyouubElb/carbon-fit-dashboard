import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { ReactQueryProvider } from "@/context/react-query-provider";
import { SidebarProvider } from "@/context/SidebarProvider";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <ReactQueryProvider>
        <SidebarProvider>
          <Sidebar />
          {/* Main content */}
          <div className="min-h-screen w-full flex flex-col min-w-0">
            <Header />

            {/* Page content */}
            <main className="h-full bg-gray-50 p-6 min-w-0">{children}</main>
          </div>
        </SidebarProvider>
      </ReactQueryProvider>
    </div>
  );
}
