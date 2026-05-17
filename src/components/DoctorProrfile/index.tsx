"use client";

import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  BriefcaseMedical,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Star,
  User,
} from "lucide-react";
import { cn, getImageUrl, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";
import ProfessionalCard from "@/components/DoctorProrfile/ProfessionalCard";
import DoctorStats from "@/components/DoctorProrfile/DoctorStats";
import { BasicInfoForm } from "@/components/BasicInfoForm";
import { ProfessionalInfoForm } from "@/components/DoctorProrfile/ProfessionalInfoForm";
import { BioEducationForm } from "@/components/DoctorProrfile/BioEducationForm";
import { ReviewsStatsView } from "@/components/DoctorProrfile/ReviewsStatsView";
import { FeeForm } from "@/components/DoctorProrfile/FeeForm";

function PlaceholderForm({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-8 flex flex-col items-center justify-center gap-3 min-h-[320px] text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        <BriefcaseMedical className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground max-w-xs">
        This form is under construction. Replace this component with the real form.
      </p>
    </div>
  );
}

type SectionId = "basic" | "professional" | "bio" | "fee" | "reviews";

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
    description: "Name, email, phone number",
  },
  {
    id: "professional",
    label: "Professional Info",
    icon: <BriefcaseMedical className="h-4 w-4" />,
    description: "Specialty, degree, experience",
  },
  {
    id: "bio",
    label: "Bio & Education",
    icon: <BookOpen className="h-4 w-4" />,
    description: "About me, education background",
  },
  {
    id: "fee",
    label: "Fee & Schedule",
    icon: <CalendarClock className="h-4 w-4" />,
    description: "Consultation fee, availability",
  },
  {
    id: "reviews",
    label: "Reviews & Stats",
    icon: <Star className="h-4 w-4" />,
    description: "Ratings, patients, reviews",
  },
];

export default function DoctorProfile() {
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const currentProfile = useCurrentProfile();

  const isLoading = currentProfile.isLoading;

  const profile = currentProfile?.data?.body;
  const user = profile;
  const doctor = profile?.doctor;

  const avatarSrc = user?.pathAvatar ? getImageUrl(user.pathAvatar) : undefined;
  const initials = getInitials(user?.fullName ?? "");

  const completionItems = [
    !!user?.emailVerified,
    !!user?.phoneVerified,
    !!profile?.doctor?.bio,
    !!profile?.doctor?.specialty,
  ];
  const completionPct = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <div className="flex h-full w-full p-6 md:p-10 flex-1 flex-col">
      <div className="container mx-auto h-full flex-1 flex-col flex overflow-hidden space-y-6">
        {/* ── Hero header ── */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
          {/* Accent band — teal/cyan to distinguish from patient (blue) */}
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400" />

          <div className="px-6 py-5 flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-background shadow-md">
                <AvatarImage src={avatarSrc} alt={user?.fullName} />
                <AvatarFallback className="bg-teal-50 text-teal-600 font-semibold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {isLoading ? (
                  <span className="inline-block h-5 w-48 rounded bg-muted animate-pulse" />
                ) : (
                  `Dr. ${user?.fullName ?? "Doctor"}`
                )}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {/* Email verification */}
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

                {/* Specialty */}
                {doctor?.specialty?.name && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50"
                  >
                    <BriefcaseMedical className="h-3 w-3" />
                    {doctor.specialty.name}
                  </Badge>
                )}

                {/* Featured */}
                {doctor?.isFeatured && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                  >
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Featured
                  </Badge>
                )}

                {/* Degree */}
                {doctor?.degree && (
                  <span className="text-xs text-muted-foreground">{doctor.degree}</span>
                )}
              </div>
            </div>

            {/* Completion + rating — desktop only */}
            <div className="hidden lg:flex items-center gap-6 shrink-0 divide-x divide-border/60">
              {/* Rating */}
              <div className="text-right pr-6">
                <p className="text-xs text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold tabular-nums text-foreground leading-tight">
                  {doctor?.averageRating?.toFixed(1) ?? "—"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {doctor?.totalReviews ?? 0} reviews
                </p>
              </div>

              {/* Completion */}
              <div className="text-right pl-6">
                <p className="text-xs text-muted-foreground">Profile Completion</p>
                <p className="text-2xl font-bold tabular-nums text-foreground leading-tight">
                  {completionPct}%
                </p>
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
                Doctor Profile
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
                    ? "border-l-teal-500 bg-teal-50/60 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400"
                    : "border-l-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    activeSection === item.id
                      ? "text-teal-500"
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
                      ? "text-teal-500 translate-x-0"
                      : "text-transparent group-hover:text-muted-foreground"
                  )}
                />
              </button>
            ))}

            <div className="px-4 py-3 border-t border-border/50 mt-1">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Doctor ID:{" "}
                <span className="font-mono font-medium text-foreground">
                  {doctor?.doctorCode ?? doctor?.id?.slice(0, 8).toUpperCase() ?? "—"}
                </span>
              </p>
            </div>
          </nav>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 h-full">
            {activeSection === "basic" && <BasicInfoForm />}
            {activeSection === "professional" && <ProfessionalInfoForm />}
            {activeSection === "bio" && <BioEducationForm />}
            {activeSection === "fee" && <FeeForm />}
            {activeSection === "reviews" && <ReviewsStatsView />}
          </div>

          {/* ── Right aside ── */}
          <aside className="w-52 shrink-0 sticky top-8 space-y-3">
            <DoctorStats />

            <ProfessionalCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
