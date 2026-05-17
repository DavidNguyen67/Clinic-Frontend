"use client";

import { useSession } from "@/hooks/useSession";
import { ROLE_NAME } from "@/common";
import { AccessDenyDialog } from "@/components/AccessDenyDialog";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSession();

  const isDoctor = user?.role === ROLE_NAME.DOCTOR;

  return (
    <>
      {isDoctor ? children : null}
      <AccessDenyDialog open={!!user && !isDoctor} />
    </>
  );
}
