"use client";

import { Link } from "@/i18n/navigation";
import { Plus, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APPOINTMENT_TAB } from "@/components/Appointments/config";
import TabContent from "@/components/Appointments/TabContent";
import StatCard from "@/components/Appointments/StatCard";
import { usePatientAppointmentStats } from "@/hooks/patient/usePatientAppointment";
import NextAppointmentBanner from "@/components/Appointments/NextAppointmentBanner";

const MyAppointmentsPage = () => {
  const stats = usePatientAppointmentStats();

  return (
    <div className="container mx-auto h-full flex-1 flex-col flex overflow-hidden">
      <div className="grid grid-cols-12 gap-4 h-full overflow-hidden flex-1">
        <div className="col-span-4 flex-1 h-full overflow-hidden flex-col">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My appointments</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your upcoming and past doctor visits
              </p>
            </div>
            <Button asChild>
              <Link href="/patient/booking">
                <Plus className="h-4 w-4 mr-1.5" /> Book appointment
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              label="Upcoming"
              value={stats?.data?.body?.upcomingCount ?? 0}
              icon={<Clock className="h-4 w-4" />}
              variant="info"
            />
            <StatCard
              label="Completed"
              value={stats?.data?.body?.completedCount ?? 0}
              icon={<CheckCircle className="h-4 w-4" />}
              variant="success"
            />
            <StatCard
              label="Cancelled"
              value={stats?.data?.body?.cancelledCount ?? 0}
              icon={<XCircle className="h-4 w-4" />}
              variant="danger"
            />
            <StatCard
              label="Pending"
              value={stats?.data?.body?.pendingCount ?? 0}
              icon={<Clock className="h-4 w-4" />}
              variant="warning"
            />
            <StatCard
              className="col-span-2! flex"
              label="Total visits"
              value={stats?.data?.body?.todayCount ?? 0}
              icon={<Calendar className="h-4 w-4" />}
              variant="default"
            />
          </div>

          <NextAppointmentBanner />
        </div>

        <div className="col-span-8 flex-1 h-full overflow-x-hidden flex-col overflow-y-auto">
          <Tabs defaultValue="upcoming" className="flex flex-1 h-full">
            <TabsList className="mb-4 h-9">
              {Object.values(APPOINTMENT_TAB).map((tab) => (
                <TabsTrigger key={tab} value={tab} className="text-xs">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.values(APPOINTMENT_TAB).map((tab) => (
              <TabsContent key={tab} value={tab}>
                <TabContent tab={tab} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
