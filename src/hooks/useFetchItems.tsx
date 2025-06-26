import { useEffect, useState } from 'react';
import { message } from 'antd';
import type { ItemType } from '../types/ItemType';
import { fetchItemsApi } from '../api/item';

export function useFetchItems(open: boolean) {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchItemsApi({}, true)
        .then((data) => setItems(data.data))
        .catch((err: { message?: string }) => {
          message.error(err?.message || 'Erro ao carregar equipamentos');
        })
        .finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [open]);

  return { items, loading };
}

export function getItems() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchItemsApi({}, true)
      .then((data) => setItems(data.data))
      .catch((err: { message?: string }) => {
        message.error(err?.message || 'Erro ao carregar equipamentos');
      })
    .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}