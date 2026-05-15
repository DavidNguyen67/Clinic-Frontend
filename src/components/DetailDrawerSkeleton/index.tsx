// DetailDrawerSkeleton.tsx
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function DetailDrawerSkeleton() {
  return (
    <>
      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Status badges + appointment code */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>

        <Separator />

        {/* Appointment info */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Doctor */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Patient */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <Separator />

        {/* Clinical notes */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-5 py-4 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    </>
  );
}

export default DetailDrawerSkeleton;
