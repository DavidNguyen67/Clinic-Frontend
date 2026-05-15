import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function StepScheduleSkeleton() {
  return (
    <CardContent className="p-4 h-full flex flex-col gap-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="w-32 h-7 rounded-lg" />
        <Skeleton className="size-8 rounded-full" />
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-8 mx-auto" />
        ))}
      </div>

      {/* Day cells */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, col) => (
              <Skeleton key={col} className="size-10 rounded-full mx-auto" />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-border mt-auto pt-3">
        <div className="flex justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-14" />
          ))}
        </div>
      </div>
    </CardContent>
  );
}

export function TimePickerSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Morning slots */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-16" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Afternoon slots */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-20" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-auto pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-14" />
        ))}
      </div>
    </>
  );
}
