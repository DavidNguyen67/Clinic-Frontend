"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSession";
import { usePathname, useRouter } from "@/i18n/navigation";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { saveRedirectPath } = useAuth();
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      try {
        if (!isAuthenticated) {
          saveRedirectPath(pathname);
          router.replace("/auth/login");
        }
      } finally {
      }
    };
    init();
  }, []);

  return children;
};

export default SessionProvider;
