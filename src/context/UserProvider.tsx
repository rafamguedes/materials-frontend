import React, { useState, useCallback } from 'react';
import type { UserType } from '../types/UserType';
import type { UserFilterType } from '../types/UserType';
import { fetchUsersApi } from '../api/user';
import { UserContext } from './UserContext';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const defaultFilter: UserFilterType = {
    rows: 5,
    order: 'DESC',
    orderByColumn: 'ID',
  };

  const fetchUsers = useCallback(
    async (filter: UserFilterType = defaultFilter, isNewSearch: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchUsersApi(filter);
        setUsers(prev => isNewSearch ? data.data : [...prev, ...data.data]);
        setNextToken(data.nextToken);
        return data;
      } catch (error: any) {
        setError(error?.message || 'Erro ao buscar usuários');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        loading,
        setLoading,
        error,
        setError,
        nextToken,
        setNextToken,
        fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};