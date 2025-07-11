import { axiosInstance } from ".";
import type { LoginType } from "../types/AuthContextData";

export async function login({ email, password }: LoginType): Promise<any> {
  return await axiosInstance.post("/authentication/login", {
    email,
    password,
  });
}

export async function logout(): Promise<void> {
  return await axiosInstance.post("/authentication/logout");
}