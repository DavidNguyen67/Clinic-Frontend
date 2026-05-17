"use client";

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

// ── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: "teal" | "amber" | "blue" | "emerald";
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
        <p className="text-2xl font-bold tabular-nums text-foreground leading-tight">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Star rating bar ───────────────────────────────────────────────────────────
function StarRatingDisplay({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= full;
        const isPartial = i === full + 1 && partial > 0;
        return (
          <div key={i} className="relative h-5 w-5">
            {/* Background star */}
            <Star className="h-5 w-5 text-muted/30 fill-muted/20" />
            {/* Filled portion */}
            {(filled || isPartial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${partial * 100}%` }}
              >
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              </div>
            )}
          </div>
        );
      })}
      <span className="text-sm font-semibold tabular-nums text-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function ReviewsStatsView() {
  const currentProfile = useCurrentProfile();
  const isLoading = currentProfile?.isLoading ?? true;
  const doctor = currentProfile?.data?.body?.doctor;

  if (isLoading) return <ReviewsSkeleton />;

  const rating = Number(doctor?.averageRating ?? 0);
  const totalReviews = doctor?.totalReviews ?? 0;
  const totalPatients = doctor?.totalPatients ?? 0;
  const isFeatured = !!doctor?.isFeatured;

  // Completion rate proxy: treat as satisfied if rating >= 4
  const satisfactionRate = totalReviews > 0 ? Math.round((rating / 5) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Stats</CardTitle>
          <CardDescription>Your performance at a glance — read-only</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile
              icon={<Star className="h-4 w-4" />}
              label="Avg Rating"
              value={rating.toFixed(1)}
              sub={`${totalReviews} reviews`}
              color="amber"
            />
            <StatTile
              icon={<Users className="h-4 w-4" />}
              label="Total Patients"
              value={totalPatients.toLocaleString()}
              sub="all time"
              color="blue"
            />
            <StatTile
              icon={<ThumbsUp className="h-4 w-4" />}
              label="Satisfaction"
              value={`${satisfactionRate}%`}
              sub="based on rating"
              color="emerald"
            />
            <StatTile
              icon={<TrendingUp className="h-4 w-4" />}
              label="Reviews"
              value={totalReviews.toLocaleString()}
              sub="total received"
              color="teal"
            />
          </div>

          {/* Star visual */}
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Overall Rating
            </p>
            <StarRatingDisplay rating={rating} />
            <p className="text-xs text-muted-foreground">
              Based on <span className="font-medium text-foreground">{totalReviews}</span>{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Featured badge */}
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

          {/* Empty state */}
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
