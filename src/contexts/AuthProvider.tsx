import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextData, LoginType } from "../types/AuthContextData";
import type { UserTokenType } from "../types/UserType";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../apis/login";
import { notification } from "antd";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserTokenType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const notify = (type: 'success' | 'error', message: string, description?: string) => {
    api[type]({
      message,
      description,
      showProgress: false,
      pauseOnHover: true,
    });
  };

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem("@Auth:user");
      const storageToken = localStorage.getItem("@Auth:access_token");

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        setToken(storageToken);
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const Login = async ({ email, password }: LoginType) => {
    try {
      const res = await login({ email, password });
      const { token, id, name, email: userEmail, role } = res.data;
      const loggedInUser = { id, name, email: userEmail, role, token };

      setUser(loggedInUser);
      setToken(token);

      localStorage.setItem("@Auth:access_token", token);
      localStorage.setItem("@Auth:user", JSON.stringify(loggedInUser));
      navigate('/');
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || 
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message || 'Erro ao fazer login';
      notify('error', 'Erro ao fazer login', apiMessage);
    }
  };

  const Logout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("@Auth:access_token");
      localStorage.removeItem("@Auth:user");
      localStorage.removeItem("@Auth:refresh_token");
      setLoading(false);
      navigate('/login');
      notify('success', 'Logout realizado com sucesso');
    }
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, token, Login, loading, Logout }}
    >
      {children}
      {contextHolder}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};