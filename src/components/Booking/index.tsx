"use client";

import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepSpecialty } from "@/components/Booking/StepSpecialty";
import { StepDoctor } from "@/components/Booking/StepDoctor";
import StepSchedule from "@/components/Booking/StepSchedule";
import { StepReview } from "@/components/Booking/StepReview";
import { StepDetails } from "@/components/Booking/StepDetails";
import StepSuccess from "@/components/Booking/StepSuccess";
import { SPECIALTY_ICONS, useBookingStore } from "@/components/Booking/useBookingStore";
import { cn, formatTime, getImageUrl, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Step metadata ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Specialty", icon: Stethoscope },
  { label: "Doctor", icon: User },
  { label: "Schedule", icon: CalendarDays },
  { label: "Details", icon: FileText },
  { label: "Review", icon: CheckCircle2 },
];

// ─── StepBar (overrides the imported one with a richer design) ─────────────────

function RichStepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center w-full mb-8">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isDone = idx < current;
        const isActive = idx === current;

        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isDone
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                      ? "bg-white border-blue-600 text-blue-600 shadow-sm shadow-blue-100"
                      : "bg-white border-gray-200 text-gray-300"
                )}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap transition-colors duration-200",
                  isActive ? "text-blue-600" : isDone ? "text-blue-400" : "text-gray-300"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-gray-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    idx < current ? "bg-blue-500 w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Booking summary panel ─────────────────────────────────────────────────────

function SummaryRow({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-medium truncate",
            muted ? "text-gray-300 italic font-normal" : "text-gray-800"
          )}
        >
          {value ?? "Chưa chọn"}
        </p>
      </div>
    </div>
  );
}

function AppointmentSummary() {
  const { store } = useBookingStore();

  const doctorName = store?.doctor?.user?.fullName;
  const doctorAvatar = store?.doctor?.user?.pathAvatar
    ? getImageUrl(store.doctor.user.pathAvatar)
    : undefined;
  const rating = store?.doctor?.averageRating;

  const Icon = store?.specialty?.specialtyType
    ? SPECIALTY_ICONS[store.specialty.specialtyType]
    : null;

  return (
    <div className="sticky top-24 space-y-4">
      {store?.doctor ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Selected Doctor
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-blue-50">
              <AvatarImage src={doctorAvatar} alt={doctorName} />
              <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-sm">
                {getInitials(doctorName ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{doctorName}</p>
              {store.specialty && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{store.specialty.name}</p>
              )}
              {rating != null && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder before doctor is chosen */
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">No doctor selected</p>
            <p className="text-xs text-gray-200 mt-0.5">Complete steps 1 &amp; 2</p>
          </div>
        </div>
      )}

      {/* Real-time summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Appointment Summary
        </p>

        <SummaryRow
          icon={Icon ?? Stethoscope}
          label="Specialty"
          value={store?.specialty?.name}
          muted={!store?.specialty}
        />
        <SummaryRow icon={User} label="Doctor" value={doctorName} muted={!store?.doctor} />
        <SummaryRow
          icon={CalendarDays}
          label="Date"
          value={
            store?.date
              ? new Date(store.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : undefined
          }
          muted={!store?.date}
        />
        <SummaryRow
          icon={Clock}
          label="Time"
          value={formatTime(store?.time)}
          muted={!store?.time}
        />
        <SummaryRow icon={FileText} label="Reason" value={store?.reason} muted={!store?.reason} />
      </div>

      {/* Clinic info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Clinic</p>
        <div className="flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">MediCare General Clinic</p>
            <p className="text-xs text-gray-400 mt-0.5">Licensed medical facility</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">123 Le Loi, Hoan Kiem, Hanoi</p>
        </div>
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">Mon – Sat · 08:00 – 17:00</p>
        </div>
        <div className="flex items-start gap-2.5">
          <Phone className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">1900 1234</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const { store, nextStep, submitBooking, prevStep } = useBookingStore();

  const step = store?.step ?? 0;

  const canNext = [
    !!store?.specialty,
    !!store?.doctor,
    !!store?.date && !!store?.time,
    !!store?.reason,
    true,
  ][step];

  const handleNext = () => {
    if (step < 4) nextStep();
    else submitBooking();
  };

  return (
    <div className="min-h-screen bg-gray-50/70">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <CalendarCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Book Appointment</span>
          </div>
          {!store?.isSubmitted && (
            <span className="text-xs text-gray-400 font-medium tabular-nums">
              Step {step + 1} of {STEPS.length}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {store?.isSubmitted ? (
          <StepSuccess />
        ) : (
          <div className="flex gap-8 items-start">
            {/* ── Left: Wizard ── */}
            <div className="flex-1 min-w-0 w-175">
              <RichStepBar current={step} />

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
                {step === 0 && <StepSpecialty />}
                {step === 1 && <StepDoctor />}
                {step === 2 && <StepSchedule />}
                {step === 3 && <StepDetails />}
                {step === 4 && <StepReview />}
              </div>

              {/* ── Nav buttons ── */}
              <div className="flex items-center justify-between mt-5 gap-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                  className="rounded-xl gap-2 min-w-28"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canNext}
                  className="rounded-xl gap-2 min-w-28 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"
                >
                  {step === 4 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Booking
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* ── Right: Summary panel ── */}
            <div className="w-72 shrink-0">
              <AppointmentSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
