import type { UserTokenType } from "./UserType";

export type LoginType = {
  email: string;
  password: string;
};

export interface AuthContextData {
  signed: boolean;
  user: UserTokenType | null;
  token: string | null;
  loading: boolean;
  Login: ({}: LoginType) => Promise<void>;
  Logout: () => void;
}