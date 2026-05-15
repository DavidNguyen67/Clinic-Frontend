"use client";

import { BOOKING_TYPE } from "@/common";
import { useBookingStore } from "@/components/Booking/useBookingStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function StepDetails() {
  const { store, setBookingState } = useBookingStore();

  const bookingTypeOptions = useRef([
    {
      value: BOOKING_TYPE.ONLINE,
      label: "Online Consultation",
      desc: "Video call from anywhere",
    },
    {
      value: BOOKING_TYPE.WALK_IN,
      label: "In-person Visit",
      desc: "At the clinic",
    },
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
        <p className="text-sm text-gray-400 mt-1">
          Help the doctor prepare by sharing some information
        </p>
      </div>

      {/* Booking type */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Appointment Type</Label>
        <RadioGroup
          value={store?.bookingType}
          onValueChange={(val) => setBookingState({ bookingType: val as BOOKING_TYPE })}
          className="grid grid-cols-2 gap-3"
        >
          {bookingTypeOptions.current.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={opt.value}
              className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                store?.bookingType === opt.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <RadioGroupItem value={opt.value} id={opt.value} className="mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
          Reason for Visit <span className="text-red-400">*</span>
        </Label>
        <Input
          id="reason"
          placeholder="e.g. Annual check-up, chest pain, follow-up..."
          value={store?.reason ?? ""}
          onChange={(e) => setBookingState({ reason: e.target.value })}
          className="rounded-xl border-gray-200 focus-visible:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms" className="text-sm font-semibold text-gray-700">
          Current Symptoms
        </Label>
        <Textarea
          id="symptoms"
          placeholder="Describe any symptoms you're experiencing..."
          value={store?.symptoms ?? ""}
          onChange={(e) => setBookingState({ symptoms: e.target.value })}
          rows={3}
          className="rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Allergies, current medications, or anything else the doctor should know..."
          value={store?.notes ?? ""}
          onChange={(e) => setBookingState({ notes: e.target.value })}
          rows={2}
          className="rounded-xl border-gray-200 focus-visible:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
