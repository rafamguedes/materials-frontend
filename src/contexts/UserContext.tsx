import { createContext, useContext } from 'react';
import type { UserContextType } from '../types/UserContextType';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext deve ser usado dentro do UserProvider');
  return ctx;
};