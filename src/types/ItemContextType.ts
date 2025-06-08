import type { ItemType } from './ItemType';
import type { ItemFilterType } from './ItemType';

export type ItemContextType = {
  items: ItemType[];
  setItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  nextToken?: string;
  setNextToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchItems: (filter: ItemFilterType, isNewSearch?: boolean) => Promise<void>;
};