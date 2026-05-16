"use client";

import { useRef, useEffect, useState } from "react";
import { CalendarCheck, UserSearch, Bell, ClipboardList, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  activeColor: string;
  border: string;
  activeBorder: string;
};

const STEP_DURATION = 2000;
const DONE_HOLD_DURATION = 1800; // how long the "all done" state shows before reset

const HowItWorksSection = () => {
  const steps = useRef<Step[]>([
    {
      step: "01",
      icon: UserSearch,
      title: "Find a Doctor",
      description:
        "Search by specialty, browse profiles and patient reviews, then pick the best match for your needs.",
      color: "bg-blue-50 text-blue-400",
      activeColor: "bg-blue-100 text-blue-600",
      border: "border-blue-100",
      activeBorder: "border-blue-400",
    },
    {
      step: "02",
      icon: CalendarCheck,
      title: "Book an Appointment",
      description:
        "Pick a date and time that fits the doctor's available slots — confirmed in just a few seconds.",
      color: "bg-teal-50 text-teal-400",
      activeColor: "bg-teal-100 text-teal-600",
      border: "border-teal-100",
      activeBorder: "border-teal-400",
    },
    {
      step: "03",
      icon: Bell,
      title: "Get Confirmation",
      description:
        "Receive instant confirmation via Email or SMS, plus automatic reminders before your visit.",
      color: "bg-violet-50 text-violet-400",
      activeColor: "bg-violet-100 text-violet-600",
      border: "border-violet-100",
      activeBorder: "border-violet-400",
    },
    {
      step: "04",
      icon: ClipboardList,
      title: "Visit & Review",
      description:
        "Arrive on time and be seen in order. After your visit, leave a review to help the community.",
      color: "bg-orange-50 text-orange-400",
      activeColor: "bg-orange-100 text-orange-600",
      border: "border-orange-100",
      activeBorder: "border-orange-400",
    },
  ]);

  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const totalSteps = steps.current.length;
    const tickMs = 16;
    let elapsed = 0;

    const interval = setInterval(() => {
      if (isDone || isResetting) return;

      elapsed += tickMs;
      const pct = Math.min((elapsed / STEP_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= STEP_DURATION) {
        elapsed = 0;
        setActiveStep((prev) => {
          const next = prev + 1;
          if (next >= totalSteps) {
            // All steps done — show done state, then reset
            setIsDone(true);
            setProgress(100);
            setTimeout(() => {
              setIsResetting(true);
              setIsDone(false);
              setTimeout(() => {
                setActiveStep(0);
                setProgress(0);
                setIsResetting(false);
              }, 400); // brief fade-out before restart
            }, DONE_HOLD_DURATION);
            return prev; // stay on last step during done hold
          }
          return next;
        });
        setProgress(0);
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [isDone, isResetting]);

  const totalSteps = steps.current.length;
  const overallPct = isDone ? 100 : ((activeStep + progress / 100) / totalSteps) * 100;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="text-violet-600 border-violet-200 bg-violet-50 mb-3">
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Book an appointment in 4 easy steps
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Just a few simple actions and you have a doctor's appointment — no waiting in line
            required.
          </p>
        </div>

        {/* Steps */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative transition-opacity duration-300",
            isResetting ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Progress track (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] z-0">
            <div className="h-0.5 w-full bg-gray-100 rounded-full" />
            <div
              className="h-0.5 rounded-full absolute top-0 left-0 bg-gradient-to-r from-blue-400 via-teal-400 to-orange-400"
              style={{
                width: `${overallPct}%`,
                transition: isDone ? "width 0.4s ease" : "none",
              }}
            />
          </div>

          {steps.current.map(
            (
              { step, icon: Icon, title, description, color, activeColor, border, activeBorder },
              i
            ) => {
              const isActive = i === activeStep && !isDone;
              const isDoneStep = isDone || i < activeStep;

              return (
                <div
                  key={step}
                  className="flex flex-col items-center text-center gap-4 relative z-10"
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      "w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative",
                      "transition-all duration-500 ease-out",
                      isActive
                        ? `${activeColor} ${activeBorder} scale-110 shadow-lg`
                        : isDoneStep
                          ? `${activeColor} ${activeBorder} shadow-sm`
                          : `${color} ${border}`
                    )}
                  >
                    {/* Done overlay — big checkmark */}
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center rounded-2xl transition-all duration-500",
                        isDone ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      )}
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-500 fill-green-50" />
                    </span>

                    {/* Normal icon */}
                    <Icon
                      className={cn(
                        "w-8 h-8 transition-all duration-500",
                        isDone ? "opacity-0 scale-50" : "opacity-100 scale-100",
                        isActive ? "scale-110" : ""
                      )}
                    />

                    {/* Step number badge */}
                    <span
                      className={cn(
                        "absolute -top-2 -right-2 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shadow-sm transition-all duration-500",
                        isDone
                          ? "bg-green-500 border-green-400 text-white"
                          : isActive || i < activeStep
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-200 text-gray-400"
                      )}
                    >
                      {isDone ? "✓" : step}
                    </span>
                  </div>

                  {/* Per-step progress bar (mobile only) */}
                  {isActive && (
                    <div className="md:hidden w-16 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div>
                    <h3
                      className={cn(
                        "font-semibold mb-1.5 transition-colors duration-500",
                        isDone
                          ? "text-green-600"
                          : isActive
                            ? "text-gray-900"
                            : i < activeStep
                              ? "text-gray-700"
                              : "text-gray-400"
                      )}
                    >
                      {title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm leading-relaxed transition-colors duration-500",
                        isActive || isDoneStep ? "text-gray-500" : "text-gray-300"
                      )}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Overall progress bar (mobile) */}
        <div className="md:hidden mt-6 mx-auto w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full",
              isDone
                ? "bg-green-400 transition-all duration-500"
                : "bg-gradient-to-r from-blue-400 via-teal-400 to-orange-400"
            )}
            style={{ width: `${overallPct}%` }}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl shadow-md"
          >
            <Link href="/patient/booking">Book Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
