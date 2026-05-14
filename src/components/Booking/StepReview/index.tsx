"use client";

import { Star, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BOOKING_TYPE } from "@/common";
import { useBookingStore } from "@/components/Booking/useBookingStore";
import { getInitials } from "@/lib/utils";

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <span className="text-sm text-gray-400 shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
  </div>
);

export function StepReview() {
  const { store } = useBookingStore();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review Your Appointment</h2>
        <p className="text-sm text-gray-400 mt-1">Please confirm all details before booking</p>
      </div>

      <Card className="border border-gray-100 rounded-2xl shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="w-14 h-14 rounded-xl shrink-0">
            <AvatarImage src={store?.doctor?.user.pathAvatar ?? undefined} />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-400 to-teal-400 text-white font-bold text-lg">
              {getInitials(store?.doctor?.user.fullName!)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{store?.doctor?.user.fullName}</p>
            <p className="text-xs text-gray-400">
              {store?.doctor?.specialty.name} · {store?.doctor?.degree}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-gray-600">
                {store?.doctor?.averageRating}
              </span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-lg font-bold text-blue-600">
              {store?.doctor?.consultationFee.toLocaleString("vi-VN")}₫
            </p>
            <p className="text-xs text-gray-400">Consultation fee</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 rounded-2xl shadow-sm">
        <CardContent className="p-4 divide-y divide-gray-50">
          <ReviewRow label="Specialty" value={store?.specialty?.name ?? "-"} />
          <ReviewRow label="Date" value={store?.date || "-"} />
          <ReviewRow label="Time" value={store?.time || "-"} />
          <ReviewRow
            label="Type"
            value={
              store?.bookingType === BOOKING_TYPE.ONLINE ? "Online Consultation" : "In-person Visit"
            }
          />
          <ReviewRow label="Reason" value={store?.reason || "-"} />
          {store?.symptoms && <ReviewRow label="Symptoms" value={store?.symptoms} />}
          {store?.notes && <ReviewRow label="Notes" value={store?.notes} />}
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
        <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          You'll receive a confirmation via Email and SMS after booking. Please arrive 10 minutes
          early for your appointment.
        </p>
      </div>
    </div>
  );
}
