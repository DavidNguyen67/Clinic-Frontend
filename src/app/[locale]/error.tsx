"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const t = useTranslations("error");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Log lỗi lên error reporting service (Sentry, etc.)
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header badge */}
        <div className="flex items-center justify-center">
          <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-sm">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t("badge")}
          </Badge>
        </div>

        {/* Main error card */}
        <Card className="border-destructive/30 shadow-lg">
          <CardHeader className="pb-4 text-center">
            {/* Icon circle */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">{t("title")}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {t("description")}
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-4">
            {/* Error message */}
            {error.message && (
              <div className="rounded-lg bg-muted px-4 py-3">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t("details")}
                </p>
                <p className="text-sm font-mono text-foreground break-all">{error.message}</p>
              </div>
            )}

            {/* Digest / Error ID */}
            {error.digest && (
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2.5">
                <span className="text-xs text-muted-foreground">{t("errorId")}</span>
                <code className="text-xs font-mono font-semibold text-foreground">
                  {error.digest}
                </code>
              </div>
            )}

            {/* Stack trace collapsible */}
            {process.env.NODE_ENV === "development" && error.stack && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-muted-foreground hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Bug className="h-3.5 w-3.5" />
                      {t("stackTrace")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 rounded-lg bg-muted p-3 max-h-48 overflow-auto">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="pt-5 flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="w-full sm:flex-1 gap-2" size="lg">
              <RefreshCw className="h-4 w-4" />
              {t("retry")}
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1 gap-2"
              size="lg"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="h-4 w-4" />
              {t("home")}
            </Button>
          </CardFooter>
        </Card>

        {/* Support note */}
        <p className="text-center text-xs text-muted-foreground">
          {t("supportPrefix")}{" "}
          <a
            href="mailto:support@example.com"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {t("supportLink")}
          </a>
        </p>
      </div>
    </div>
  );
}
