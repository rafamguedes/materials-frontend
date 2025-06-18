import type { UserType } from './UserType';
import type { UserFilterType } from './UserType';

export type UserContextType = {
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  nextToken?: string;
  setNextToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchUsers: (filter: UserFilterType, isNewSearch?: boolean) => Promise<any>;
};