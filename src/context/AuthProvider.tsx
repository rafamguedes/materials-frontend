import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextData, LoginType } from "../types/AuthContextData";
import { axiosInstance } from "../api/Axios";
import { useNavigate } from "react-router-dom";
import type { UserTokenType } from "../types/UserType";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserTokenType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storageUser = localStorage.getItem("@Auth:user");
    const storageToken = localStorage.getItem("@Auth:access_token");

    if (storageUser && storageToken) {
      setUser(JSON.parse(storageUser));
    }
    setLoading(false);
  }, []);

  const Login = async ({ email, password }: LoginType) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/authentication/login", {
        email,
        password,
      });

      const { token, id, name, email: userEmail, role } = res.data;
      const loggedInUser = { id, name, email: userEmail, role, token };

      setUser(loggedInUser);
      setToken(token);

      localStorage.setItem("@Auth:access_token", token);
      localStorage.setItem("@Auth:user", JSON.stringify(loggedInUser));
      navigate('/');
    } catch (err) {
      console.error(err);
      console.log("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const Logout = async () => {
    try {
      await axiosInstance.post("/authentication/logout");
    } catch (err) {
      console.error("Erro ao fazer logout", err);
    } finally {
      localStorage.clear();
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, token, loading, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};