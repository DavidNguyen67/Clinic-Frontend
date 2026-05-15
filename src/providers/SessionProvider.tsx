"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSession";

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
