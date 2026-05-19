"use client";

import { AppointmentTopBar } from "@/components/DoctorAppointments/AppointmentTopBar";
import { AppointmentSidebar } from "@/components/DoctorAppointments/AppointmentSidebar";
import { AppointmentList } from "@/components/DoctorAppointments/AppointmentList";

export default function StaffAppointments() {
  return (
    <div className="flex h-full w-full flex-1 flex-col bg-gray-50/60">
      <AppointmentTopBar />

      <div className="flex flex-1 overflow-hidden h-full">
        <AppointmentSidebar />
        <AppointmentList />
      </div>
    </div>
  );
}
