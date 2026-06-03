import React, { useRef, useState } from "react";
import { Video, Clock, Phone, MapPin, Calendar } from "lucide-react";
import {
  AFTERNOON_SLOTS,
  MORNING_SLOTS,
} from "@/components/Booking/StepSchedule/TimePicker/config";
import { usePublicDoctorScheduleExceptions } from "@/hooks/public/usePublicDoctorSchedule";
import { useParams } from "next/navigation";
import { cn, formatDate, formatDateToApi, formatDateToWeekday, parseDate } from "@/lib/utils";
import { DAY_STATUS, EXCEPTION_TYPE } from "@/common";
import { isBefore, isSameDay, set } from "date-fns";
import { DAY_STATUS_CONFIG } from "@/components/Doctor/BookingCard/config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingCardProps {}
const BookingCard: React.FC<BookingCardProps> = ({}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Đặt lịch khám</h3>

      {/* Pricing */}
      {/*<PricingSection pricing={pricing} />*/}

      {/* Working Schedule */}
      <WorkingSchedule />

      {/* Time Slots Preview */}
      <TimeSlotsPreview />

      {/*/!* CTA Buttons *!/*/}
      {/*<CTAButtons onBookAppointment={onBookAppointment} onVideoCall={onVideoCall} />*/}

      {/*/!* Location *!/*/}
      {/*<LocationInfo location={location} />*/}

      {/*/!* Contact *!/*/}
      {/*<ContactInfo hotline={hotline} />*/}
    </div>
  );
};
export default BookingCard;
// Sub-components
// const PricingSection: React.FC<{ pricing: Pricing }> = ({ pricing }) => (
//   <div className="mb-6 space-y-3">
//     <div className="flex justify-between items-center">
//       <span className="text-gray-600">Khám tại phòng khám</span>
//       <span className="text-xl font-bold text-blue-600">
//         {pricing.consultation.toLocaleString()}đ
//       </span>
//     </div>
//   </div>
// );

const workingHours = [
  `${MORNING_SLOTS[0].start} – ${MORNING_SLOTS.at(-1)!.end}`,
  `${AFTERNOON_SLOTS[0].start} – ${AFTERNOON_SLOTS.at(-1)!.end}`,
].join(" | ");

const WorkingSchedule: React.FC = () => {
  const { doctorProfileId } = useParams<{ doctorProfileId: string }>();
  const today = useRef(new Date());

  const startOfWeek = new Date(today.current);
  startOfWeek.setDate(today.current.getDate() - today.current.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  const workingDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    set(d, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    return d;
  });

  const scheduleExceptions = usePublicDoctorScheduleExceptions({
    doctorId: doctorProfileId,

    from: formatDateToApi(startOfWeek),
    to: formatDateToApi(endOfWeek),
  });

  const getDayStatus = (date: Date): DAY_STATUS => {
    if (isBefore(date, today.current)) return DAY_STATUS.DISABLED;

    const exception = scheduleExceptions.data?.body?.data?.find((e) =>
      isSameDay(parseDate(e.exceptionDate, "dd/MM/yyyy")!, date)
    );

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      return exception?.type === EXCEPTION_TYPE.EXTRA ? DAY_STATUS.OVERTIME : DAY_STATUS.DISABLED;
    }

    return exception?.type === EXCEPTION_TYPE.LEAVE ? DAY_STATUS.LEAVE : DAY_STATUS.AVAILABLE;
  };

  return (
    <div className="mb-6">
      <div className="text-sm font-semibold text-gray-900 mb-3">Lịch làm việc</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {workingDays.map((day, i) => {
          const status = getDayStatus(day);
          const config = DAY_STATUS_CONFIG[status];
          const isToday = isSameDay(day, today.current);

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold transition-colors select-none",
                    config.className,
                    isToday && "ring-2 ring-offset-1 ring-blue-400"
                  )}
                >
                  {formatDateToWeekday(day)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p className="text-muted-foreground">{config.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="w-5 h-5" />
        <span>{workingHours}</span>
      </div>
    </div>
  );
};

const TimeSlotsPreview: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="text-sm font-semibold text-gray-900 mb-3">Khung giờ hôm nay</div>
      <div className="grid grid-cols-2 gap-2">
        {MORNING_SLOTS.map((slot, i) => (
          <button
            key={i}
            className={`py-2 px-3 rounded-lg text-sm font-semibold transition bg-green-100 text-green-700 hover:bg-green-200`}
          >
            {slot.label}
          </button>
        ))}
        {AFTERNOON_SLOTS.map((slot, i) => (
          <button
            key={i}
            className={`py-2 px-3 rounded-lg text-sm font-semibold transition bg-green-100 text-green-700 hover:bg-green-200`}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const CTAButtons: React.FC<{
  onBookAppointment: () => void;
  onVideoCall: () => void;
}> = ({ onBookAppointment, onVideoCall }) => (
  <div className="space-y-3 mb-6">
    <button
      onClick={onBookAppointment}
      className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold hover:shadow-lg transition"
    >
      <Calendar className="inline w-5 h-5 mr-2" />
      Đặt lịch ngay
    </button>
    <button
      onClick={onVideoCall}
      className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition"
    >
      <Video className="inline w-5 h-5 mr-2" />
      Tư vấn video
    </button>
  </div>
);

const LocationInfo: React.FC<{ location: string }> = ({ location }) => (
  <div className="pt-6 border-t">
    <div className="flex items-start gap-3">
      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-1">Địa điểm khám</div>
        <div className="text-sm text-gray-600">{location}</div>
      </div>
    </div>
  </div>
);

const ContactInfo: React.FC<{ hotline: string }> = ({ hotline }) => (
  <div className="mt-4">
    <div className="flex items-center gap-3">
      <Phone className="w-5 h-5 text-blue-600" />
      <a href={`tel:${hotline}`} className="text-sm text-blue-600 font-semibold hover:underline">
        Hotline: {hotline}
      </a>
    </div>
  </div>
);

// components/doctor/sidebar/TimeSlotPicker.tsx
// export const TimeSlotPicker: React.FC<{
//   slots: TimeSlot[];
//   selectedSlot: string | null;
//   onSelectSlot: (time: string) => void;
// }> = ({ slots, selectedSlot, onSelectSlot }) => {
//   return (
//     <div className="grid grid-cols-3 gap-3">
//       {slots.map((slot, i) => (
//         <button
//           key={i}
//           disabled={!slot.available}
//           onClick={() => slot.available && onSelectSlot(slot.time)}
//           className={`py-3 px-4 rounded-lg text-sm font-semibold transition ${
//             selectedSlot === slot.time
//               ? "bg-blue-600 text-white"
//               : slot.available
//                 ? "bg-green-100 text-green-700 hover:bg-green-200"
//                 : "bg-gray-100 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {slot.time}
//         </button>
//       ))}
//     </div>
//   );
// };
