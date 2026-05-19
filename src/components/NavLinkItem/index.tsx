"use client";
import { cn } from "@/lib/utils";
import { ICON_MAP } from "./config";
import { Link } from "@/i18n/navigation";
import { NavLink } from "@/components/Header/config";

interface NavLinkItemProps {
  link: NavLink;
  isActive: boolean;
}

export function NavLinkItem({ link, isActive }: NavLinkItemProps) {
  const Icon = ICON_MAP[link.icon];

  return (
    <Link
      href={link.path}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-normal"
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {link.label}
    </Link>
  );
}
