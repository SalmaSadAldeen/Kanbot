import { request } from "./client.ts";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  MeResponse,
} from "../types/api.ts";

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>("POST", "/auth/register", data);
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>("POST", "/auth/login", data);
}

export async function getMe(): Promise<MeResponse> {
  return request<MeResponse>("GET", "/auth/me");
}
