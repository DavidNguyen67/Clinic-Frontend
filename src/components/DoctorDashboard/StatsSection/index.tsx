"use client";

import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { useDoctorAppointmentStats } from "@/hooks/doctor/useDoctorAppointment";
import { COLOR_MAP, StatItem } from "@/components/DoctorDashboard/config";

const STATS: StatItem[] = [
  {
    label: "Total This Month",
    value: "141",
    delta: "+11%",
    positive: true,
    icon: CalendarCheck,
    color: "blue",
    sub: "vs last month",
  },
  {
    label: "Pending Approval",
    value: "4",
    delta: "2 urgent",
    positive: false,
    icon: Clock,
    color: "amber",
    sub: "needs action",
  },
  {
    label: "Completed",
    value: "128",
    delta: "90.8%",
    positive: true,
    icon: CheckCircle2,
    color: "emerald",
    sub: "completion rate",
  },
  {
    label: "Cancelled",
    value: "13",
    delta: "-3 vs avg",
    positive: true,
    icon: XCircle,
    color: "rose",
    sub: "this month",
  },
];

function StatCard({ stat }: { stat: StatItem }) {
  const c = COLOR_MAP[stat.color];
  const Icon = stat.icon;
  const numericValue = parseInt(stat.value, 10);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center ring-4",
            c.bg,
            c.ring
          )}
        >
          <Icon className={cn("w-5 h-5", c.icon)} />
        </div>
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          )}
        >
          {stat.delta}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          <NumberFlow
            value={numericValue}
            transformTiming={{ duration: 700, easing: "ease-out" }}
            spinTiming={{ duration: 600, easing: "ease-out" }}
            opacityTiming={{ duration: 350, easing: "ease-out" }}
          />
        </p>
        <p className="text-sm font-medium text-gray-500 mt-0.5">{stat.label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const {} = useDoctorAppointmentStats();
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
