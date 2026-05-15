import { Slot } from "@/components/Booking/StepSchedule/TimePicker/config";
import { useBookingStore } from "@/components/Booking/useBookingStore";
import { cn } from "@/lib/utils";
import { getHours } from "date-fns";
import { Clock } from "lucide-react";

function SlotGroup({
  label,
  slots,
  unavailable,
  onSelect,
}: {
  label: string;
  slots: Slot[];
  unavailable: string[];
  onSelect: (slot: string) => void;
}) {
  const { store } = useBookingStore();

  const selectedTime = store?.time;

  const selectedHour = selectedTime ? getHours(selectedTime) : null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => {
          const slotHour = parseInt(slot.start.split(":")[0], 10);
          const isUnavail = unavailable.includes(slot.start);
          const isSelected = selectedHour === slotHour;
          return (
            <button
              key={slot.start}
              disabled={isUnavail}
              onClick={() => onSelect(slot.start)}
              className={cn(
                "py-2 px-3 rounded-lg text-xs font-medium border-2 transition-all duration-150 text-left",
                isUnavail
                  ? "border-muted bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through"
                  : isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              <Clock
                className={cn(
                  "inline w-3 h-3 mr-1.5 mb-0.5",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SlotGroup;
