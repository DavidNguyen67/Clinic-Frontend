"use client";

import { useFormik } from "formik";
import { CalendarIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { FILTER_ALL_VALUE } from "@/hooks/global";
import { STATUS_CONFIG } from "@/components/DoctorAppointments/config";
import { AppointmentFormFilter } from "@/components/AppoinmentManagement/AppointmentFilterBar/config";
import { useEffect, useRef } from "react";

interface AppointmentFilterBarProps {
  filter: AppointmentFormFilter;
  onChange: (filter: AppointmentFormFilter) => void;
}

export function AppointmentFilterBar({ filter, onChange }: AppointmentFilterBarProps) {
  const initialValues = useRef<AppointmentFormFilter>({
    patientName: filter.patientName,
    status: filter.status,
    dateFrom: filter.dateFrom,
    dateTo: filter.dateTo,
  });

  const formik = useFormik({
    initialValues: initialValues.current,
    enableReinitialize: false,
    onSubmit: (values) => onChange(values),
  });

  useEffect(() => {
    initialValues.current = {
      patientName: filter.patientName || "",
      status: filter.status || FILTER_ALL_VALUE,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
    };
    formik.setValues(initialValues.current);
  }, [filter]);

  const hasActiveFilter =
    formik.values.patientName ||
    formik.values.status !== FILTER_ALL_VALUE ||
    formik.values.dateFrom ||
    formik.values.dateTo;

  const handleReset = () => {
    const reset: AppointmentFormFilter = {
      patientName: "",
      status: FILTER_ALL_VALUE,
      dateFrom: null,
      dateTo: null,
    };
    initialValues.current = reset;
    formik.resetForm({ values: reset });
    onChange(reset);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-wrap items-end gap-2">
      {/* Search by patient name */}
      <div className="relative flex-1 min-w-45">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <Input
          id="patientName"
          name="patientName"
          placeholder="Tìm tên bệnh nhân..."
          value={formik.values.patientName}
          onChange={formik.handleChange}
          className="pl-8 h-9 text-sm border-slate-200 bg-white"
        />
      </div>

      {/* Status */}
      <Select
        value={formik.values.status}
        onValueChange={(val) => formik.setFieldValue("status", val)}
      >
        <SelectTrigger className="w-42.5 h-9! text-sm border-slate-200 bg-white">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL_VALUE}>Tất cả trạng thái</SelectItem>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <SelectItem key={key} value={key}>
              {cfg.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date from */}
      <div className="flex flex-col gap-0.5">
        <label className="text-[10px] text-slate-400 pl-0.5">Từ ngày</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-9 w-35 justify-start text-left text-sm font-normal border-slate-200 bg-white",
                !formik.values.dateFrom && "text-slate-400"
              )}
            >
              <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
              {formik.values.dateFrom ? formatDate(formik.values.dateFrom) : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.dateFrom!}
              onSelect={(date) => formik.setFieldValue("dateFrom", date)}
              disabled={(date) => (formik.values.dateTo ? date > formik.values.dateTo! : false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date to */}
      <div className="flex flex-col gap-0.5">
        <label className="text-[10px] text-slate-400 pl-0.5">Đến ngày</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-9 w-35 justify-start text-left text-sm font-normal border-slate-200 bg-white",
                !formik.values.dateTo && "text-slate-400"
              )}
            >
              <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
              {formik.values.dateTo ? formatDate(formik.values.dateTo) : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.dateTo!}
              onSelect={(date) => formik.setFieldValue("dateTo", date)}
              disabled={(date) => (formik.values.dateFrom ? date < formik.values.dateFrom : false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="submit"
        size="sm"
        className="h-9 px-4 bg-slate-800 hover:bg-slate-700 text-white"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
        Lọc
      </Button>

      {hasActiveFilter && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-9 text-slate-500 hover:text-slate-800"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Xoá lọc
        </Button>
      )}
    </form>
  );
}
