"use client";

import { Check, Stethoscope, User, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Specialty", icon: Stethoscope },
  { label: "Doctor", icon: User },
  { label: "Schedule", icon: Calendar },
  { label: "Details", icon: FileText },
  { label: "Review", icon: CheckCircle2 },
];

export function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 select-none">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : active
                      ? "bg-white border-blue-600 text-blue-600 shadow-md shadow-blue-100"
                      : "bg-gray-50 border-gray-200 text-gray-300"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium hidden sm:block",
                  active ? "text-blue-600" : done ? "text-gray-500" : "text-gray-300"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-10 sm:w-16 h-px mx-1 mb-4 transition-all duration-500",
                  i < current ? "bg-blue-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
