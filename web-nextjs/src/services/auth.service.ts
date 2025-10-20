import { LoginRequest, LoginResponse } from "@/interfaces";
import { apiFetch } from "./base";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT + "auth/";

const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const response = await apiFetch<LoginResponse>(baseUrl + "login", "post", {
    body: JSON.stringify({ email, password }),
  });

  if (response.data?.token) {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  }
  return response;
};

export { login };
