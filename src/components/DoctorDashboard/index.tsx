import { DashboardTopBar } from "@/components/DoctorDashboard/DashboardTopBar";
import { StatsSection } from "@/components/DoctorDashboard/StatsSection";
import { AppointmentChart } from "@/components/DoctorDashboard/AppointmentChart";
import { NotificationsPanel } from "@/components/DoctorDashboard/NotificationsPanel";
import { WeeklySummaryBar } from "@/components/DoctorDashboard/WeeklySummaryBar";

export default function DoctorDashboard() {
  return (
    <div className="flex h-full w-full flex-1 flex-col bg-gray-50/60">
      <DashboardTopBar />

      <div className="flex-1 px-6 md:px-8 py-6 space-y-6">
        <StatsSection />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Chart — 2/3 width */}
          <div className="xl:col-span-2">
            <AppointmentChart />
          </div>

          {/* Notifications — 1/3 width */}
          <NotificationsPanel />
        </div>

        <WeeklySummaryBar />
      </div>
    </div>
  );
}
