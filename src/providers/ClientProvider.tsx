"use client";

import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { AuthErrorDialog } from "@/components/AuthErrorDialog";
import { TooltipProvider } from "@/components/ui/tooltip";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
      <TooltipProvider delayDuration={150}>
        <Toaster position="bottom-right" />
        <Header />
        <AuthErrorDialog />
        {children}
      </TooltipProvider>
    </SWRConfig>
  );
};

export default ClientProvider;
