"use server";
import { LoginRequest, LoginResponse, GetUserInfoResponse } from "@/interfaces";
import { apiServerFetch } from "@/services/base";
import { cookies } from "next/headers";

const loginAction = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const response = await apiServerFetch<LoginResponse>("auth/login", "post", {
    body: JSON.stringify({ email, password }),
  });

  if (response.data?.token) {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", response.data.token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "none",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  }
  return response;
};

const verifyTokenAction = async (): Promise<GetUserInfoResponse> => {
  return apiServerFetch<GetUserInfoResponse>("auth/verifyToken", "get");
};

export { loginAction, verifyTokenAction };
