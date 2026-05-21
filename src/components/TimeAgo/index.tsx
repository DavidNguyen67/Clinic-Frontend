"use client";

import NumberFlow from "@number-flow/react";
import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

export function parseTimeAgo(date: Date) {
  const totalSeconds = Math.max(0, differenceInSeconds(date, new Date()));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  return {
    days,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
  };
}

interface TimeAgoProps {
  date: Date;
}

export function TimeAgo({ date }: TimeAgoProps) {
  const [time, setTime] = useState(() => parseTimeAgo(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(parseTimeAgo(date));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const unitValues: Record<string, number> = {
    d: time.days,
    h: time.hours,
    m: time.minutes,
    s: time.seconds,
  };

  const units = time.days > 0 ? ["d", "h", "m"] : time.hours > 0 ? ["h", "m", "s"] : ["m", "s"];

  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      {units.map((label) => (
        <span key={label} className="flex items-center">
          <NumberFlow
            value={unitValues[label]}
            className="text-xs"
            format={{ minimumIntegerDigits: 2 }}
          />{" "}
          <span>{label}</span>
        </span>
      ))}
    </span>
  );
}
