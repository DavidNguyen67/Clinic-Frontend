"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useLogoutDialog } from "@/hooks/useLogoutDialog";
import { useAuth } from "@/hooks/useAuth";

export function LogoutConfirmDialog() {
  const { closeDialog, open } = useLogoutDialog();

  const { logout } = useAuth();

  const router = useRouter();

  async function handleConfirm() {
    closeDialog();
    await logout();
    router.push("/auth/login");
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
          <div className="mb-3 flex justify-center">
            <LogOut className="size-10 text-muted-foreground" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">Sign Out</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Are you sure you want to sign out? You will need to sign in again to access your
            account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
