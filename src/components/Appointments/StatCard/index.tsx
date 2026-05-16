import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "bg-muted text-foreground",
  info: "bg-blue-50   text-blue-700   dark:bg-blue-950  dark:text-blue-300",
  success: "bg-green-50  text-green-700  dark:bg-green-950 dark:text-green-300",
  warning: "bg-amber-50  text-amber-700  dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-50    text-red-700    dark:bg-red-950   dark:text-red-300",
};

const StatCard = ({ label, value, icon, variant = "default", className }: StatCardProps) => (
  <div className={cn("rounded-xl border bg-card p-4 flex items-center gap-4", className)}>
    <div className={cn("p-2.5 rounded-lg", variantStyles[variant])}>{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-xl font-semibold">{<NumberFlow value={Number(value)} />}</p>
    </div>
  </div>
);

export default StatCard;
