import { Shield } from "lucide-react";

function PrivacyNote() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 flex gap-2.5">
      <Shield className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />

      <p className="text-xs text-muted-foreground leading-relaxed">
        Your information is encrypted and protected according to medical security standards.
      </p>
    </div>
  );
}

export default PrivacyNote;
