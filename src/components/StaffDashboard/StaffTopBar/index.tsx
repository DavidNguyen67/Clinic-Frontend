"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { formatDate } from "@/lib/utils";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

export function StaffTopBar() {
  const today = useRef(new Date());
  const { data } = useCurrentProfile();
  const user = data?.body;
  const t = useTranslations("staff.dashboard");

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="px-6 md:px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xs text-gray-400">{formatDate(today.current)}</p>
        </div>
      </div>
    </div>
  );
}
