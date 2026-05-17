"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const WEEKLY_DATA = [
  { period: "Mon", scheduled: 8, completed: 7 },
  { period: "Tue", scheduled: 12, completed: 10 },
  { period: "Wed", scheduled: 6, completed: 6 },
  { period: "Thu", scheduled: 14, completed: 11 },
  { period: "Fri", scheduled: 9, completed: 8 },
  { period: "Sat", scheduled: 5, completed: 5 },
  { period: "Sun", scheduled: 2, completed: 2 },
];

const MONTHLY_DATA = [
  { period: "Jan", scheduled: 98, completed: 87 },
  { period: "Feb", scheduled: 112, completed: 104 },
  { period: "Mar", scheduled: 89, completed: 81 },
  { period: "Apr", scheduled: 134, completed: 120 },
  { period: "May", scheduled: 141, completed: 128 },
  { period: "Jun", scheduled: 127, completed: 118 },
  { period: "Jul", scheduled: 156, completed: 143 },
];

const chartConfig = {
  scheduled: {
    label: "Scheduled",
    color: "#3b82f6",
  },
  completed: {
    label: "Completed",
    color: "#10b981",
  },
} satisfies ChartConfig;

type ChartRange = "weekly" | "monthly";

export function AppointmentChart() {
  const [range, setRange] = useState<ChartRange>("weekly");

  const data = range === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Appointment Trends</h2>
          <p className="text-xs text-gray-400 mt-0.5">Scheduled vs completed</p>
        </div>

        {/* Range toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100">
          {(["weekly", "monthly"] as ChartRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 capitalize",
                range === r
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            width={28}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="scheduled" fill="var(--color-scheduled)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
