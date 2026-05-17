"use client";

function QuickFacts({
  gender,
  dob,
  bloodType,
}: {
  gender?: string;
  dob?: string;
  bloodType?: string;
}) {
  const rows = [
    { label: "Gender", value: gender },
    { label: "Date of Birth", value: dob },
    { label: "Blood Type", value: bloodType },
  ].filter((r) => r.value);

  if (!rows.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Overview
      </span>

      <dl className="space-y-2 mt-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2">
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="text-xs font-medium text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default QuickFacts;
