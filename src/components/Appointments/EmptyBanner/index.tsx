import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

const EmptyBanner = () => (
  <div className="rounded-xl border border-dashed bg-muted/40 p-5 flex items-center gap-4 mb-6">
    <div className="p-2.5 rounded-lg bg-muted">
      <Calendar className="h-5 w-5 text-muted-foreground" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium">No upcoming appointments</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        Book your next visit with a doctor to get started.
      </p>
    </div>
    <Button size="sm" asChild>
      <Link href="/patient/booking">
        <Plus className="h-4 w-4 mr-1.5" /> Book now
      </Link>
    </Button>
  </div>
);

export default EmptyBanner;
