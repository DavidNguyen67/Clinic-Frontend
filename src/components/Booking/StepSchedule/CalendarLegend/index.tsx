import { DAY_STATUS } from "@/common";

const LEGEND_ITEMS: { status: DAY_STATUS; label: string }[][] = [
  [
    { status: DAY_STATUS.AVAILABLE, label: "Available" },
    { status: DAY_STATUS.OVERTIME, label: "Extended Hours" },
    { status: DAY_STATUS.FULL, label: "Fully Booked" },
  ],
  [
    { status: DAY_STATUS.LEAVE, label: "Day Off" },
    { status: DAY_STATUS.DISABLED, label: "Unavailable" },
  ],
];
const legendSampleClass: Record<DAY_STATUS, string> = {
  [DAY_STATUS.AVAILABLE]: "border border-border rounded-sm bg-background",
  [DAY_STATUS.FULL]: "border-2 border-red-400 rounded-sm",
  [DAY_STATUS.OVERTIME]: "border-2 border-amber-400 rounded-sm",
  [DAY_STATUS.LEAVE]: "border-2 border-dashed border-slate-400 rounded-sm",
  [DAY_STATUS.DISABLED]: "border border-border rounded-sm opacity-40",
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
