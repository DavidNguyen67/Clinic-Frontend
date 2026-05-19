"use client";

import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { AuthErrorDialog } from "@/components/AuthErrorDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { useRouter } from "@/i18n/navigation";

const FullscreenLoader = () => (
  <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
  </div>
);

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { refresh, getRedirectPath } = useAuth();
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await refresh();
        const path = getRedirectPath();
        router.push(path || "/");
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, []);

  return (
    <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
      <TooltipProvider delayDuration={150}>
        {initializing ? (
          <FullscreenLoader />
        ) : (
          <>
            <Toaster position="bottom-right" />
            <Header />
            <AuthErrorDialog />
            <LogoutConfirmDialog />
            {children}
          </>
        )}
      </TooltipProvider>
    </SWRConfig>
  );
};

export default ClientProvider;
