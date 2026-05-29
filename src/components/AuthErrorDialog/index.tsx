"use client";

import { useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, ShieldX } from "lucide-react";
import { useAuthDialog } from "@/hooks/useAuthDialog";

const CONFIG = {
  unauthenticated: {
    icon: <LogIn className="size-10 text-yellow-500" />,
    title: "Session Expired",
    description:
      "Your session has expired or you are not logged in. Please sign in to continue accessing this page.",
    confirmLabel: "Sign In",
    cancelLabel: "Dismiss",
  },
  "access-denied": {
    icon: <ShieldX className="size-10 text-red-500" />,
    title: "Access Denied",
    description:
      "You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.",
    confirmLabel: "Go to Home",
    cancelLabel: "Close",
  },
} as const;

export function AuthErrorDialog() {
  const router = useRouter();
  const { open, type, close } = useAuthDialog();

  if (!type) return null;

  const { icon, title, description, confirmLabel, cancelLabel } = CONFIG[type];

  function handleConfirm() {
    close();
    if (type === "unauthenticated") {
      router.push("/auth/login");
    } else {
      router.push("/");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-3 flex justify-center">{icon}</div>
          <DialogTitle className="text-center text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={close}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
