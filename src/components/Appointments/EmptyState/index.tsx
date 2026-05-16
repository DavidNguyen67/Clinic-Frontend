import { APPOINTMENT_TAB } from "@/components/Appointments/config";
import { EMPTY_CONFIG } from "@/components/Appointments/EmptyState/config";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

function EmptyState({ tab }: { tab: APPOINTMENT_TAB }) {
  const cfg = EMPTY_CONFIG[tab] ?? EMPTY_CONFIG.upcoming;
  const { Icon, title, sub, showBook } = cfg;
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-[15px] font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-55 leading-relaxed">{sub}</p>
      {showBook && (
        <Button asChild size="sm" className="mt-1">
          <Link href="/patient/booking">
            <Plus className="h-4 w-4 mr-1" /> Book appointment
          </Link>
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
