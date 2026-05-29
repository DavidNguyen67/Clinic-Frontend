"use client";

import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn, getImageUrl } from "@/lib/utils";
import { usePublicSpecialtyById } from "@/hooks/public/usePublicSpecialty";
import { usePublicDoctorList } from "@/hooks/public/usePublicDoctor";
import { DoctorProfileResponse, SpecialtyResponse } from "@/interface/response";
import { SPECIALTY_TYPE } from "@/common";
import {
  Activity,
  BadgeDollarSign,
  Briefcase,
  CalendarDays,
  GraduationCap,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";

const SPECIALTY_TYPE_LABEL: Record<SPECIALTY_TYPE, string> = {
  [SPECIALTY_TYPE.GENERAL]: "General Medicine",
  [SPECIALTY_TYPE.SURGERY]: "Surgery",
  [SPECIALTY_TYPE.PEDIATRICS]: "Pediatrics",
  [SPECIALTY_TYPE.DERMATOLOGY]: "Dermatology",
  [SPECIALTY_TYPE.CARDIOLOGY]: "Cardiology",
  [SPECIALTY_TYPE.ORTHOPEDICS]: "Orthopedics",
  [SPECIALTY_TYPE.NEUROLOGY]: "Neurology",
  [SPECIALTY_TYPE.PSYCHIATRY]: "Psychiatry",
  [SPECIALTY_TYPE.GYNECOLOGY]: "Gynecology",
  [SPECIALTY_TYPE.ENDOCRINOLOGY]: "Endocrinology",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function DoctorCard({
  doctor,
  onBook,
}: {
  doctor: DoctorProfileResponse;
  onBook: (id: string) => void;
}) {
  const { user } = doctor;

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl bg-white",
        "border border-gray-100 hover:border-blue-100",
        "shadow-sm hover:shadow-md transition-all duration-200"
      )}
    >
      <Avatar className="h-14 w-14 shrink-0 ring-2 ring-blue-50">
        <AvatarImage
          src={user.pathAvatar ? getImageUrl(user.pathAvatar) : undefined}
          alt={user.fullName}
        />
        <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
          {getInitials(user.fullName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-snug">{user.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{doctor.doctorCode}</p>
          </div>
          {doctor.isFeatured && (
            <Badge className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] shrink-0">
              Featured
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {doctor.averageRating.toFixed(1)}
            <span className="text-gray-400">({doctor.totalReviews})</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3 text-blue-400" />
            {doctor.totalPatients} patients
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Briefcase className="w-3 h-3 text-purple-400" />
            {doctor.experienceYears} yrs exp
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <GraduationCap className="w-3 h-3 text-green-400" />
            {doctor.degree}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            {formatCurrency(doctor.consultationFee)}
          </span>
          <Button
            size="sm"
            onClick={() => onBook(doctor.id)}
            className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <CalendarDays className="w-3 h-3 mr-1" />
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}

function DoctorCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-gray-100">
      <Skeleton className="h-14 w-14 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-7 w-28 ml-auto" />
      </div>
    </div>
  );
}

// ── Virtual Doctor List ───────────────────────────────────────────────────────

// Estimated height of one DoctorCard + 12px gap below it
const CARD_ESTIMATED_HEIGHT = 118;

function VirtualDoctorList({
  doctors,
  onBook,
}: {
  doctors: DoctorProfileResponse[];
  onBook: (id: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: doctors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_ESTIMATED_HEIGHT,
    overscan: 3,
  });

  return (
    <div ref={parentRef} className="pr-0.5">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${virtualRow.start}px)`,
              paddingBottom: 12,
            }}
          >
            <DoctorCard doctor={doctors[virtualRow.index]} onBook={onBook} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface SpecialtyDialogProps {
  specialtyId?: string;
  onOpenChange: (v: boolean) => void;
}

const SpecialtyDialog = ({ specialtyId, onOpenChange }: SpecialtyDialogProps) => {
  const router = useRouter();

  const specialtyQuery = usePublicSpecialtyById(specialtyId ?? "");
  const doctorQuery = usePublicDoctorList(specialtyId ? { specialtyId, size: 50 } : undefined);

  const specialty: SpecialtyResponse | undefined = specialtyQuery.data?.body ?? undefined;
  const doctors: DoctorProfileResponse[] = doctorQuery.data?.body?.data ?? [];
  const isLoadingSpecialty = specialtyQuery.isLoading;
  const isLoadingDoctors = doctorQuery.isLoading;

  const handleBook = (doctorId: string) => {
    router.push(`/patient/booking?doctorId=${doctorId}&specialtyId=${specialtyId}`);
    onOpenChange(false);
  };

  return (
    <DialogContent className="max-w-lg! w-full p-0 gap-0 overflow-hidden rounded-2xl">
      <DialogHeader className="sr-only">
        <DialogTitle>{specialty?.name ?? "Specialty details"}</DialogTitle>
        <DialogDescription>Specialty information and available doctors</DialogDescription>
      </DialogHeader>

      <div className="relative">
        {isLoadingSpecialty ? (
          <Skeleton className="h-40 w-full rounded-none" />
        ) : specialty ? (
          <div className="relative h-40 w-full overflow-hidden bg-blue-50">
            <Image
              src={getImageUrl(specialty.image)}
              alt={specialty.name}
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-blue-700 border-0 text-xs font-medium backdrop-blur-sm">
                <Activity className="w-3 h-3 mr-1" />
                {SPECIALTY_TYPE_LABEL[specialty.specialtyType] ?? specialty.specialtyType}
              </Badge>
            </div>

            {/* Visual title — aria-hidden since real title is in sr-only DialogHeader */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-lg font-bold leading-snug drop-shadow" aria-hidden>
                {specialty.name}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto h-[60vh] flex flex-col">
        <div className="p-5 space-y-5 flex-1 h-full flex flex-col">
          {/* Description */}
          {isLoadingSpecialty ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          ) : specialty ? (
            <div className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
              <Stethoscope className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <p>{specialty.description}</p>
            </div>
          ) : null}

          <Separator />

          {/* Doctors section */}
          <div className="flex-1 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              Doctors in this specialty
              {!isLoadingDoctors && doctors.length > 0 && (
                <span className="ml-1 text-xs font-normal text-gray-400">
                  ({doctors.length} doctors)
                </span>
              )}
            </h3>

            {isLoadingDoctors ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            ) : doctors.length > 0 ? (
              <VirtualDoctorList doctors={doctors} onBook={handleBook} />
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No doctors available in this specialty
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default SpecialtyDialog;
