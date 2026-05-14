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
  date?: string;
  time?: string;
  bookingType?: BOOKING_TYPE;
  reason?: string;
  symptoms?: string;
  notes?: string;

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

  isSubmitted: false,
};

export const useBookingStore = () => {
  const bookingStore = useSWR<BookingState>(BOOKING_STORE_KEY);

  const setBookingState = (newState: Partial<BookingState>) => {
    bookingStore.mutate((prev) => ({ ...prev, ...newState }), false);
  };

  const resetBookingState = () => {
    bookingStore.mutate(initialBookingState, false);
  };

  return { store: bookingStore.data, setBookingState, resetBookingState };
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
