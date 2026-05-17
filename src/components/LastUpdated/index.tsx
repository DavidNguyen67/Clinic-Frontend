import { Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

function LastUpdated({ date }: { date: Date }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-2.5">
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />

      <p className="text-xs text-muted-foreground">
        Last updated: <span className="font-medium text-foreground">{formatDateTime(date)}</span>
      </p>
    </div>
  );
}

export default LastUpdated;
