"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import NumberFlow from "@number-flow/react";
import { Award, Heart, Stethoscope, Users } from "lucide-react";

type StatIcon = "users" | "award" | "stethoscope" | "heart";

interface AboutStatItem {
  icon: StatIcon;
  value: number;
  suffix?: string;
  label: string;
}

interface AboutStatsProps {
  stats: AboutStatItem[];
}

const statIcons: Record<StatIcon, ComponentType<{ className?: string }>> = {
  users: Users,
  award: Award,
  stethoscope: Stethoscope,
  heart: Heart,
};

export function AboutStats({ stats }: AboutStatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="grid md:grid-cols-4 gap-8">
      {stats.map((stat) => {
        const Icon = statIcons[stat.icon];

        return (
          <div
            key={stat.label}
            className="text-center p-[2.4rem] bg-linear-to-br from-blue-50 to-indigo-50 rounded-[1.6rem] transition shadow-base-1"
          >
            <div className="text-blue-600 flex justify-center mb-4">
              <Icon className="w-12 h-12" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              <NumberFlow value={visible ? stat.value : 0} />
              {stat.suffix}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
