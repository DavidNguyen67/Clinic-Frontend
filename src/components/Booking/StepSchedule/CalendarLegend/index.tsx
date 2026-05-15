import { DayStatus } from "@/components/Booking/StepSchedule/DayButton";

const LEGEND_ITEMS: { status: DayStatus; label: string }[][] = [
  [
    { status: "available", label: "Còn trống" },
    { status: "overtime", label: "Giờ mở rộng" },
    { status: "full", label: "Đã đầy" },
  ],
  [
    { status: "leave", label: "Ngày nghỉ" },
    { status: "disabled", label: "Không khả dụng" },
  ],
];

const legendSampleClass: Record<DayStatus, string> = {
  available: "border border-border rounded-sm bg-background",
  full: "border-2 border-red-400 rounded-sm",
  overtime: "border-2 border-amber-400 rounded-sm",
  leave: "border-2 border-dashed border-slate-400 rounded-sm",
  disabled: "border border-border rounded-sm opacity-40",
};

function CalendarLegend() {
  return (
    <div className="flex flex-col gap-2 px-3 pb-3 pt-1">
      {LEGEND_ITEMS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-4">
          {row.map(({ status, label }) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`inline-block w-5 h-5 shrink-0 ${legendSampleClass[status]}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CalendarLegend;
