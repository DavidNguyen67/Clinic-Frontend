import { METHOD } from "@/hooks/global";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
export const useUsers =() =>{
    const useGetListUser = () => {
         return useSWRWrapper("/api/v1/admin/user", {
            url: "/api/v1/admin/user",
            method: METHOD.POST,
          });
    }
    const useCreateUser = () => {
            return useMutation("/v1/admin/user/seed", {
                url: "/v1/admin/user/seed",
                method: METHOD.POST,
                notification: {
                    title: "User Management",
                    message: "User created successfully",
                },
            });
        }
}
