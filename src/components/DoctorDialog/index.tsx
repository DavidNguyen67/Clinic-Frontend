"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, formatNumber, getImageUrl } from "@/lib/utils";
import { usePublicDoctorById } from "@/hooks/public/usePublicDoctor";
import { DoctorProfileResponse } from "@/interface/response";
import {
  Activity,
  BadgeDollarSign,
  Briefcase,
  CalendarDays,
  GraduationCap,
  MessageCircle,
  Star,
  Stethoscope,
  Users,
  BookOpen,
  FileText,
} from "lucide-react";

// ── Stat Item ─────────────────────────────────────────────────────────────────

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50">
      <div className="text-blue-500">{icon}</div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  );
}

// ── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-blue-400 mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function DoctorDialogSkeleton() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}

// ── Main Dialog ───────────────────────────────────────────────────────────────

interface DoctorDialogProps {
  doctorId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const DoctorDialog = ({ doctorId, open, onOpenChange }: DoctorDialogProps) => {
  const router = useRouter();

  const { data, isLoading } = usePublicDoctorById(doctorId ?? "");
  const doctor: DoctorProfileResponse | undefined = data?.body ?? undefined;
  const user = doctor?.user;

  const handleBook = () => {
    router.push(`/booking?doctorId=${doctorId}`);
    onOpenChange(false);
  };

  const handleMessage = () => {
    router.push(`/messages?doctorId=${doctorId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden rounded-2xl">
        {/* sr-only header — required by shadcn for a11y */}
        <DialogHeader className="sr-only">
          <DialogTitle>{user?.fullName ?? "Doctor details"}</DialogTitle>
          <DialogDescription>Doctor profile, experience, and booking options</DialogDescription>
        </DialogHeader>

        {/* Hero banner */}
        <div className="relative h-28 bg-gradient-to-br from-blue-500 to-teal-400">
          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute top-6 -right-2 w-16 h-16 rounded-full bg-white/10" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[65vh]">
          {isLoading ? (
            <DoctorDialogSkeleton />
          ) : doctor && user ? (
            <div className="p-5 space-y-5">
              {/* Avatar + name row — overlaps the hero banner */}
              <div className="flex gap-4 -mt-14">
                {/* Avatar */}
                <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden ring-4 ring-white bg-blue-50 shadow-md">
                  <Image
                    src={getImageUrl(user.pathAvatar)}
                    alt={user.fullName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name + meta */}
                <div className="pt-8 min-w-0">
                  <p className="font-bold text-gray-900 text-base leading-snug">
                    {doctor.degree}. {user.fullName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{doctor.doctorCode}</p>
                  <Badge className="mt-1.5 bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-medium">
                    <Activity className="w-2.5 h-2.5 mr-1" />
                    {doctor.specialty.name}
                  </Badge>
                </div>
              </div>

              {/* Rating highlight */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.round(doctor.averageRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    )}
                  />
                ))}
                <span className="text-sm font-semibold text-gray-700 ml-1">
                  {formatNumber(doctor.averageRating)}
                </span>
                <span className="text-xs text-gray-400">
                  ({formatNumber(doctor.totalReviews)} reviews)
                </span>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                <StatItem
                  icon={<Users className="w-4 h-4" />}
                  label="Patients"
                  value={formatNumber(doctor.totalPatients)}
                />
                <StatItem
                  icon={<Briefcase className="w-4 h-4" />}
                  label="Experience"
                  value={`${doctor.experienceYears} yrs`}
                />
                <StatItem
                  icon={<BadgeDollarSign className="w-4 h-4" />}
                  label="Consult fee"
                  value={formatCurrency(doctor.consultationFee)}
                />
              </div>

              <Separator />

              {/* Details */}
              <div className="space-y-3">
                <InfoRow
                  icon={<GraduationCap className="w-4 h-4" />}
                  label="Education"
                  value={doctor.education}
                />
                <InfoRow
                  icon={<Stethoscope className="w-4 h-4" />}
                  label="Specialty type"
                  value={doctor.specialty.name}
                />
                {doctor.bio && (
                  <InfoRow
                    icon={<FileText className="w-4 h-4" />}
                    label="About"
                    value={doctor.bio}
                  />
                )}
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="flex gap-3 pb-1">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50"
                  onClick={handleMessage}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleBook}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Book
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDialog;
