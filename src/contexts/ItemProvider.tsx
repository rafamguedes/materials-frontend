import React, { useState, useCallback } from 'react';
import type { ItemType } from '../types/ItemType';
import type { ItemFilterType } from '../types/ItemType';
import { fetchItemsApi } from '../apis/item';
import { ItemContext } from './ItemContext';

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const defaultFilter: ItemFilterType = {
    rows: 5,
    order: 'DESC',
    orderByColumn: 'ID',
  };

  const fetchItems = useCallback(
    async (filter: ItemFilterType = defaultFilter, isNewSearch: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchItemsApi(filter, isNewSearch);
        setItems(prev => isNewSearch ? data.data : [...prev, ...data.data]);
        setNextToken(data.nextToken);
      } catch (error: any) {
        setError(error?.message || 'Erro ao buscar equipamentos');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <ItemContext.Provider
      value={{
        items,
        setItems,
        loading,
        setLoading,
        error,
        setError,
        nextToken,
        setNextToken,
        fetchItems,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};