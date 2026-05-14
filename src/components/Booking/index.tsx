"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepSpecialty } from "@/components/Booking/StepSpecialty";
import { StepDoctor } from "@/components/Booking/StepDoctor";
import { StepBar } from "@/components/Booking/StepBar";
import StepSchedule from "@/components/Booking/StepSchedule";
import { StepReview } from "@/components/Booking/StepReview";
import { StepDetails } from "@/components/Booking/StepDetails";
import StepSuccess from "@/components/Booking/StepSuccess";
import { SPECIALTY_ICONS, useBookingStore } from "@/components/Booking/useBookingStore";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(0);

  const { store, setBookingState } = useBookingStore();

  const canNext = [
    !!store?.specialty,
    !!store?.doctor,
    !!store?.date && !!store?.time,
    !!store?.reason,
    true,
  ][step];

  const handleNext = () => {
    if (step < 4) setStep((s) => s + 1);
    else {
      setBookingState({ isSubmitted: true });
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const Icon = SPECIALTY_ICONS[store?.specialty?.specialtyType!] ?? undefined;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">Book Appointment</span>
          </div>
          {!store?.isSubmitted && (
            <span className="text-xs text-gray-400 font-medium">Step {step + 1} of 5</span>
          )}
        </div>
      </div>

      <div className="w-2xl mx-auto px-4 py-8">
        {store?.isSubmitted ? (
          <StepSuccess />
        ) : (
          <>
            <StepBar current={step} />

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              {step === 0 && <StepSpecialty />}
              {step === 1 && <StepDoctor />}
              {step === 2 && <StepSchedule />}
              {step === 3 && <StepDetails />}
              {step === 4 && <StepReview />}
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-5 gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
                className="rounded-xl gap-2 min-w-24"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>

              {/* Mini summary pill */}
              {store?.specialty && step > 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-600 font-medium max-w-[200px] truncate">
                    {Icon && <Icon className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{store.specialty.name}</span>
                    {store.doctor && (
                      <>
                        <ChevronRight className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {store.doctor.user.fullName.split(" ").slice(-1)[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleNext}
                disabled={!canNext}
                className="rounded-xl gap-2 min-w-24 bg-blue-600 hover:bg-blue-700"
              >
                {step === 4 ? (
                  "Confirm Booking"
                ) : (
                  <>
                    Next <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
