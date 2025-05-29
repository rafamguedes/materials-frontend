import { useEffect, useState } from 'react';
import { message } from 'antd';
import type { ItemType } from '../types/ItemType';
import { getAllItems } from '../api/ItemApi';

export function useFetchItems(open: boolean) {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getAllItems()
        .then((data: ItemType[]) => setItems(data))
        .catch((err: { message?: string }) => {
          message.error(err?.message || 'Erro ao carregar equipamentos');
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  return { items, loading };
}