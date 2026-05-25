import { APPOINTMENT_STATUS } from "@/common";
import { TYPE_OF_FILTER_ALL_VALUE } from "@/hooks/global";

export type AppointmentFormFilter = {
  patientName: string;
  status: APPOINTMENT_STATUS | TYPE_OF_FILTER_ALL_VALUE;
  dateFrom: Date | null;
  dateTo: Date | null;
};
