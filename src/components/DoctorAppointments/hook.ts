import useSWR from "swr";
import {
  APPOINTMENT_SWR_KEY,
  DOCTOR_APPOINTMENTS_SWR_KEY,
  DOCTOR_FORCE_APPOINTMENT_SWR_KEY,
} from "@/hooks";
import { APPOINTMENT_STATUS } from "@/common";
import { FILTER_ALL_VALUE, VALUE_OF_FILTER_ALL_VALUE } from "@/hooks/global";
import { DateRange } from "react-day-picker";
import { set } from "date-fns";

export interface DoctorAppointmentsData {
  keyword?: string;
  date?: DateRange;
  status?: [APPOINTMENT_STATUS | VALUE_OF_FILTER_ALL_VALUE];
}

const initialValues: DoctorAppointmentsData = {
  keyword: "",
  date: { from: new Date(), to: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }) },
  status: [FILTER_ALL_VALUE],
};

export const useDoctorAppointmentsData = () => {
  const data = useSWR<DoctorAppointmentsData>(DOCTOR_APPOINTMENTS_SWR_KEY, null, {
    fallbackData: initialValues,
  });

  const mutateData = (newData: Partial<DoctorAppointmentsData>) => {
    console.log("Check newData", newData);
    data.mutate(
      (prev) => ({
        ...prev!,
        ...newData,
      }),
      false
    );
  };

  return {
    data: data.data,
    mutateData,
  };
};

export const useForceRefreshDoctorAppointment = () => {
  const swr = useSWR<number>(DOCTOR_FORCE_APPOINTMENT_SWR_KEY);

  const forceMutate = () => {
    swr.mutate((prev) => (prev ?? 0) + 1);
  };

  return { swr, forceMutate };
};
