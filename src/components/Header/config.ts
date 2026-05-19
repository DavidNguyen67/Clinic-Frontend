import { ROLE_NAME } from "@/common";

export interface NavLink {
  label: string;
  path: string;
  icon: string; // lucide icon name
}

export const ROLE_LABELS: Record<ROLE_NAME, string> = {
  [ROLE_NAME.GUEST]: "Guest",
  [ROLE_NAME.PATIENT]: "Patient",
  [ROLE_NAME.DOCTOR]: "Doctor",
  [ROLE_NAME.ADMIN]: "Admin",
  [ROLE_NAME.STAFF]: "Staff",
};

export const ROLE_BADGE_CLASSES: Record<ROLE_NAME, string> = {
  [ROLE_NAME.GUEST]: "bg-gray-100 text-gray-700",
  [ROLE_NAME.PATIENT]: "bg-blue-100 text-blue-700",
  [ROLE_NAME.DOCTOR]: "bg-green-100 text-green-700",
  [ROLE_NAME.ADMIN]: "bg-purple-100 text-purple-700",
  [ROLE_NAME.STAFF]: "bg-orange-100 text-orange-700",
};

export const ROLE_AVATAR_INITIALS: Record<ROLE_NAME, string> = {
  [ROLE_NAME.GUEST]: "G",
  [ROLE_NAME.PATIENT]: "P",
  [ROLE_NAME.DOCTOR]: "D",
  [ROLE_NAME.ADMIN]: "A",
  [ROLE_NAME.STAFF]: "S",
};

export const ROLE_DEFAULT_PATHS: Record<ROLE_NAME, string> = {
  [ROLE_NAME.GUEST]: "/",
  [ROLE_NAME.PATIENT]: "/patient",
  [ROLE_NAME.DOCTOR]: "/doctor",
  [ROLE_NAME.ADMIN]: "/admin",
  [ROLE_NAME.STAFF]: "/staff",
};

export const PROFILE_PATH: Partial<Record<ROLE_NAME, string>> = {
  [ROLE_NAME.PATIENT]: "/patient/profile",
  [ROLE_NAME.DOCTOR]: "/doctor/profile",
  [ROLE_NAME.STAFF]: "/staff/profile",
};

export const NAV_LINKS: Record<ROLE_NAME, NavLink[]> = {
  [ROLE_NAME.GUEST]: [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Doctors", path: "/doctors", icon: "Stethoscope" },
    { label: "Services", path: "/services/general", icon: "LayoutGrid" },
    { label: "FAQ", path: "/faq", icon: "CircleHelp" },
  ],
  [ROLE_NAME.PATIENT]: [
    { label: "Home", path: "/", icon: "LayoutDashboard" },
    { label: "Book Appointment", path: "/patient/booking", icon: "Calendar" },
    { label: "My Appointments", path: "/patient/appointments", icon: "ClipboardList" },
    { label: "Messages", path: "/patient/messages", icon: "MessageSquare" },
  ],
  [ROLE_NAME.DOCTOR]: [
    { label: "Dashboard", path: "/doctor", icon: "LayoutDashboard" },
    { label: "Appointments", path: "/doctor/appointments", icon: "Calendar" },
    { label: "Patients", path: "/doctor/patients", icon: "User" },
    { label: "Schedule", path: "/doctor/schedule", icon: "ClipboardList" },
  ],
  [ROLE_NAME.ADMIN]: [
    { label: "Dashboard", path: "/admin", icon: "LayoutDashboard" },
    { label: "Users", path: "/admin/users", icon: "Users" },
    { label: "Services", path: "/admin/services", icon: "Wrench" },
    { label: "Reports", path: "/admin/reports", icon: "BarChart2" },
  ],
  [ROLE_NAME.STAFF]: [
    { label: "Dashboard", path: "/staff", icon: "LayoutDashboard" },
    { label: "Appointments", path: "/staff/appointments", icon: "Calendar" },
    { label: "Check-in", path: "/staff/checkin", icon: "UserCheck" },
    { label: "Invoices", path: "/staff/invoices", icon: "Package" },
  ],
};
