import { METHOD } from "@/hooks/global";
import { useMutation, useSWRWrapper } from "@/hooks/swr";
import { UserAdminResponse, UserItem } from "@/interface";

export const useUsers = (size?: number, page?: number) => {
   const createUser = useMutation('api/v1/admin/user', {
    url: 'api/v1/admin/user',
    method: METHOD.POST,
    loading: true,
    notification: {
      title: 'Create User',
      message: 'User created successfully',
    },
  });
  const updateUser = useMutation('api/v1/admin/user', {
    url: `/api/v1/admin/user/{id}`,
    method: METHOD.PATCH,
    loading: true,
    notification: {
      title: 'Update User',
      message: 'User updated successfully',
    },
  });
  const getListUsers = useSWRWrapper<UserAdminResponse>(`api/v1/admin/user/?size=${size || 10}&page=${page || 1}`, {
    url: `api/v1/admin/user?size=${size || 10}&page=${page || 1}`,
    method: METHOD.GET,
    auth: true,
    
  });
    const deleteUser = useMutation<UserItem>('/api/v1/admin/user', {
    url: `/api/v1/admin/user/{id}`,
    method: METHOD.DELETE,
    loading: true,
    notification: {
      title: 'Delete User',
      message: 'User deleted successfully',
    },
  });
  
  return {
   createUser, getListUsers, deleteUser, updateUser
  };
};
