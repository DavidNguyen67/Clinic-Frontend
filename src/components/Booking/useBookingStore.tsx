import { BOOKING_TYPE, SPECIALTY_TYPE } from "@/common";
import { BOOKING_STORE_KEY } from "@/hooks";
import { DoctorProfileResponse, SpecialtyResponse } from "@/interface/response";
import {
  HeartPulse,
  Stethoscope,
  Scissors,
  Baby,
  Sparkles,
  Bone,
  Brain,
  Smile,
  Venus,
  Activity,
  LucideIcon,
} from "lucide-react";
import useSWR from "swr";

export type BookingState = {
  specialty?: SpecialtyResponse;
  doctor?: DoctorProfileResponse;
  date?: Date;
  time?: Date;
  bookingType?: BOOKING_TYPE;
  reason?: string;
  symptoms?: string;
  notes?: string;

  step?: number;
  isSubmitted?: boolean;
};

const initialBookingState: BookingState = {
  specialty: undefined,
  doctor: undefined,
  date: undefined,
  time: undefined,
  bookingType: undefined,
  reason: undefined,
  symptoms: undefined,
  notes: undefined,

  step: 0,
  isSubmitted: false,
};

export const SPECIALTY_ICONS: Record<SPECIALTY_TYPE, LucideIcon> = {
  [SPECIALTY_TYPE.GENERAL]: Stethoscope,
  [SPECIALTY_TYPE.SURGERY]: Scissors,
  [SPECIALTY_TYPE.PEDIATRICS]: Baby,
  [SPECIALTY_TYPE.DERMATOLOGY]: Sparkles,
  [SPECIALTY_TYPE.CARDIOLOGY]: HeartPulse,
  [SPECIALTY_TYPE.ORTHOPEDICS]: Bone,
  [SPECIALTY_TYPE.NEUROLOGY]: Brain,
  [SPECIALTY_TYPE.PSYCHIATRY]: Smile,
  [SPECIALTY_TYPE.GYNECOLOGY]: Venus,
  [SPECIALTY_TYPE.ENDOCRINOLOGY]: Activity,
};
export const SPECIALTY_COLORS: Record<SPECIALTY_TYPE, string> = {
  [SPECIALTY_TYPE.GENERAL]:
    "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-300",

  [SPECIALTY_TYPE.SURGERY]:
    "bg-red-50 text-red-500 border-red-100 group-hover:bg-red-100 group-hover:border-red-300",

  [SPECIALTY_TYPE.PEDIATRICS]:
    "bg-orange-50 text-orange-500 border-orange-100 group-hover:bg-orange-100 group-hover:border-orange-300",

  [SPECIALTY_TYPE.DERMATOLOGY]:
    "bg-green-50 text-green-600 border-green-100 group-hover:bg-green-100 group-hover:border-green-300",

  [SPECIALTY_TYPE.CARDIOLOGY]:
    "bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-100 group-hover:border-violet-300",

  [SPECIALTY_TYPE.ORTHOPEDICS]:
    "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-300",

  [SPECIALTY_TYPE.NEUROLOGY]:
    "bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-100 group-hover:border-cyan-300",

  [SPECIALTY_TYPE.PSYCHIATRY]:
    "bg-pink-50 text-pink-500 border-pink-100 group-hover:bg-pink-100 group-hover:border-pink-300",

  [SPECIALTY_TYPE.GYNECOLOGY]:
    "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100 group-hover:border-rose-300",

  [SPECIALTY_TYPE.ENDOCRINOLOGY]:
    "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-300",
};

export const useBookingStore = () => {
  const bookingStore = useSWR<BookingState>(BOOKING_STORE_KEY, null, {
    fallbackData: initialBookingState,
  });

  const setBookingState = (newState: Partial<BookingState>) => {
    bookingStore.mutate(
      (prev) => ({
        ...prev!,
        ...newState,
      }),
      false
    );
  };

  const nextStep = () => {
    setBookingState({ step: (bookingStore.data?.step ?? 0) + 1 });
  };

  const prevStep = () => {
    const currentStep = bookingStore.data?.step ?? 0;
    if (currentStep > 0) setBookingState({ step: currentStep - 1 });
  };

  const submitBooking = () => {
    bookingStore.mutate(
      (prev) => ({
        ...prev!,
        isSubmitted: true,
      }),
      false
    );
  };

  const resetBookingState = () => {
    bookingStore.mutate(initialBookingState, false);
  };

  return {
    store: bookingStore.data,

    setBookingState,

    nextStep,
    prevStep,

    submitBooking,
    resetBookingState,
  };
};
