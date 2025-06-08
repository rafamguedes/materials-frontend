import { createContext, useContext } from 'react';
import type { ItemContextType } from '../types/ItemContextType';

export const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItemContext = () => {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error('useItemContext deve ser usado dentro do ItemProvider');
  return ctx;
};