"use client";

import { ROLE_NAME } from "@/common";
import { AccessDenyDialog } from "@/components/AccessDenyDialog";
import { useCurrentProfile } from "@/hooks/auth/useCurrentProfile";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { data } = useCurrentProfile();

  const user = data?.body;

  const isDoctor = user?.role === ROLE_NAME.DOCTOR;

  return (
    <>
      {isDoctor ? children : null}
      <AccessDenyDialog open={!!user && !isDoctor} />
    </>
  );
}
