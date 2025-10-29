import type { Metadata } from "next";
import StaffBottomNavigation from "@/components/staff/StaffBottomNavigation";

export const metadata: Metadata = {
  title: "Staff Panel - TableTop",
  description: "Professional staff management panel for TableTop restaurant operations",
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Main Content */}
      <main className="">
        {children}
      </main>
      
      {/* Staff Bottom Navigation */}
      <StaffBottomNavigation />
    </div>
  );
}