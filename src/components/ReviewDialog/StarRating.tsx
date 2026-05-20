"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-label={`Rate ${star} out of 5`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={cn(
              "rounded p-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !disabled && "hover:scale-110 active:scale-95",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                star <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground h-4">{active > 0 ? LABELS[active] : ""}</p>
    </div>
  );
}
