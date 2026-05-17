"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronRight, Heart, User } from "lucide-react";
import { cn, getImageUrl, getInitials, parseDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BasicInfoForm } from "@/components/BasicInfoForm";
import { MedicalInfoForm } from "@/components/MedicalInfoForm";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import ProfileCompletion from "@/components/ProfileCompletion";
import PrivacyNote from "@/components/PrivacyNote";
import QuickFacts from "@/components/QuickFacts";
import LastUpdated from "@/components/LastUpdated";

type SectionId = "basic" | "medical";

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "basic",
    label: "Basic Information",
    icon: <User className="h-4 w-4" />,
    description: "Full name, email, phone number",
  },
  {
    id: "medical",
    label: "Medical Information",
    icon: <Heart className="h-4 w-4" />,
    description: "Blood type, chronic conditions, allergies",
  },
];
export default function PatientProfile() {
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const { data, isLoading } = useCurrentProfile();

  const profile = data?.body;
  const patient = profile?.patient;

  const avatarSrc = profile?.pathAvatar ? getImageUrl(profile.pathAvatar) : undefined;
  const initials = getInitials(profile?.fullName ?? "");

  return (
    <div className="flex h-full w-full p-6 md:p-10 flex-1 flex-col">
      <div className="container mx-auto h-full flex-1 flex-col flex overflow-hidden space-y-6">
        {/* ── Hero header ── */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
          {/* Accent band */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-400" />

          <div className="px-6 py-5 flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-background shadow-md">
                <AvatarImage src={avatarSrc} alt={profile?.fullName} />
                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-lg">
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
                  <span className="inline-block h-5 w-40 rounded bg-muted animate-pulse" />
                ) : (
                  (profile?.fullName ?? "Patient")
                )}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {profile?.emailVerified ? (
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

                {patient?.bloodType && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <Heart className="h-3 w-3" />
                    {patient.bloodType}
                  </Badge>
                )}

                {profile?.gender && (
                  <span className="text-xs text-muted-foreground">{profile.gender}</span>
                )}
              </div>
            </div>

            {/* Completion summary — desktop only */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Profile Completion</p>
                <p className="text-2xl font-bold tabular-nums text-foreground leading-tight">
                  {[profile?.emailVerified, profile?.phoneVerified, !!patient].filter(Boolean)
                    .length * 33}
                  %
                </p>
              </div>

              <div className="h-10 w-10 rounded-full border-4 border-blue-100 flex items-center justify-center bg-blue-50">
                <User className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Body: sidebar + content + aside ── */}
        <div className="flex gap-5 items-start flex-1 h-full">
          {/* ── Left sidebar nav ── */}
          <nav className="w-52 shrink-0 sticky top-8 rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
                Personal Profile
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
                    ? "border-l-blue-500 bg-blue-50/60 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                    : "border-l-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    activeSection === item.id
                      ? "text-blue-500"
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
                      ? "text-blue-500 translate-x-0"
                      : "text-transparent group-hover:text-muted-foreground"
                  )}
                />
              </button>
            ))}

            <div className="px-4 py-3 border-t border-border/50 mt-1">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Patient ID:{" "}
                <span className="font-mono font-medium text-foreground">
                  {profile?.id?.slice(0, 8).toUpperCase() ?? "—"}
                </span>
              </p>
            </div>
          </nav>

          <div className="flex-1 min-w-0 h-full">
            {activeSection === "basic" && <BasicInfoForm />}
            {activeSection === "medical" && <MedicalInfoForm />}
          </div>

          <aside className="w-52 shrink-0 sticky top-8 space-y-3">
            <ProfileCompletion
              emailVerified={!!profile?.emailVerified}
              phoneVerified={!!profile?.phoneVerified}
              hasPatient={!!patient}
            />

            <QuickFacts
              gender={profile?.gender}
              dob={profile?.dateOfBirth}
              bloodType={patient?.bloodType}
            />

            <LastUpdated date={parseDate(profile?.updatedAt, "HH:mm:ss dd/MM/yyyy")!} />
            <PrivacyNote />
          </aside>
        </div>
      </div>
    </div>
  );
}
