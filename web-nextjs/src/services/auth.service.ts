import { LoginRequest, LoginResponse } from "@/interfaces";
import { apiFetch } from "./base";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT + "auth/";

const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  return apiFetch(baseUrl + "login", "post", {
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { login };
