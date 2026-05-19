import useSWR from "swr";
import {
  DOCTOR_APPOINTMENTS_SWR_KEY,
  FORCE_APPOINTMENT_SWR_KEY,
  STAFF_APPOINTMENTS_SWR_KEY,
} from "@/hooks";
import { APPOINTMENT_STATUS, ROLE_NAME } from "@/common";
import { FILTER_ALL_VALUE, VALUE_OF_FILTER_ALL_VALUE } from "@/hooks/global";
import { DateRange } from "react-day-picker";
import { set } from "date-fns";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

export interface FilterAppointmentData {
  keyword?: string;
  date?: DateRange;
  status?: [APPOINTMENT_STATUS | VALUE_OF_FILTER_ALL_VALUE];
}

const initialValues: FilterAppointmentData = {
  keyword: "",
  date: {
    from: set(new Date(), { hours: 0, minutes: 0, seconds: 0, date: new Date().getDate() - 7 }),
    to: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }),
  },
  status: [FILTER_ALL_VALUE],
};

export const useFilterAppointmentsData = () => {
  const { data: currentProfileData } = useCurrentProfile();

  const role = currentProfileData?.body?.role;

  const getKey = () => {
    if (role === ROLE_NAME.DOCTOR) {
      return DOCTOR_APPOINTMENTS_SWR_KEY;
    }
    if (role === ROLE_NAME.STAFF) {
      return STAFF_APPOINTMENTS_SWR_KEY;
    }
  };

  const data = useSWR<FilterAppointmentData>(getKey(), null, {
    fallbackData: initialValues,
  });

  const mutateData = (newData: Partial<FilterAppointmentData>) => {
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

export const useForceRefreshAppointments = () => {
  const { data: currentProfileData } = useCurrentProfile();

  const swr = useSWR<boolean>(FORCE_APPOINTMENT_SWR_KEY);

  const forceMutate = () => {
    swr.mutate(true);
  };

  const clearForce = () => {
    swr.mutate(false);
  };

  return { swr, forceMutate, clearForce };
};
