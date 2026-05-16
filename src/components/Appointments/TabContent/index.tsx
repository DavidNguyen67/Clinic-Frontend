"use client";
import { useCallback, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppointmentCard from "@/components/Appointments/AppointmentCard";
import AppointmentSkeleton from "@/components/Appointments/AppointmentSkeleton";
import EmptyState from "@/components/Appointments/EmptyState";
import { BaseFilter } from "@/interface/response";
import { APPOINTMENT_STATUS, BOOKING_TYPE } from "@/common";
import { useDebounce } from "@/hooks/useDebounce";
import { usePatientAppointment } from "@/hooks/patient/usePatientAppointment";
import { APPOINTMENT_TAB } from "@/components/Appointments/config";
import { FILTER_ALL_VALUE, VALUE_OF_FILTER_ALL_VALUE } from "@/hooks/global";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useForceRefreshAppointment } from "@/components/Appointments/TabContent/hook";
import { formatDateToApi } from "@/lib/utils";
import { set } from "date-fns";

const CARD_ESTIMATED_HEIGHT = 120;

interface TabContentProps {
  tab: APPOINTMENT_TAB;
}

export interface AppointmentFilterFormValues extends BaseFilter {
  keyword?: string;
  bookingType?: BOOKING_TYPE | VALUE_OF_FILTER_ALL_VALUE;
  fromDate?: string; //HH:mm dd/MM/yyyy
  toDate?: string; //HH:mm dd/MM/yyyy
  status?: APPOINTMENT_STATUS[];
}

function TabContent({ tab }: TabContentProps) {
  const { swr } = useForceRefreshAppointment();

  const initialValues = useRef<AppointmentFilterFormValues & { typeTime: APPOINTMENT_TAB }>({
    keyword: "",
    typeTime: tab,
    bookingType: FILTER_ALL_VALUE,
  });

  const formik = useFormik<AppointmentFilterFormValues & { typeTime: APPOINTMENT_TAB }>({
    initialValues: initialValues.current,
    onSubmit: () => {},
  });

  const debouncedKeyword = useDebounce(formik.values.keyword, 600);

  const buildFilter = useCallback((): AppointmentFilterFormValues => {
    const { typeTime, bookingType } = formik.values;
    const now = new Date();

    const base = { keyword: debouncedKeyword, bookingType };

    const ACTIVE_STATUSES = [
      APPOINTMENT_STATUS.PENDING,
      APPOINTMENT_STATUS.CONFIRMED,
      APPOINTMENT_STATUS.IN_PROGRESS,
    ];

    const CONFIG: Partial<Record<APPOINTMENT_TAB, Partial<AppointmentFilterFormValues>>> = {
      [APPOINTMENT_TAB.TODAY]: {
        fromDate: formatDateToApi(now, "HH:mm dd/MM/yyyy"),
        toDate: formatDateToApi(now, "HH:mm dd/MM/yyyy"),
        status: ACTIVE_STATUSES,
      },
      [APPOINTMENT_TAB.UPCOMING]: {
        fromDate: formatDateToApi(now, "HH:mm dd/MM/yyyy"),
        toDate: formatDateToApi(
          set(now, { date: now.getDate() + 7, hours: 23, minutes: 59, seconds: 59 }),
          "HH:mm dd/MM/yyyy"
        ),
        status: ACTIVE_STATUSES,
      },
      [APPOINTMENT_TAB.COMPLETED]: { status: [APPOINTMENT_STATUS.COMPLETED] },
      [APPOINTMENT_TAB.CANCELLED]: { status: [APPOINTMENT_STATUS.CANCELLED] },
      [APPOINTMENT_TAB.PENDING]: {
        status: [APPOINTMENT_STATUS.PENDING],
        fromDate: formatDateToApi(now, "HH:mm dd/MM/yyyy"),
      },
    };

    return { ...base, ...CONFIG[typeTime] };
  }, [debouncedKeyword, formik.values.typeTime, formik.values.bookingType]);

  const patientAppointment = usePatientAppointment(buildFilter());

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    patientAppointment.mutate();
  }, [swr?.data]);

  useEffect(() => {
    formik.setFieldValue("typeTime", tab);
  }, [tab]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: patientAppointment?.data?.body?.data?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_ESTIMATED_HEIGHT,
    overscan: 3,
  });

  return (
    <div className="flex flex-col gap-3 h-full flex-1">
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 h-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            name="keyword"
            className="pl-8 text-sm"
            placeholder="Search by doctor, specialty, code…"
            id="keyword"
            value={formik.values.keyword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="h-full">
          <Select
            name="bookingType"
            value={formik.values.bookingType}
            onValueChange={(value: BOOKING_TYPE) => formik.setFieldValue("bookingType", value)}
          >
            <SelectTrigger className="h-full text-sm w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FILTER_ALL_VALUE}>All types</SelectItem>
              {Object.values(BOOKING_TYPE).map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {patientAppointment?.isLoading ? (
        <AppointmentSkeleton />
      ) : !patientAppointment?.data?.body?.data?.length ? (
        <EmptyState tab={tab} />
      ) : (
        <div ref={parentRef} className="h-full flex-1 overflow-y-auto">
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                className="absolute top-0 right-0 left-0 px-1 py-2"
                ref={virtualizer.measureElement}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <AppointmentCard apt={patientAppointment?.data?.body?.data?.[virtualRow?.index]!} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TabContent;
