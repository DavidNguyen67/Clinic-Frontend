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
import { ShieldX } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface AccessDenyDialogProps {
  open: boolean;
}

export function AccessDenyDialog({ open }: AccessDenyDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()} // block close on outside click
      >
        <DialogHeader>
          <div className="mb-3 flex justify-center">
            <ShieldX className="size-10 text-red-500" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">Access Denied</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            You don't have permission to access this page. Please contact your administrator if you
            believe this is a mistake.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
