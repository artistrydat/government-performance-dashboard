import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { Id } from '../../../api/convex/_generated/dataModel';

export function useUsers() {
  const users = useQuery(api.users.list);
  const createUser = useMutation(api.users.create);
  const updateUser = useMutation(api.users.update);
  const deleteUser = useMutation(api.users.remove);

  return {
    users: users || [],
    isLoading: users === undefined,
    createUser,
    updateUser,
    deleteUser,
  };
}

export function useUser(id: Id<'users'> | null) {
  const user = useQuery(api.users.get, id ? { userId: id } : 'skip');
  const updateUser = useMutation(api.users.update);
  const deleteUser = useMutation(api.users.remove);

  return {
    user: user || null,
    isLoading: user === undefined,
    updateUser,
    deleteUser,
  };
}

export function useUserByEmail(email: string | null) {
  const user = useQuery(api.users.getByEmail, email ? { email } : 'skip');

  return {
    user: user || null,
    isLoading: user === undefined,
  };
}

export function useUsersByRole(role: 'executive' | 'portfolio_manager' | 'project_officer' | null) {
  const users = useQuery(api.users.listByRole, role ? { role } : 'skip');

  return {
    users: users || [],
    isLoading: users === undefined,
  };
}

export function useUserStatistics() {
  const statistics = useQuery(api.users.getStatistics);

  return {
    statistics: statistics || null,
    isLoading: statistics === undefined,
  };
}

export function useUserDetails(userId: Id<'users'> | null) {
  const userDetails = useQuery(api.users.getWithDetails, userId ? { userId } : 'skip');

  return {
    userDetails: userDetails || null,
    isLoading: userDetails === undefined,
  };
}
