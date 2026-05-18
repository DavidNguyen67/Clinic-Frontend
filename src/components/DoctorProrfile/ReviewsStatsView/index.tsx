"use client";

import NumberFlow, { Format } from "@number-flow/react";
import { BadgeCheck, Star, ThumbsUp, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

function ReviewsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36 mb-1" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-6 w-32" />
      </CardContent>
    </Card>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
  color,
  format,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  color: "teal" | "amber" | "blue" | "emerald";
  format?: Format;
}) {
  const colorMap = {
    teal: { bg: "bg-teal-50", icon: "text-teal-600", ring: "ring-teal-100" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", ring: "ring-amber-100" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-100" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", ring: "ring-emerald-100" },
  };
  const c = colorMap[color];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div
        className={cn("w-8 h-8 rounded-lg flex items-center justify-center ring-4", c.bg, c.ring)}
      >
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums text-foreground leading-tight">
          <NumberFlow value={value} format={format} />
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= full;
        const isPartial = i === full + 1 && partial > 0;
        const fillPercent = filled ? 100 : isPartial ? partial * 100 : 0;
        const clipId = `star-clip-${i}`;

        return (
          <svg key={i} width="20" height="20" viewBox="0 0 24 24">
            <defs>
              <clipPath id={clipId}>
                <rect x="0" y="0" width={`${fillPercent}%`} height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {fillPercent > 0 && (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#fbbf24"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath={`url(#${clipId})`}
              />
            )}
          </svg>
        );
      })}
      {/* Rating number với NumberFlow */}
      <NumberFlow
        value={rating}
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        className="text-sm font-semibold tabular-nums ml-1"
      />
    </div>
  );
}

export function ReviewsStatsView() {
  const currentProfile = useCurrentProfile();
  const isLoading = currentProfile?.isLoading ?? true;
  const doctor = currentProfile?.data?.body?.doctor;

  if (isLoading) return <ReviewsSkeleton />;

  const rating = Number(doctor?.averageRating ?? 0);
  const totalReviews = doctor?.totalReviews ?? 0;
  const totalPatients = doctor?.totalPatients ?? 0;
  const isFeatured = !!doctor?.isFeatured;

  const satisfactionRate = totalReviews > 0 ? Math.round((rating / 5) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Stats</CardTitle>
          <CardDescription>Your performance at a glance — read-only</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile
              icon={<Star className="h-4 w-4" />}
              label="Avg Rating"
              value={rating}
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
              sub={`${totalReviews} reviews`}
              color="amber"
            />
            <StatTile
              icon={<Users className="h-4 w-4" />}
              label="Total Patients"
              value={totalPatients}
              format={{ useGrouping: true }}
              sub="all time"
              color="blue"
            />
            <StatTile
              icon={<ThumbsUp className="h-4 w-4" />}
              label="Satisfaction"
              value={satisfactionRate}
              format={{ style: "unit", unit: "percent" }}
              sub="based on rating"
              color="emerald"
            />
            <StatTile
              icon={<TrendingUp className="h-4 w-4" />}
              label="Reviews"
              value={totalReviews}
              format={{ useGrouping: true }}
              sub="total received"
              color="teal"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Overall Rating
            </p>
            <StarRatingDisplay rating={rating} />
            <p className="text-xs text-muted-foreground">
              Based on <NumberFlow value={totalReviews} className="font-medium text-foreground" />{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {isFeatured && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <BadgeCheck className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Featured Doctor</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  You are highlighted to patients on the platform
                </p>
              </div>
              <Badge className="ml-auto text-[10px] bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100">
                Active
              </Badge>
            </div>
          )}

          {totalReviews === 0 && (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Star className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">No reviews yet</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Reviews will appear here once patients start rating their consultations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
