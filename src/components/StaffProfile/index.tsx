"use client";

import { useState } from "react";
import { AlertCircle, Briefcase, CheckCircle2, ChevronRight, User } from "lucide-react";
import { cn, formatDate, getImageUrl, getInitials, parseDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BasicInfoForm } from "@/components/BasicInfoForm";
import { QuickActionsCard } from "@/components/StaffProfile/QuickActionsCard";
import NumberFlow from "@number-flow/react";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import { StaffInfoForm } from "@/components/StaffProfile/StaffInfoForm";

// ── Types ─────────────────────────────────────────────────────────────────────

type SectionId = "basic" | "professional";

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// ── Nav config.ts ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    id: "basic",
    label: "Basic Information",
    icon: <User className="h-4 w-4" />,
    description: "Name, email, phone number",
  },
  {
    id: "professional",
    label: "Professional Info",
    icon: <Briefcase className="h-4 w-4" />,
    description: "Position, department, hire date",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StaffProfile() {
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const { data, isLoading } = useCurrentProfile();

  const user = data?.body;
  const staff = user?.staff;

  const avatarSrc = getImageUrl(user?.pathAvatar);
  const initials = getInitials(user?.fullName);

  const completionItems = [
    !!user?.emailVerified,
    !!user?.phoneVerified,
    !!staff?.position,
    !!staff?.department,
    !!staff?.hireDate,
  ];
  const completionPct = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <div className="flex h-full w-full p-6 md:p-10 flex-1 flex-col">
      <div className="container mx-auto h-full flex-1 flex-col flex overflow-hidden space-y-6">
        {/* ── Hero header ───────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
          {/* Indigo accent band — distinguishes staff from doctor (teal) */}
          <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-indigo-400 to-violet-400" />

          <div className="px-6 py-5 flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-background shadow-md">
                <AvatarImage src={avatarSrc} alt={user?.fullName} />
                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {isLoading ? (
                  <span className="inline-block h-5 w-48 rounded bg-muted animate-pulse" />
                ) : (
                  (user?.fullName ?? "Staff Member")
                )}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {/* Email verification badge */}
                {user?.emailVerified ? (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Email
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Email Not Verified
                  </Badge>
                )}

                {/* Position */}
                {staff?.position && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                  >
                    <Briefcase className="h-3 w-3" />
                    {staff.position}
                  </Badge>
                )}

                {/* Department */}
                {staff?.department && (
                  <span className="text-xs text-muted-foreground">{staff.department}</span>
                )}
              </div>
            </div>

            {/* Hire date + completion — desktop only */}
            <div className="hidden lg:flex items-center gap-6 shrink-0 divide-x divide-border/60">
              {/* Hire date */}
              {staff?.hireDate && (
                <div className="text-right pr-6">
                  <p className="text-xs text-muted-foreground">Hire Date</p>
                  <p className="text-base font-semibold tabular-nums text-foreground leading-tight mt-0.5">
                    {formatDate(parseDate(staff.hireDate, "HH:mm:ss dd/MM/yyyy"))}
                  </p>
                </div>
              )}

              {/* Completion */}
              <div className="text-right pl-6">
                <p className="text-xs text-muted-foreground">Profile Completion</p>
                <p className="text-2xl font-bold tabular-nums text-foreground leading-tight">
                  <NumberFlow value={Number(completionPct ?? 0)} />%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body: sidebar + content + aside ───────────────────────────────── */}
        <div className="flex gap-5 items-start flex-1 h-full">
          {/* ── Left sidebar nav ──────────────────────────────────────────── */}
          <nav className="w-52 shrink-0 sticky top-8 rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
                Staff Profile
              </p>
            </div>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group",
                  "border-l-2",
                  activeSection === item.id
                    ? "border-l-indigo-500 bg-indigo-50/60 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400"
                    : "border-l-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    activeSection === item.id
                      ? "text-indigo-500"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {item.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-all",
                    activeSection === item.id
                      ? "text-indigo-500 translate-x-0"
                      : "text-transparent group-hover:text-muted-foreground"
                  )}
                />
              </button>
            ))}

            {/* Staff code footer */}
            <div className="px-4 py-3 border-t border-border/50 mt-1">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Staff ID:{" "}
                <span className="font-mono font-medium text-foreground">
                  {staff?.staffCode ?? "—"}
                </span>
              </p>
            </div>
          </nav>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 h-full">
            {activeSection === "basic" && <BasicInfoForm />}
            {activeSection === "professional" && <StaffInfoForm />}
          </div>

          {/* ── Right aside ───────────────────────────────────────────────── */}
          <aside className="w-52 shrink-0 sticky top-8 space-y-3">
            <QuickActionsCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
