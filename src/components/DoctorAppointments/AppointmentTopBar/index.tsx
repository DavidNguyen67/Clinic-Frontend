"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFilterAppointmentsData } from "@/components/DoctorAppointments/hook";
import { APPOINTMENT_STATUS } from "@/common";
import { FILTER_ALL_VALUE, VALUE_OF_FILTER_ALL_VALUE } from "@/hooks/global";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

const filterOptions: { label: string; value: APPOINTMENT_STATUS | VALUE_OF_FILTER_ALL_VALUE }[] = [
  { label: "All", value: FILTER_ALL_VALUE },
  { label: "Pending", value: APPOINTMENT_STATUS.PENDING },
  { label: "Confirmed", value: APPOINTMENT_STATUS.CONFIRMED },
  { label: "Completed", value: APPOINTMENT_STATUS.COMPLETED },
  { label: "Cancelled", value: APPOINTMENT_STATUS.CANCELLED },
  { label: "No Show", value: APPOINTMENT_STATUS.NO_SHOW },
  { label: "In Progress", value: APPOINTMENT_STATUS.IN_PROGRESS },
];

export function AppointmentTopBar() {
  const { data, mutateData } = useFilterAppointmentsData();

  const [innerKeyword, setInnerKeyword] = useState<string>(data?.keyword ?? "");

  const debouncedKeyword = useDebounce(innerKeyword, 600);

  const prevDebouncedKeyword = useRef<string>("");

  useEffect(() => {
    if (debouncedKeyword === prevDebouncedKeyword.current) return;
    prevDebouncedKeyword.current = debouncedKeyword;
    mutateData({ keyword: debouncedKeyword });
  }, [debouncedKeyword]);

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="px-6 md:px-8 h-16 flex items-center gap-4 w-full">
        {/* Title */}
        <h1 className="text-lg font-bold text-gray-900 shrink-0">Appointments</h1>

        {/* Filter pills */}
        <Select
          value={data?.status?.[0]}
          onValueChange={(value: APPOINTMENT_STATUS) => mutateData({ status: [value] })}
        >
          <SelectTrigger className="h-8 w-40 text-xs ml-auto">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-xs">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative w-52 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            value={innerKeyword}
            onChange={(e) => setInnerKeyword(e.target.value)}
            placeholder="Search patient, reason…"
            className="pl-8 h-8 text-xs bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
