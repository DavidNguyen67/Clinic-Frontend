import { METHOD } from "@/hooks/global";
import { useMutation } from "@/hooks/swr";

export const usePatientCreateInvoice = () => {
  return useMutation("/api/v1/patient/invoice", {
    url: "/api/v1/patient/invoice",
    method: METHOD.POST,
    notification: {
      message: "You have successfully created an invoice",
      title: "Invoice",
    },
  });
};
