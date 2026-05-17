"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

function ProfessionalCard() {
  const [animate, setAnimate] = useState(false);
  const currentProfile = useCurrentProfile();
  const doctor = currentProfile?.data?.body?.doctor;

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Separate numeric facts (animatable) from string facts
  const facts = [
    {
      label: "Specialty",
      value: doctor?.specialty?.name,
      numeric: null,
    },
    {
      label: "Degree",
      value: doctor?.degree,
      numeric: null,
    },
    {
      label: "Experience",
      value: doctor?.experienceYears != null ? " yrs" : undefined, // suffix after number
      numeric: doctor?.experienceYears ?? null,
    },
    {
      label: "Fee",
      // Fee is a formatted string — NumberFlow doesn't support currency suffix easily,
      // so we animate the raw number and re-format on the fly via NumberFlow format option
      value: null,
      numeric: doctor?.consultationFee ?? null,
      isFee: true,
    },
  ].filter((f) => f.value !== undefined || f.numeric !== null);

  if (!facts.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-border/50">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Professional
        </p>
      </div>
      <div className="divide-y divide-border/40">
        {facts.map((f) => (
          <div key={f.label} className="px-4 py-2.5 flex items-start justify-between gap-2">
            <p className="text-xs text-muted-foreground shrink-0">{f.label}</p>

            <p className="text-xs font-medium text-foreground text-right">
              {/* Fee — animate number, format as VND */}
              {f.isFee && f.numeric != null ? (
                <NumberFlow
                  value={animate ? f.numeric : 0}
                  format={{ style: "currency", currency: "VND", maximumFractionDigits: 0 }}
                  transformTiming={{ duration: 700, easing: "ease-out" }}
                  spinTiming={{ duration: 600, easing: "ease-out" }}
                  opacityTiming={{ duration: 350, easing: "ease-out" }}
                />
              ) : f.numeric != null ? (
                /* Experience years */
                <>
                  <NumberFlow
                    value={animate ? f.numeric : 0}
                    transformTiming={{ duration: 700, easing: "ease-out" }}
                    spinTiming={{ duration: 600, easing: "ease-out" }}
                    opacityTiming={{ duration: 350, easing: "ease-out" }}
                  />
                  {f.value /* " yrs" suffix */}
                </>
              ) : (
                /* Plain string — no animation */
                f.value
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfessionalCard;
