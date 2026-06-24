import { METHOD } from "@/hooks/global";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
import { ServiceAdminResponse, UserItem } from "@/interface";

export const useServices = (size?: number, page?: number, search?: string, status?: string) => {
    const getStatus = (status: string | undefined) => {
        if (status === "active") return true;
        if (status === "inactive") return false;
        return undefined;
    }
    const getFeatured = (status: string | undefined) => {
        if (status === "featured") return true;
        return undefined;
    }
   const createUser = useMutation('api/v1/admin/service', {
    url: 'api/v1/admin/service',
    method: METHOD.POST,
    loading: true,
    notification: {
      title: 'Create Service',
      message: 'Service created successfully',
    },
  });
  const updateUser = useMutation('api/v1/admin/service', {
    url: `/api/v1/admin/service/{id}`,
    method: METHOD.PATCH,
    loading: true,
    notification: {
      title: 'Update Service',
      message: 'Service updated successfully',
    },
  });
  const getListServices = useSWRWrapper<ServiceAdminResponse>(`api/v1/admin/service/?size=${size || 10}&page=${page || 1}`, {
    url: `api/v1/admin/service?size=${size || 10}&page=${page || 1}&search=${search}&isActive=${getStatus(status)}&isFeatured=${getFeatured(status)}`,
    method: METHOD.GET,
    auth: true,
    
  });
    const deleteUser = useMutation<UserItem>('/api/v1/admin/service', {
    url: `/api/v1/admin/service/{id}`,
    method: METHOD.DELETE,
    loading: true,
    notification: {
      title: 'Delete Service',
      message: 'Service deleted successfully',
    },
  });
  
  return {
   createUser, getListServices, deleteUser, updateUser
  };
};
