"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import { WeeklyDataItem } from "@/components/DoctorDashboard/config";

const WEEKLY_DATA: WeeklyDataItem[] = [
  { day: "Mon", appointments: 8, completed: 7 },
  { day: "Tue", appointments: 12, completed: 10 },
  { day: "Wed", appointments: 6, completed: 6 },
  { day: "Thu", appointments: 14, completed: 11 },
  { day: "Fri", appointments: 9, completed: 8 },
];

export function WeeklySummaryBar() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-6 flex-wrap">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-gray-800">This week:</span>
      </div>

      {WEEKLY_DATA.map((d) => (
        <div key={d.day} className="flex items-center gap-1.5 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{d.day}</span>
          <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded-md">
            {d.appointments}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-emerald-600 font-medium">{d.completed} done</span>
        </div>
      ))}

      <button className="ml-auto flex items-center gap-1 text-xs text-blue-500 font-medium hover:text-blue-700">
        Full schedule <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
