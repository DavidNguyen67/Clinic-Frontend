"use client";

import { useState } from "react";
import { KeyRound, Loader2, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ── Reset Password Action ─────────────────────────────────────────────────────

function ResetPasswordAction() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    // TODO: call reset password API
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  };

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">Reset Password</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleReset}
        disabled={loading}
        className="shrink-0 h-7 text-[11px] gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <KeyRound className="h-3 w-3" />}
        Send Link
      </Button>
    </div>
  );
}

// ── Deactivate Action ─────────────────────────────────────────────────────────

function DeactivateAction() {
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    // TODO: call deactivate / soft-delete API
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  };

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">Deactivate Account</p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            className="shrink-0 h-7 text-[11px] gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ShieldOff className="h-3 w-3" />
            )}
            Deactivate
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate staff account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disable the account immediately. The staff will lose access to the system.
              You can reactivate the account at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export function QuickActionsCard() {
  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      {/* Accent top bar — mirrors pattern from hero header */}
      <div className="h-0.5 w-full bg-linear-to-r from-indigo-500 to-violet-400" />

      <CardHeader className="pb-1 pt-3 px-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-3 space-y-0 divide-y divide-border/40">
        <ResetPasswordAction />
        <DeactivateAction />
      </CardContent>
    </Card>
  );
}
