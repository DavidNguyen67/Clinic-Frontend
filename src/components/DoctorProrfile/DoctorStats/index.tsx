"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

function DoctorStats() {
  const [animate, setAnimate] = useState(false);
  const currentProfile = useCurrentProfile();
  const doctor = currentProfile?.data?.body?.doctor;

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const items = [
    {
      label: "Rating",
      // averageRating is a float e.g. 4.8 — animate with 1 decimal place
      numeric: doctor?.averageRating ?? 0,
      format: { minimumFractionDigits: 1, maximumFractionDigits: 1 } as Intl.NumberFormatOptions,
      sub: `${doctor?.totalReviews ?? 0} reviews`,
      subNumeric: doctor?.totalReviews ?? 0,
    },
    {
      label: "Patients",
      numeric: doctor?.totalPatients ?? 0,
      format: undefined,
      sub: "total served",
      subNumeric: null,
    },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-border/50">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Stats
        </p>
      </div>
      <div className="divide-y divide-border/40">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {/* Animate "X reviews" count in the subtitle too */}
                {item.subNumeric != null ? (
                  <>
                    <NumberFlow
                      value={animate ? item.subNumeric : 0}
                      transformTiming={{ duration: 700, easing: "ease-out" }}
                      spinTiming={{ duration: 600, easing: "ease-out" }}
                      opacityTiming={{ duration: 350, easing: "ease-out" }}
                    />{" "}
                    reviews
                  </>
                ) : (
                  item.sub
                )}
              </p>
            </div>

            <p className="text-lg font-bold tabular-nums text-foreground">
              <NumberFlow
                value={animate ? item.numeric : 0}
                transformTiming={{ duration: 700, easing: "ease-out" }}
                spinTiming={{ duration: 600, easing: "ease-out" }}
                opacityTiming={{ duration: 350, easing: "ease-out" }}
              />
            </p>
          </div>
        ))}

        {doctor?.isFeatured && (
          <div className="px-4 py-3">
            <Badge className="text-[10px] gap-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              Featured Doctor
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorStats;
